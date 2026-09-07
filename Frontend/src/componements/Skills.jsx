// src/components/Skills.jsx
import React from 'react';

function Skills() {
  const skills = [
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'JavaScript', level: 85, color: '#f7df1e' },
    { name: 'HTML/CSS', level: 95, color: '#e34f26' },
    { name: 'Node.js', level: 75, color: '#68a063' },
    { name: 'MongoDB', level: 70, color: '#47a248' },
    { name: 'Git', level: 80, color: '#f05033' }
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Mes Compétences</h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {skills.map((skill, index) => (
          <div key={index}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: 'bold' }}>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
              height: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${skill.level}%`,
                height: '100%',
                backgroundColor: skill.color,
                borderRadius: '10px',
                transition: 'width 1.5s ease-in-out'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;