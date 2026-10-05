// src/pages/Contact.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   Configuration (centralisée, hors composant)
   ───────────────────────────────────────────────────────────── */
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const CONFIG = {
  nameMinLength: 2,
  messageMinLength: 10,
  messageMaxLength: 1000,
  subjectMaxLength: 120,
  successDuration: 6000,
  requestTimeout: 15000,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `company` est un champ « pot de miel » (honeypot) :
 * invisible pour l'humain, rempli uniquement par les robots.
 */
const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
};

/* ─────────────────────────────────────────────────────────────
   Données statiques — définies hors du composant :
   elles ne sont jamais recréées à chaque rendu.
   ───────────────────────────────────────────────────────────── */
const CONTACT_INFOS = [
  { icon: '📧', label: 'Email', value: 'email@example.com', href: 'mailto:email@example.com' },
  { icon: '📍', label: 'Localisation', value: 'Fianarantsoa, Madagascar' },
  { icon: '📱', label: 'Téléphone', value: '+261 34 00 000 00', href: 'tel:+261340000000' },
];

const SOCIALS = [
  { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
];

/* ─────────────────────────────────────────────────────────────
   Validation — fonctions pures, testables isolément
   ───────────────────────────────────────────────────────────── */
const FIELD_VALIDATORS = {
  name: (value) => {
    const v = value.trim();
    if (!v) return 'Le nom est requis';
    if (v.length < CONFIG.nameMinLength) {
      return `Le nom doit contenir au moins ${CONFIG.nameMinLength} caractères`;
    }
    return null;
  },
  email: (value) => {
    const v = value.trim();
    if (!v) return "L'email est requis";
    if (!EMAIL_REGEX.test(v)) return 'Format email invalide';
    return null;
  },
  subject: () => null, // champ optionnel
  message: (value) => {
    const v = value.trim();
    if (!v) return 'Le message est requis';
    if (v.length < CONFIG.messageMinLength) {
      return `Le message doit contenir au moins ${CONFIG.messageMinLength} caractères`;
    }
    if (v.length > CONFIG.messageMaxLength) {
      return `Le message ne doit pas dépasser ${CONFIG.messageMaxLength} caractères`;
    }
    return null;
  },
};

function validateForm(data) {
  const errors = {};
  for (const [field, validator] of Object.entries(FIELD_VALIDATORS)) {
    const message = validator(data[field] ?? '');
    if (message) errors[field] = message;
  }
  return errors;
}

const hasErrors = (errors) => Object.keys(errors).length > 0;

/* ─────────────────────────────────────────────────────────────
   Sous-composant : FormField (mémoïsé)
   ───────────────────────────────────────────────────────────── */
const FormField = React.memo(function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  hint,
  maxLength,
  showCount = false,
  ...inputProps
}) {
  const isTextarea = type === 'textarea';
  const Tag = isTextarea ? 'textarea' : 'input';

  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  const nearLimit = showCount && maxLength ? value.length > maxLength * 0.9 : false;

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </label>

      <Tag
        id={name}
        name={name}
        {...(isTextarea ? {} : { type })}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        className={`form-input${error ? ' error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        {...inputProps}
      />

      {hint && !error && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="error-message" role="alert">
          ⚠️ {error}
        </p>
      )}

      {/* Compteur visuel uniquement : `aria-hidden` évite que le lecteur
          d'écran annonce chaque frappe. La limite est déjà portée par
          l'attribut `maxLength` du champ. */}
      {showCount && maxLength != null && (
        <div className={`char-count${nearLimit ? ' warn' : ''}`} aria-hidden="true">
          {value.length}/{maxLength} caractères
        </div>
      )}
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────── */
function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [globalError, setGlobalError] = useState(null);

  const successTimer = useRef(null);
  const abortRef = useRef(null);
  const alertRef = useRef(null);
  const mountedRef = useRef(true);

  // Nettoyage : timers + requête en cours, au démontage
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (successTimer.current) clearTimeout(successTimer.current);
      abortRef.current?.abort();
    };
  }, []);

  // Déplace le focus sur le message de statut (accessibilité)
  useEffect(() => {
    if (status) alertRef.current?.focus();
  }, [status]);

  /* ─── Erreurs dérivées (plus de state `errors` à synchroniser) ─── */
  const fieldErrors = useMemo(() => validateForm(formData), [formData]);

  // On n'affiche une erreur qu'après interaction (blur) ou tentative d'envoi.
  // Les erreurs serveur sont toujours prioritaires.
  const errors = useMemo(() => {
    const visible = {};
    for (const [field, message] of Object.entries(fieldErrors)) {
      if (touched[field] || submitAttempted) visible[field] = message;
    }
    return { ...visible, ...serverErrors };
  }, [fieldErrors, touched, submitAttempted, serverErrors]);

  /* ─── Changement de champ ─── */
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Une saisie invalide l'erreur serveur précédente sur ce champ
    setServerErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  /* ─── Blur ─── */
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  /* ─── Soumission ─── */
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      setSubmitAttempted(true);

      // 🍯 Honeypot rempli → robot détecté, on ignore silencieusement
      if (formData.company.trim() !== '') return;

      const validationErrors = validateForm(formData);
      if (hasErrors(validationErrors)) {
        setStatus(null);
        setGlobalError(null);
        // Focus sur le premier champ invalide
        document.getElementById(Object.keys(validationErrors)[0])?.focus();
        return;
      }

      setIsSubmitting(true);
      setStatus(null);
      setGlobalError(null);
      setServerErrors({});

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let timedOut = false;
      const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CONFIG.requestTimeout);

      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);

          // Erreurs de validation renvoyées par l'API (ex. 422)
          if (payload?.errors && typeof payload.errors === 'object') {
            if (mountedRef.current) setServerErrors(payload.errors);
            return; // les messages s'affichent sous les champs concernés
          }

          throw new Error(payload?.message || `Erreur ${response.status} : ${response.statusText}`);
        }

        if (!mountedRef.current) return;

        setStatus('success');
        setFormData(INITIAL_FORM);
        setTouched({});
        setSubmitAttempted(false);
        setServerErrors({});

        if (successTimer.current) clearTimeout(successTimer.current);
        successTimer.current = setTimeout(() => {
          if (mountedRef.current) setStatus(null);
        }, CONFIG.successDuration);
      } catch (err) {
        if (!mountedRef.current) return;
        // Requête annulée par le démontage : rien à signaler
        if (err.name === 'AbortError' && !timedOut) return;

        console.error("Erreur d'envoi :", err);
        setStatus('error');
        setGlobalError(
          timedOut
            ? 'Le serveur met trop de temps à répondre. Merci de réessayer.'
            : 'Une erreur est survenue. Veuillez réessayer.'
        );
      } finally {
        clearTimeout(timeoutId);
        if (mountedRef.current) setIsSubmitting(false);
      }
    },
    [formData, isSubmitting]
  );

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>📱 Me Contacter</h1>
        <p className="subtitle">
          Une question, un projet ? N'hésitez pas à m'écrire, je vous répondrai dans les plus brefs
          délais.
        </p>
      </header>

      <div className="contact-grid">
        {/* ─── Colonne infos ─── */}
        <aside className="contact-sidebar">
          <section className="info-card">
            <h3>📬 Informations</h3>
            <ul className="info-list">
              {CONTACT_INFOS.map(({ icon, label, value, href }) => (
                <li key={label} className="info-item">
                  <span className="info-icon" aria-hidden="true">{icon}</span>
                  <div>
                    <div className="info-label">{label}</div>
                    {href ? (
                      <a href={href} className="info-value link">{value}</a>
                    ) : (
                      <div className="info-value">{value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="info-card">
            <h3>🌐 Réseaux sociaux</h3>
            <div className="socials">
              {SOCIALS.map(({ name, icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label={`Profil ${name}`}
                >
                  <span aria-hidden="true">{icon}</span> {name}
                </a>
              ))}
            </div>
          </section>

          <section className="info-card availability">
            <span className="status-dot" aria-hidden="true" />
            <span>Disponible pour de nouveaux projets</span>
          </section>
        </aside>

        {/* ─── Colonne formulaire ─── */}
        <main className="form-card">
          <h3>✉️ Envoyez-moi un message</h3>

          {status === 'success' && (
            <div
              ref={alertRef}
              tabIndex={-1}
              className="alert success"
              role="status"
              aria-live="polite"
            >
              ✅ Message envoyé avec succès ! Je vous répondrai rapidement.
            </div>
          )}

          {status === 'error' && globalError && (
            <div ref={alertRef} tabIndex={-1} className="alert error" role="alert">
              ❌ {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            {/* 🍯 Pot de miel : caché sans dépendre du CSS externe */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              <label htmlFor="company">Société</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <FormField
              label="Nom complet"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
              placeholder="Jean Dupont"
              autoComplete="name"
              maxLength={80}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              placeholder="jean@exemple.com"
              autoComplete="email"
              maxLength={120}
              inputMode="email"
            />

            <FormField
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subject}
              placeholder="De quoi souhaitez-vous parler ?"
              maxLength={CONFIG.subjectMaxLength}
            />

            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              required
              rows={5}
              placeholder="Écrivez votre message ici..."
              maxLength={CONFIG.messageMaxLength}
              showCount
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Envoi en cours...
                </>
              ) : (
                <>📤 Envoyer le message</>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Contact;