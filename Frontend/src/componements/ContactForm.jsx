// src/componements/ContactForm.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';

/* ─────────────────────────────────────────────────────────────
   1. Schéma de validation
   ───────────────────────────────────────────────────────────── */
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(80, 'Le nom est trop long'),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  subject: z.string().max(120, 'Le sujet est trop long').optional(),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message est trop long'),
  // 🍯 Honeypot : DOIT figurer dans le schéma, sinon zod le supprime
  // du résultat validé et la détection anti-spam ne fonctionne plus.
  honeypot: z.string().optional(),
});

/* ─────────────────────────────────────────────────────────────
   2. Configuration EmailJS + garde-fou
   ───────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

const EMAILJS_READY = Object.values(EMAILJS_CONFIG).every(Boolean);

if (!EMAILJS_READY && import.meta.env.DEV) {
  console.warn(
    '[ContactForm] Variables EmailJS manquantes. ' +
      'Vérifiez VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID et VITE_EMAILJS_PUBLIC_KEY.'
  );
}

const SUCCESS_RESET_DELAY = 4000;

/* ─────────────────────────────────────────────────────────────
   3. Styles (inchangés, extraits dans une constante)
   ───────────────────────────────────────────────────────────── */
const styles = `
  .cf-container { max-width: 600px; margin: 0 auto; padding: 2rem; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: inherit; }
  .cf-title { text-align: center; margin-bottom: 2rem; }
  .cf-field { margin-bottom: 1.5rem; }
  .cf-label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
  .cf-input { width: 100%; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 5px; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color .3s, box-shadow .3s; }
  .cf-input:focus { outline: none; border-color: #f1c40f; box-shadow: 0 0 0 3px rgba(241,196,15,.2); }
  .cf-input[aria-invalid='true'] { border-color: #e74c3c; }
  .cf-input[aria-invalid='true']:focus { box-shadow: 0 0 0 3px rgba(231,76,60,.2); }
  textarea.cf-input { resize: vertical; min-height: 100px; }
  .cf-error { color: #e74c3c; font-size: .875rem; margin: .4rem 0 0; }
  .cf-submit { width: 100%; background-color: #f1c40f; color: #1a1a2e; padding: 1rem; border: none; border-radius: 5px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: transform .3s, background-color .3s; }
  .cf-submit:hover:not(:disabled) { transform: scale(1.02); background-color: #f39c12; }
  .cf-submit:disabled { opacity: .6; cursor: not-allowed; }
  .cf-alert { padding: 1rem; border-radius: 5px; margin-bottom: 1rem; text-align: center; }
  .cf-alert-success { background-color: #d4edda; color: #155724; }
  .cf-alert-error { background-color: #f8d7da; color: #721c24; }
  .cf-honeypot { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
`;

/* ─────────────────────────────────────────────────────────────
   4. Sous-composant champ (mutualise label + input + erreur)
   ───────────────────────────────────────────────────────────── */
const Field = React.memo(function Field({
  id,
  label,
  required = false,
  error,
  register,
  as: Tag = 'input',
  ...rest
}) {
  const errorId = `${id}-error`;

  return (
    <div className="cf-field">
      <label htmlFor={id} className="cf-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <Tag
        id={id}
        className="cf-input"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-required={required || undefined}
        {...register}
        {...rest}
      />
      {error && (
        <p id={errorId} className="cf-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   5. Composant principal
   ───────────────────────────────────────────────────────────── */
function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | success | error
  const successTimerRef = useRef(null);
  const mountedRef = useRef(true);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting, touchedFields, submitCount },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: '',
    },
  });

  /* ─── Nettoyage du timer au démontage ─── */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  /* ─── Programmation du retour à l'état neutre ─── */
  const scheduleReset = useCallback(() => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setStatus('idle');
    }, SUCCESS_RESET_DELAY);
  }, []);

  /* ─── Soumission ─── */
  const onSubmit = useCallback(
    async (data) => {
      // 🍯 Honeypot rempli → robot. On simule un succès, sans rien envoyer.
      if (data.honeypot) {
        if (import.meta.env.DEV) console.warn('[ContactForm] Bot détecté, envoi ignoré.');
        setStatus('success');
        reset();
        scheduleReset();
        return;
      }

      if (!EMAILJS_READY) {
        setStatus('error');
        return;
      }

      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject?.trim() || '(sans sujet)',
            message: data.message,
          },
          { publicKey: EMAILJS_CONFIG.publicKey }
        );

        if (!mountedRef.current) return;
        setStatus('success');
        reset();
        scheduleReset();
      } catch (error) {
        if (!mountedRef.current) return;
        console.error('Erreur EmailJS:', error);
        setStatus('error');
      }
    },
    [reset, scheduleReset]
  );

  /* ─── Focus sur le premier champ en erreur après un échec de soumission ─── */
  const onInvalid = useCallback(
    (formErrors) => {
      const firstField = Object.keys(formErrors)[0];
      if (firstField) setFocus(firstField);
    },
    [setFocus]
  );

  /* ─── Affiche une erreur si le champ a été touché OU après une soumission ─── */
  const showError = (field) =>
    errors[field] && (touchedFields[field] || submitCount > 0)
      ? errors[field]
      : null;

  const isSending = isSubmitting || status === 'idle' === false && status === 'loading';

  return (
    <>
      <style>{styles}</style>

      <div className="cf-container">
        <h2 className="cf-title">📩 Envoyez-moi un message</h2>

        {status === 'success' && (
          <div className="cf-alert cf-alert-success" role="status" aria-live="polite">
            ✅ Message envoyé avec succès !
          </div>
        )}

        {status === 'error' && (
          <div className="cf-alert cf-alert-error" role="alert" aria-live="assertive">
            ❌ Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          aria-busy={isSubmitting || undefined}
        >
          {/* 🍯 Honeypot (invisible pour l'humain) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="cf-honeypot"
            aria-hidden="true"
            {...register('honeypot')}
          />

          <Field
            id="name"
            label="Nom complet"
            required
            autoComplete="name"
            error={showError('name')}
            register={register('name')}
          />

          <Field
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            error={showError('email')}
            register={register('email')}
          />

          <Field
            id="subject"
            label="Sujet"
            autoComplete="off"
            error={showError('subject')}
            register={register('subject')}
          />

          <Field
            id="message"
            label="Message"
            required
            as="textarea"
            rows={5}
            error={showError('message')}
            register={register('message')}
          />

          <button
            type="submit"
            className="cf-submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
          >
            {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ContactForm;