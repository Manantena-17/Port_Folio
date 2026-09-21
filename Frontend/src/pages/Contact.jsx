
import React, { useState, useCallback, useMemo } from 'react';

const FormField = ({ label, name, type = 'text', value, onChange, error, required, ...props }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="required">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
    )}
    {error && (
      <p id={`${name}-error`} className="error-message" role="alert">
        ⚠️ {error}
      </p>
    )}
  </div>
);

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // 🔹 Validation
  const validate = useCallback((data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Le nom est requis';
    else if (data.name.trim().length < 2) newErrors.name = 'Le nom doit contenir au moins 2 caractères';

    if (!data.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Format email invalide';
    }

    if (!data.message.trim()) newErrors.message = 'Le message est requis';
    else if (data.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    return newErrors;
  }, []);

  // 🔹 Changement de champ + validation en direct si déjà touché
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Validation en temps réel si le champ a déjà été touché
    if (touched[name]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  }, [formData, touched, validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
  }, [formData, validate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Marquer tous les champs comme touchés
      setTouched({ name: true, email: true, subject: true, message: true });
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔹 Simulation d'envoi (remplacer par un vrai appel API)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });

      console.log('Données envoyées:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});

      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      setErrors({ global: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(
    () => Object.keys(validate(formData)).length === 0,
    [formData, validate]
  );

  const contactInfos = [
    { icon: '📧', label: 'Email', value: 'email@example.com', href: 'mailto:email@example.com' },
    { icon: '📍', label: 'Localisation', value: 'Fianarantsoa, Madagascar' },
    { icon: '📱', label: 'Téléphone', value: '+261 34 00 000 00', href: 'tel:+261340000000' },
  ];

  const socials = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  ];

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
                  <span className="info-icon">{icon}</span>
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
                  aria-label={name}
                >
                  <span>{icon}</span> {name}
                </a>
              ))}
            </div>
          </section>

          {/* Bonus : carte de disponibilité */}
          <section className="info-card availability">
            <span className="status-dot" />
            <span>Disponible pour de nouveaux projets</span>
          </section>
        </aside>

        {/* ─── Colonne formulaire ─── */}
        <main className="form-card">
          <h3>✉️ Envoyez-moi un message</h3>

          {isSubmitted && (
            <div className="alert success" role="status">
              ✅ Message envoyé avec succès ! Je vous répondrai rapidement.
            </div>
          )}

          {errors.global && (
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
            />

            <FormField
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="De quoi souhaitez-vous parler ?"
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
              rows="5"
              placeholder="Écrivez votre message ici..."
              maxLength={1000}
            />
            <div className="char-count">
              {formData.message.length}/1000 caractères
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" /> Envoi en cours...
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