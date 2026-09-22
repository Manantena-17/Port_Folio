// src/componements/ContactForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────────────────────
// 1. Schéma de validation zod
// ─────────────────────────────────────────────────────────────
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
  subject: z
    .string()
    .max(120, 'Le sujet est trop long')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message est trop long')
});

// ─────────────────────────────────────────────────────────────
// 2. Configuration EmailJS (variables d'environnement)
// ─────────────────────────────────────────────────────────────
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

// ─────────────────────────────────────────────────────────────
// 3. CSS injecté (scopé avec un préfixe cf-)
// ─────────────────────────────────────────────────────────────
const styles = `
  .cf-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: inherit;
  }

  .cf-title {
    text-align: center;
    margin-bottom: 2rem;
  }

  .cf-field {
    margin-bottom: 1.5rem;
  }

  .cf-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .cf-input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .cf-input:focus {
    outline: none;
    border-color: #f1c40f;
    box-shadow: 0 0 0 3px rgba(241, 196, 15, 0.2);
  }

  .cf-input[aria-invalid='true'] {
    border-color: #e74c3c;
  }

  .cf-input[aria-invalid='true']:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }

  textarea.cf-input {
    resize: vertical;
    min-height: 100px;
  }

  .cf-error {
    color: #e74c3c;
    font-size: 0.875rem;
    margin: 0.4rem 0 0;
  }

  .cf-submit {
    width: 100%;
    background-color: #f1c40f;
    color: #1a1a2e;
    padding: 1rem;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;
  }

  .cf-submit:hover:not(:disabled) {
    transform: scale(1.02);
    background-color: #f39c12;
  }

  .cf-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .cf-alert {
    padding: 1rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .cf-alert-success {
    background-color: #d4edda;
    color: #155724;
  }

  .cf-alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }

  .cf-honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`;

// ─────────────────────────────────────────────────────────────
// 4. Composant principal
// ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields }
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur', // validation au blur + revalidation au change
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: ''
    }
  });

  const onSubmit = async (data) => {
    // Anti-spam : si le honeypot est rempli, on ignore silencieusement
    if (data.honeypot) {
      console.warn('Bot détecté, envoi ignoré.');
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject || '(sans sujet)',
          message: data.message
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );

      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      setStatus('error');
    }
  };

  const showError = (field) => touchedFields[field] && errors[field];

  return (
    <>
      {/* Injection du CSS */}
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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Honeypot anti-spam (invisible pour l'utilisateur) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="cf-honeypot"
            aria-hidden="true"
            {...register('honeypot')}
          />

          <div className="cf-field">
            <label htmlFor="name" className="cf-label">
              Nom complet <span aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="cf-input"
              aria-invalid={!!showError('name')}
              aria-describedby={showError('name') ? 'name-error' : undefined}
              {...register('name')}
            />
            {showError('name') && (
              <p id="name-error" className="cf-error" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="cf-field">
            <label htmlFor="email" className="cf-label">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="cf-input"
              aria-invalid={!!showError('email')}
              aria-describedby={showError('email') ? 'email-error' : undefined}
              {...register('email')}
            />
            {showError('email') && (
              <p id="email-error" className="cf-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="cf-field">
            <label htmlFor="subject" className="cf-label">
              Sujet
            </label>
            <input
              id="subject"
              type="text"
              autoComplete="off"
              className="cf-input"
              aria-invalid={!!showError('subject')}
              aria-describedby={showError('subject') ? 'subject-error' : undefined}
              {...register('subject')}
            />
            {showError('subject') && (
              <p id="subject-error" className="cf-error" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="cf-field">
            <label htmlFor="message" className="cf-label">
              Message <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              className="cf-input"
              aria-invalid={!!showError('message')}
              aria-describedby={showError('message') ? 'message-error' : undefined}
              {...register('message')}
            />
            {showError('message') && (
              <p id="message-error" className="cf-error" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="cf-submit"
            disabled={isSubmitting || status === 'loading'}
            aria-busy={isSubmitting || status === 'loading'}
          >
            {isSubmitting || status === 'loading'
              ? 'Envoi en cours…'
              : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ContactForm;