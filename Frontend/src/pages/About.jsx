// src/pages/About.jsx
import React from 'react';

function About() {
  // 🔹 Données externalisées pour plus de clarté
  const skills = [
    { name: 'React', level: 85, color: '#61dafb' },
    { name: 'JavaScript', level: 90, color: '#f7df1e' },
    { name: 'Node.js', level: 75, color: '#68a063' },
    { name: 'HTML / CSS', level: 95, color: '#e34c26' },
    { name: 'Git & GitHub', level: 80, color: '#f05032' },
    { name: 'TypeScript', level: 70, color: '#3178c6' },
  ];

  const experiences = [
    {
      role: 'Développeur Web Junior',
      period: '2024 - Présent',
      company: 'Entreprise XYZ',
      tasks: [
        "Développement d'applications React",
        "Création d'APIs avec Node.js",
        'Optimisation des performances',
        'Collaboration en équipe agile',
      ],
    },
    {
      role: 'Freelance',
      period: '2023 - 2024',
      company: 'Indépendant',
      tasks: [
        'Création de sites vitrines',
        "Développement d'applications web",
        'Maintenance et mise à jour',
      ],
    },
  ];

  const formations = [
    {
      title: 'Licence en Informatique',
      school: 'Université de Fianarantsoa',
      period: '2022 - 2025',
      icon: '🎓',
    },
    {
      title: 'Certifications',
      school: 'En ligne',
      period: '2023 - 2024',
      icon: '📜',
      items: [
        "React - Développement d'applications",
        'JavaScript Moderne',
        'Node.js et Express',
      ],
    },
  ];

  const objectives = [
    'Créer des applications innovantes',
    'Apprendre continuellement de nouvelles technologies',
    'Contribuer à des projets open-source',
    'Partager mes connaissances avec la communauté',
  ];

  return (
    <div className="about-page">
      {/* ─── En-tête ─── */}
      <header className="about-header">
        <div className="about-avatar" aria-hidden="true">👨‍💻</div>
        <h1>À propos de moi</h1>
        <p className="subtitle">
          Développeur web passionné, je transforme des idées en applications modernes,
          responsives et performantes.
        </p>
      </header>

      {/* ─── Grille principale ─── */}
      <div className="about-grid">
        {/* ═══ Colonne gauche ═══ */}
        <div className="about-column">
          {/* Qui suis-je */}
          <section className="about-card">
            <h2>👋 Qui suis-je ?</h2>
            <p>
              Je suis un développeur web passionné par la création d'applications
              modernes, responsives et performantes. Avec <strong>2 ans d'expérience</strong>
              {' '}dans le développement web, j'ai eu l'opportunité de travailler sur
              divers projets allant des sites vitrines aux applications complexes.
            </p>
            <p>
              Ma passion pour le développement web m'a conduit à maîtriser les
              technologies les plus récentes et à toujours chercher à m'améliorer
              et à apprendre de nouvelles choses.
            </p>
          </section>

          {/* Objectifs */}
          <section className="about-card">
            <h2>🎯 Objectifs</h2>
            <ul className="objectives-list">
              {objectives.map((obj, i) => (
                <li key={i}>
                  <span className="check-icon" aria-hidden="true">✓</span>
                  {obj}
                </li>
              ))}
            </ul>
          </section>

          {/* Compétences */}
          <section className="about-card">
            <h2>🛠️ Compétences</h2>
            <div className="skills-list">
              {skills.map(({ name, level, color }) => (
                <div key={name} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{name}</span>
                    <span className="skill-level">{level}%</span>
                  </div>
                  <div className="skill-bar" role="progressbar" aria-valuenow={level} aria-valuemin="0" aria-valuemax="100" aria-label={`Niveau en ${name}`}>
                    <div
                      className="skill-progress"
                      style={{ width: `${level}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ Colonne droite ═══ */}
        <div className="about-column">
          {/* Expérience */}
          <section className="about-card">
            <h2>💼 Expérience</h2>
            <div className="timeline">
              {experiences.map(({ role, period, company, tasks }, i) => (
                <article key={i} className="timeline-item">
                  <div className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-content">
                    <h3>{role}</h3>
                    <p className="timeline-meta">
                      <span className="timeline-period">{period}</span>
                      {company && <span className="timeline-company"> · {company}</span>}
                    </p>
                    <ul>
                      {tasks.map((task, j) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Formation */}
          <section className="about-card">
            <h2>🎓 Formation</h2>
            <div className="timeline">
              {formations.map(({ title, school, period, icon, items }, i) => (
                <article key={i} className="timeline-item">
                  <div className="timeline-marker" aria-hidden="true">{icon}</div>
                  <div className="timeline-content">
                    <h3>{title}</h3>
                    <p className="timeline-meta">
                      <span className="timeline-period">{period}</span>
                      {school && <span className="timeline-company"> · {school}</span>}
                    </p>
                    {items && (
                      <ul>
                        {items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="about-card cta-card">
            <h2>🤝 Travaillons ensemble</h2>
            <p>
              Vous avez un projet en tête ? Discutons-en !
            </p>
            <a href="/contact" className="cta-btn">
              📩 Me contacter
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;