// src/components/ProjectCard.jsx
import React from 'react';

function ProjectCard({ title, description, image, technologies, link }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    }}
    >
      {image && (
        <div style={{
          height: '200px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem'
        }}>
          🖼️
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>{description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {technologies && technologies.map((tech, index) => (
            <span key={index} style={{
              backgroundColor: '#e0e0e0',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: '#333'
            }}>
              {tech}
            </span>
          ))}
        </div>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: '#1a1a2e',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderBottom: '2px solid #f1c40f'
          }}>
            Voir le projet →
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;