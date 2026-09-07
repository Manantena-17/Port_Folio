// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <p style={{ margin: 0 }}>© 2026 Mon Portfolio. Tous droits réservés.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>GitHub</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>LinkedIn</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Twitter</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;