// src/pages/About.jsx
import React from 'react';

function About() {
  return (
    <div>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1.5rem',
        color: '#1a1a2e'
      }}>
        👤 À propos de moi
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        marginTop: '2rem'
      }}>
        {/* Colonne gauche */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#1a1a2e' }}>Qui suis-je ?</h2>
            <p style={{ lineHeight: '1.8', color: '#555' }}>
              Je suis un développeur web passionné par la création d'applications 
              modernes, responsives et performantes. Avec 2 ans d'expérience dans 
              le développement web, j'ai eu l'opportunité de travailler sur divers 
              projets allant des sites vitrines aux applications complexes.
            </p>
            <p style={{ lineHeight: '1.8', color: '#555', marginTop: '1rem' }}>
              Ma passion pour le développement web m'a conduit à maîtriser les 
              technologies les plus récentes et à toujours chercher à m'améliorer 
              et à apprendre de nouvelles choses.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1a1a2e' }}>🎯 Objectifs</h2>
            <ul style={{ lineHeight: '2', color: '#555' }}>
              <li>Créer des applications innovantes</li>
              <li>Apprendre continuellement de nouvelles technologies</li>
              <li>Contribuer à des projets open-source</li>
              <li>Partager mes connaissances avec la communauté</li>
            </ul>
          </div>
        </div>

        {/* Colonne droite */}
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#1a1a2e' }}>💼 Expérience</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Développeur Web Junior
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                <strong>2024 - Présent</strong>
              </p>
              <ul style={{ lineHeight: '1.8', color: '#555' }}>
                <li>Développement d'applications React</li>
                <li>Création d'APIs avec Node.js</li>
                <li>Optimisation des performances</li>
                <li>Collaboration en équipe agile</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Freelance
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                <strong>2023 - 2024</strong>
              </p>
              <ul style={{ lineHeight: '1.8', color: '#555' }}>
                <li>Création de sites vitrines</li>
                <li>Développement d'applications web</li>
                <li>Maintenance et mise à jour</li>
              </ul>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1a1a2e' }}>🎓 Formation</h2>
            <div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Licence en Informatique
              </h3>
              <p style={{ color: '#666' }}>Université de Fianarantsoa - 2022-2025</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Certifications
              </h3>
              <ul style={{ lineHeight: '1.8', color: '#555' }}>
                <li>React - Développement d'applications</li>
                <li>JavaScript Moderne</li>
                <li>Node.js et Express</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;