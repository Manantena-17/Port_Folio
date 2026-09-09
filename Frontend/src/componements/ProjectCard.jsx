// src/componements/ProjectCard.jsx
import React, { useState } from 'react';

function ProjectCard({ 
  id, 
  title, 
  description, 
  image, 
  image_url,  // Support du format Sequelize
  technologies, 
  link,
  githubLink,
  github_link,  // Support du format Sequelize
  demoLink,
  demo_link,    // Support du format Sequelize
  category,
  createdAt,
  date,         // Support du format Sequelize
  featured,
  onDelete,
  onEdit
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Normalisation des données (support des deux formats)
  const imageUrl = image || image_url || null;
  const githubUrl = githubLink || github_link || null;
  const demoUrl = demoLink || demo_link || null;
  const projectDate = createdAt || date || null;

  // Gestion des technologies (support JSON string ou tableau)
  let techArray = technologies;
  if (typeof technologies === 'string') {
    try {
      techArray = JSON.parse(technologies);
    } catch {
      techArray = technologies.split(',').map(t => t.trim()).filter(t => t);
    }
  }
  if (!Array.isArray(techArray)) {
    techArray = [];
  }

  // Gestion de l'image (fallback)
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: white;
    `;
    placeholder.textContent = '🖼️';
    parent.appendChild(placeholder);
  };

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: isHovered 
          ? '0 10px 40px rgba(0,0,0,0.15)' 
          : '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge "Mis en avant" */}
      {featured && (
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: '#f1c40f',
          color: '#333',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          ⭐ Mis en avant
        </span>
      )}

      {/* Image */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          onError={handleImageError}
        />
      ) : (
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: 'white'
        }}>
          🚀
        </div>
      )}

      <div style={{ 
        padding: '1.5rem', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Catégorie */}
        {category && (
          <span style={{
            display: 'inline-block',
            padding: '0.2rem 0.8rem',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            alignSelf: 'flex-start',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {category}
          </span>
        )}

        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '0.5rem',
          fontSize: '1.25rem',
          color: '#1a1a2e',
          fontWeight: '700'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: '#666', 
          lineHeight: '1.6',
          flex: 1,
          marginBottom: '1rem',
          fontSize: '0.95rem'
        }}>
          {description}
        </p>

        {/* Technologies */}
        {techArray.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            marginBottom: '1rem' 
          }}>
            {techArray.slice(0, 6).map((tech, index) => (
              <span key={index} style={{
                backgroundColor: '#f0f0f0',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#555',
                fontWeight: '500'
              }}>
                {tech}
              </span>
            ))}
            {techArray.length > 6 && (
              <span style={{
                backgroundColor: '#f0f0f0',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#999'
              }}>
                +{techArray.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Liens */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          marginTop: 'auto',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {demoUrl && (
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#1a1a2e',
                textDecoration: 'none',
                fontWeight: '600',
                borderBottom: '2px solid #f1c40f',
                paddingBottom: '2px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f1c40f'}
              onMouseLeave={(e) => e.target.style.color = '#1a1a2e'}
            >
              🔗 Voir le projet →
            </a>
          )}
          
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#666',
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#333'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
            >
              📂 Code source
            </a>
          )}
        </div>

        {/* Date et actions */}
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '0.75rem'
        }}>
          {projectDate && (
            <span style={{
              fontSize: '0.7rem',
              color: '#999'
            }}>
              📅 {new Date(projectDate).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
          
          {/* Actions (si fournies) */}
          {(onEdit || onDelete) && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Modifier
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Voulez-vous supprimer le projet "${title}" ?`)) {
                      onDelete(id);
                    }
                  }}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#fce4ec',
                    color: '#c62828',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;