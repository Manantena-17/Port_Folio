// src/pages/Contact.jsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// 🔹 Configuration centralisée (facile à modifier)
const CONFIG = {
  nameMinLength: 2,
  messageMinLength: 10,
  messageMaxLength: 1000,
  successDuration: 6000,
};

// 🔹 Regex email compilée une seule fois
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🔹 Champs du formulaire (évite la duplication)
const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

// ─────────────────────────────────────────────────────────────
// Sous-composant : FormField (mémoïsé)
// ─────────────────────────────────────────────────────────────
const FormField = React.memo(function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required,
  hint,
  ...props
}) {
  const isTextarea = type === 'textarea';
  const Tag = isTextarea ? 'textarea' : 'input';
  const errorId = `${name}-error`;

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required" aria-hidden="true">*</span>}
      </label>

      <Tag
        id={name}
        name={name}
        {...(isTextarea ? {} : { type })}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        {...props}
      />

      {hint && !error && <p className="form-hint">{hint}</p>}

      {error && (
        <p id={errorId} className="error-message" role="alert">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // 🔹 Ref pour le timer de succès (évite les fuites mémoire)
  const successTimer = useRef(null);

  // 🔹 Nettoyage du timer au démontage
  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  // ─── Validation ───
  const validate = useCallback((data) => {
    const errs = {};

    const name = data.name.trim();
    if (!name) errs.name = 'Le nom est requis';
    else if (name.length < CONFIG.nameMinLength) {
      errs.name = `Le nom doit contenir au moins ${CONFIG.nameMinLength} caractères`;
    }

    const email = data.email.trim();
    if (!email) errs.email = "L'email est requis";
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Format email invalide';

    const message = data.message.trim();
    if (!message) errs.message = 'Le message est requis';
    else if (message.length < CONFIG.messageMinLength) {
      errs.message = `Le message doit contenir au moins ${CONFIG.messageMinLength} caractères`;
    }
    else if (message.length > CONFIG.messageMaxLength) {
      errs.message = `Le message ne doit pas dépasser ${CONFIG.messageMaxLength} caractères`;
    }

    return errs;
  }, []);

  // ─── Changement de champ ───
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Validation en direct uniquement si le champ a déjà été touché
      if (touched[name]) {
        const newErrors = validate(updated);
        setErrors((prevErrs) => ({ ...prevErrs, [name]: newErrors[name] || '' }));
      }

      return updated;
    });
  }, [touched, validate]);

  // ─── Blur (validation au premier blur) ───
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    setFormData((current) => {
      const newErrors = validate(current);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
      return current;
    });
  }, [validate]);

  // ─── Soumission ───
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, subject: true, message: true });
      setStatus(null);
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status} : ${res.statusText}`);
      }

      setStatus('success');
      setFormData(INITIAL_FORM);
      setTouched({});
      setErrors({});

      // Auto-dismiss du message de succès
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setStatus(null), CONFIG.successDuration);
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      setStatus('error');
      setErrors((prev) => ({
        ...prev,
        global: "Une erreur est survenue. Veuillez réessayer.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validate]);

  // ─── Formulaire valide (mémoïsé) ───
  const isFormValid = useMemo(
    () => Object.keys(validate(formData)).length === 0,
    [formData, validate]
  );

  // ─── Données statiques (hors composant serait encore mieux) ───
  const contactInfos = useMemo(() => [
    { icon: '📧', label: 'Email', value: 'email@example.com', href: 'mailto:email@example.com' },
    { icon: '📍', label: 'Localisation', value: 'Fianarantsoa, Madagascar' },
    { icon: '📱', label: 'Téléphone', value: '+261 34 00 000 00', href: 'tel:+261340000000' },
  ], []);

  const socials = useMemo(() => [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  ], []);

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>📱 Me Contacter</h1>
        <p className="subtitle">
          Une question, un projet ? N'hésitez pas à m'écrire, je vous répondrai dans les plus brefs délais.
        </p>
      </header>

      <div className="contact-grid">
        {/* ─── Colonne infos ─── */}
        <aside className="contact-sidebar">
          <section className="info-card">
            <h3>📬 Informations</h3>
            <ul className="info-list">
              {contactInfos.map(({ icon, label, value, href }) => (
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
              {socials.map(({ name, icon, url }) => (
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
            <div className="alert success" role="status" aria-live="polite">
              ✅ Message envoyé avec succès ! Je vous répondrai rapidement.
            </div>
          )}

          {status === 'error' && errors.global && (
            <div className="alert error" role="alert">
              ❌ {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
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
            />

            <FormField
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="De quoi souhaitez-vous parler ?"
              maxLength={120}
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
            />
            <div
              className={`char-count ${
                formData.message.length > CONFIG.messageMaxLength * 0.9 ? 'warn' : ''
              }`}
              aria-live="polite"
            >
              {formData.message.length}/{CONFIG.messageMaxLength} caractères
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !isFormValid}
            >
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