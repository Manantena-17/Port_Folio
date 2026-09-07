// src/components/Hero.jsx
import React from 'react';

function Hero() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      borderRadius: '10px',
      marginBottom: '2rem'
    }}>
      <h1 style={{
        fontSize: '3.5rem',
        marginBottom: '1rem',
        background: 'linear-gradient(45deg, #f1c40f, #f39c12)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Développeur Web
      </h1>
      <p style={{
        fontSize: '1.3rem',
        maxWidth: '600px',
        margin: '0 auto',
        opacity: 0.9
      }}>
        Passionné par la création d'applications web modernes et responsives
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/projects" style={{
          backgroundColor: '#f1c40f',
          color: '#1a1a2e',
          padding: '0.8rem 2rem',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          transition: 'transform 0.3s',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Voir mes projets
        </a>
      </div>
    </div>
  );
}

export default Hero;