
import React, { useEffect, useState, useCallback } from 'react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

function About() {
  // 🔹 États : données, chargement, erreur
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fonction de chargement (réutilisable pour le bouton "Réessayer")
  const loadData = useCallback((signal) => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/about`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name === 'AbortError') return; // requête annulée → on ignore
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Chargement initial + annulation si démontage
  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  // 🔹 Bouton "Réessayer"
  const handleRetry = () => loadData();

  // ─── État : chargement ───
  if (loading) {
    return (
      <div className="about-page about-state" aria-busy="true">
        <div className="spinner" aria-hidden="true" />
        <p>Chargement des informations…</p>
      </div>
    );
  }

  // ─── État : erreur ───
  if (error) {
    return (
      <div className="about-page about-state">
        <p role="alert" className="error-msg">
          ❌ Impossible de charger les données : {error.message}
        </p>
        <button type="button" onClick={handleRetry} className="cta-btn">
          🔄 Réessayer
        </button>
      </div>
    );
  }

  // ─── État : pas de données ───
  if (!data) return null;

  // 🔹 Valeurs par défaut pour éviter les erreurs si un champ manque
  const {
    skills = [],
    experiences = [],
    formations = [],
    objectives = [],
    bio = {},
  } = data;

  return (
    <div className="about-page">
      {/* ─── En-tête ─── */}
      <header className="about-header">
        <div className="about-avatar" aria-hidden="true">👨‍💻</div>
        <h1>À propos de moi</h1>
        <p className="subtitle">
          {bio.subtitle ||
            'Développeur web passionné, je transforme des idées en applications modernes, responsives et performantes.'}
        </p>
      </header>

      {/* ─── Grille principale ─── */}
      <div className="about-grid">
        {/* ═══ Colonne gauche ═══ */}
        <div className="about-column">
          {/* Qui suis-je */}
          {(bio.intro || bio.detail) && (
            <section className="about-card">
              <h2>👋 Qui suis-je ?</h2>
              {bio.intro && <p>{bio.intro}</p>}
              {bio.detail && <p>{bio.detail}</p>}
            </section>
          )}

          {/* Objectifs */}
          {objectives.length > 0 && (
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
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <section className="about-card">
              <h2>🛠️ Compétences</h2>
              <div className="skills-list">
                {skills.map(({ name, level, color }) => (
                  <div key={name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{name}</span>
                      <span className="skill-level">{level}%</span>
                    </div>
                    <div
                      className="skill-bar"
                      role="progressbar"
                      aria-valuenow={level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Niveau en ${name} : ${level}%`}
                    >
                      <div
                        className="skill-progress"
                        style={{ width: `${level}%`, background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ═══ Colonne droite ═══ */}
        <div className="about-column">
          {/* Expérience */}
          {experiences.length > 0 && (
            <section className="about-card">
              <h2>💼 Expérience</h2>
              <div className="timeline">
                {experiences.map(({ role, period, company, tasks = [] }, i) => (
                  <article key={i} className="timeline-item">
                    <div className="timeline-marker" aria-hidden="true" />
                    <div className="timeline-content">
                      <h3>{role}</h3>
                      <p className="timeline-meta">
                        <span className="timeline-period">{period}</span>
                        {company && (
                          <span className="timeline-company"> · {company}</span>
                        )}
                      </p>
                      {tasks.length > 0 && (
                        <ul>
                          {tasks.map((task, j) => (
                            <li key={j}>{task}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Formation */}
          {formations.length > 0 && (
            <section className="about-card">
              <h2>🎓 Formation</h2>
              <div className="timeline">
                {formations.map(({ title, school, period, icon, items = [] }, i) => (
                  <article key={i} className="timeline-item">
                    <div className="timeline-marker" aria-hidden="true">
                      {icon}
                    </div>
                    <div className="timeline-content">
                      <h3>{title}</h3>
                      <p className="timeline-meta">
                        <span className="timeline-period">{period}</span>
                        {school && (
                          <span className="timeline-company"> · {school}</span>
                        )}
                      </p>
                      {items.length > 0 && (
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
          )}

          {/* CTA */}
          <section className="about-card cta-card">
            <h2>🤝 Travaillons ensemble</h2>
            <p>Vous avez un projet en tête ? Discutons-en !</p>
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