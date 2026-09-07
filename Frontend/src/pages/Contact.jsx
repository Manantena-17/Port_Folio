// src/pages/Contact.jsx
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Efface l'erreur pour ce champ
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ici vous pouvez ajouter la logique d'envoi vers un backend
    console.log('Données du formulaire:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1.5rem',
        color: '#1a1a2e'
      }}>
        📱 Me Contacter
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '3rem',
        marginTop: '2rem'
      }}>
        {/* Informations de contact */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginTop: 0 }}>📬 Informations</h3>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Email</div>
                  <div style={{ color: '#666' }}>email@example.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Localisation</div>
                  <div style={{ color: '#666' }}>Fianarantsoa, Madagascar</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Téléphone</div>
                  <div style={{ color: '#666' }}>+261 34 00 000 00</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0 }}>🌐 Réseaux sociaux</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                textDecoration: 'none',
                color: '#333'
              }}>
                GitHub
              </a>
              <a href="#" style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                textDecoration: 'none',
                color: '#333'
              }}>
                LinkedIn
              </a>
              <a href="#" style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                textDecoration: 'none',
                color: '#333'
              }}>
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>✉️ Envoyez-moi un message</h3>
          
          {isSubmitted && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '1rem',
              borderRadius: '5px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              animation: 'fadeIn 0.5s'
            }}>
              ✅ Message envoyé avec succès ! Je vous répondrai rapidement.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: `2px solid ${errors.name ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f1c40f'}
                onBlur={(e) => {
                  if (!errors.name) {
                    e.target.style.borderColor = '#e0e0e0';
                  }
                }}
              />
              {errors.name && (
                <div style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  {errors.name}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: `2px solid ${errors.email ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f1c40f'}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#e0e0e0';
                  }
                }}
              />
              {errors.email && (
                <div style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Sujet
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f1c40f'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: `2px solid ${errors.message ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '5px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f1c40f'}
                onBlur={(e) => {
                  if (!errors.message) {
                    e.target.style.borderColor = '#e0e0e0';
                  }
                }}
              />
              {errors.message && (
                <div style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  {errors.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#f1c40f',
                color: '#1a1a2e',
                padding: '1rem',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.backgroundColor = '#f39c12';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#f1c40f';
              }}
            >
              📤 Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;