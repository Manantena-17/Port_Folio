// src/pages/About.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const CONFIG = {
  requestTimeout: 15000,
};

/* ─────────────────────────────────────────────────────────────
   Petits composants de présentation
   ───────────────────────────────────────────────────────────── */

const SkillBar = React.memo(function SkillBar({ name, level = 0, color }) {
  const safeLevel = Math.min(100, Math.max(0, Number(level) || 0));

  return (
    <div className="skill-item">
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{safeLevel}%</span>
      </div>
      <div
        className="skill-bar"
        role="progressbar"
        aria-valuenow={safeLevel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Niveau en ${name} : ${safeLevel}%`}
      >
        <div
          className="skill-progress"
          style={{ width: `${safeLevel}%`, background: color }}
        />
      </div>
    </div>
  );
});

const TimelineItem = React.memo(function TimelineItem({
  title,
  period,
  subtitle,
  items = [],
  icon,
}) {
  return (
    <article className="timeline-item">
      <div className="timeline-marker" aria-hidden="true">
        {icon}
      </div>
      <div className="timeline-content">
        <h3>{title}</h3>
        <p className="timeline-meta">
          {period && <span className="timeline-period">{period}</span>}
          {subtitle && <span className="timeline-company"> · {subtitle}</span>}
        </p>
        {items.length > 0 && (
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
});

const Section = React.memo(function Section({ title, children, className = '' }) {
  if (!children) return null;

  return (
    <section className={`about-card${className ? ` ${className}` : ''}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
});

/* ─────────────────────────────────────────────────────────────
   État de chargement / erreur
   ───────────────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="about-page about-state" aria-busy="true" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Chargement des informations…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="about-page about-state">
      <p role="alert" className="error-msg">
        ❌ Impossible de charger les données : {message}
      </p>
      <button type="button" onClick={onRetry} className="cta-btn">
        🔄 Réessayer
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────── */

function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  const loadData = useCallback(async () => {
    // Annule une éventuelle requête précédente
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CONFIG.requestTimeout);

    try {
      const response = await fetch(`${API_URL}/about`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
      }

      const json = await response.json();
      if (mountedRef.current) setData(json);
    } catch (err) {
      if (!mountedRef.current) return;
      // Annulation volontaire (démontage) → on ignore silencieusement
      if (err.name === 'AbortError' && !timedOut) return;

      setError(
        timedOut
          ? 'Le serveur met trop de temps à répondre.'
          : err.message || 'Erreur inconnue'
      );
    } finally {
      clearTimeout(timeoutId);
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadData();

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [loadData]);

  /* ─── Extraction des données (mémorisée) ─── */
  const { bio, skills, experiences, formations, objectives } = useMemo(() => {
    const d = data || {};
    return {
      bio: d.bio || {},
      skills: d.skills || [],
      experiences: d.experiences || [],
      formations: d.formations || [],
      objectives: d.objectives || [],
    };
  }, [data]);

  const hasBio = Boolean(bio.intro || bio.detail);

  /* ─── Rendu conditionnel des états ─── */
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

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
          <Section title="👋 Qui suis-je ?">
            {hasBio && (
              <>
                {bio.intro && <p>{bio.intro}</p>}
                {bio.detail && <p>{bio.detail}</p>}
              </>
            )}
          </Section>

          <Section title="🎯 Objectifs">
            {objectives.length > 0 && (
              <ul className="objectives-list">
                {objectives.map((obj, index) => (
                  <li key={index}>
                    <span className="check-icon" aria-hidden="true">✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="🛠️ Compétences">
            {skills.length > 0 && (
              <div className="skills-list">
                {skills.map((skill) => (
                  <SkillBar key={skill.name} {...skill} />
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* ═══ Colonne droite ═══ */}
        <div className="about-column">
          <Section title="💼 Expérience">
            {experiences.length > 0 && (
              <div className="timeline">
                {experiences.map((exp, index) => (
                  <TimelineItem
                    key={index}
                    title={exp.role}
                    period={exp.period}
                    subtitle={exp.company}
                    items={exp.tasks || []}
                  />
                ))}
              </div>
            )}
          </Section>

          <Section title="🎓 Formation">
            {formations.length > 0 && (
              <div className="timeline">
                {formations.map((formation, index) => (
                  <TimelineItem
                    key={index}
                    title={formation.title}
                    period={formation.period}
                    subtitle={formation.school}
                    items={formation.items || []}
                    icon={formation.icon}
                  />
                ))}
              </div>
            )}
          </Section>

          {/* CTA */}
          <Section title="🤝 Travaillons ensemble" className="cta-card">
            <p>Vous avez un projet en tête ? Discutons-en !</p>
            <a href="/contact" className="cta-btn">
              📩 Me contacter
            </a>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default About;