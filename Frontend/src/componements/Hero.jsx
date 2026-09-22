// src/components/Hero.jsx
import React, { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// CSS injecté (scopé avec le préfixe hero-)
// ─────────────────────────────────────────────────────────────
const styles = `
  /* ---------- Conteneur principal ---------- */
  .hero-container {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 6rem 2rem 5rem;
    background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
    color: #ffffff;
    border-radius: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
                0 10px 10px -5px rgba(0, 0, 0, 0.2);
    font-family: system-ui, -apple-system, sans-serif;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ---------- Grille de fond subtile ---------- */
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(250, 204, 21, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(250, 204, 21, 0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    pointer-events: none;
    z-index: 1;
  }

  /* ---------- Halos lumineux ---------- */
  .hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 1;
    animation: hero-pulse 6s ease-in-out infinite;
  }

  .hero-glow-left {
    width: 20rem;
    height: 20rem;
    top: -8rem;
    left: -8rem;
    background: rgba(234, 179, 8, 0.15);
  }

  .hero-glow-right {
    width: 22rem;
    height: 22rem;
    bottom: -8rem;
    right: -8rem;
    background: rgba(217, 119, 6, 0.12);
    animation-delay: 3s;
  }

  @keyframes hero-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }

  /* ---------- Badge de disponibilité ---------- */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(250, 204, 21, 0.08);
    border: 1px solid rgba(250, 204, 21, 0.25);
    color: #facc15;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    animation: hero-fade-up 0.6s ease both;
  }

  .hero-badge-dot {
    width: 8px;
    height: 8px;
    background-color: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    animation: hero-pulse-dot 2s ease-in-out infinite;
  }

  @keyframes hero-pulse-dot {
    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }

  /* ---------- Contenu ---------- */
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    animation: hero-fade-up 0.8s ease both;
  }

  @keyframes hero-fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ---------- Titre ---------- */
  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hero-fade-up 0.8s ease 0.1s both;
  }

  .hero-title-line {
    display: block;
  }

  .hero-title-highlight {
    position: relative;
    display: inline-block;
  }

  .hero-title-highlight::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.1em;
    height: 0.15em;
    background: linear-gradient(90deg, rgba(250, 204, 21, 0.4), rgba(245, 158, 11, 0.1));
    z-index: -1;
    border-radius: 2px;
  }

  /* ---------- Sous-titre ---------- */
  .hero-subtitle {
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    color: #d1d5db;
    max-width: 620px;
    margin: 0 auto 2.5rem auto;
    line-height: 1.7;
    animation: hero-fade-up 0.8s ease 0.2s both;
  }

  /* ---------- Boutons ---------- */
  .hero-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    animation: hero-fade-up 0.8s ease 0.3s both;
  }

  .hero-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    text-decoration: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1.05rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease,
                background-color 0.3s ease, border-color 0.3s ease;
    cursor: pointer;
    border: 1px solid transparent;
    font-family: inherit;
  }

  .hero-btn:focus-visible {
    outline: 2px solid #facc15;
    outline-offset: 3px;
  }

  .hero-btn-primary {
    background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
    color: #111827;
    box-shadow: 0 4px 15px rgba(250, 204, 21, 0.25);
  }

  .hero-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(250, 204, 21, 0.45);
  }

  .hero-btn-secondary {
    background: rgba(31, 41, 55, 0.8);
    color: #ffffff;
    border: 1px solid #374151;
  }

  .hero-btn-secondary:hover {
    background: rgba(55, 65, 81, 0.9);
    border-color: #4b5563;
    transform: translateY(-3px);
  }

  .hero-btn-icon {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .hero-btn:hover .hero-btn-icon {
    transform: translateX(4px);
  }

  /* ---------- Statistiques ---------- */
  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 3.5rem;
    flex-wrap: wrap;
    animation: hero-fade-up 0.8s ease 0.4s both;
  }

  .hero-stat {
    text-align: center;
  }

  .hero-stat-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #facc15;
    line-height: 1;
  }

  .hero-stat-label {
    font-size: 0.85rem;
    color: #9ca3af;
    margin-top: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ---------- Indicateur de scroll ---------- */
  .hero-scroll {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #9ca3af;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 2;
    animation: hero-fade-up 1s ease 0.8s both;
  }

  .hero-scroll-mouse {
    width: 22px;
    height: 36px;
    border: 2px solid #4b5563;
    border-radius: 12px;
    position: relative;
  }

  .hero-scroll-mouse::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 6px;
    background-color: #facc15;
    border-radius: 2px;
    animation: hero-scroll-anim 1.8s ease-in-out infinite;
  }

  @keyframes hero-scroll-anim {
    0% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 12px); }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 640px) {
    .hero-container {
      padding: 4rem 1.25rem 3rem;
      min-height: 70vh;
      border-radius: 0.75rem;
    }

    .hero-stats {
      gap: 2rem;
      margin-top: 2.5rem;
    }

    .hero-stat-value {
      font-size: 1.5rem;
    }

    .hero-scroll {
      display: none;
    }
  }

  /* ---------- Réduction des animations ---------- */
  @media (prefers-reduced-motion: reduce) {
    .hero-container *,
    .hero-container *::before,
    .hero-container *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────
// Composant Hero
// ─────────────────────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Petit délai pour déclencher les animations après le montage
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <section
        className="hero-container"
        aria-labelledby="hero-title"
        data-mounted={mounted}
      >
        {/* Décor */}
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />

        <div className="hero-content">
          {/* Badge de disponibilité */}
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Disponible pour de nouveaux projets
          </div>

          {/* Titre */}
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line">Développeur</span>
            <span className="hero-title-line">
              <span className="hero-title-highlight">Web</span>
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="hero-subtitle">
            Passionné par la création d'applications web modernes,
            performantes et centrées sur l'expérience utilisateur.
          </p>

          {/* Boutons */}
          <div className="hero-buttons">
            <a href="#projets" className="hero-btn hero-btn-primary">
              Voir mes projets
              <span className="hero-btn-icon" aria-hidden="true">→</span>
            </a>

            <a href="#contact" className="hero-btn hero-btn-secondary">
              Me contacter
            </a>
          </div>

          {/* Statistiques */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">3+</div>
              <div className="hero-stat-label">Années d'expérience</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">20+</div>
              <div className="hero-stat-label">Projets réalisés</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">Clients satisfaits</div>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <div className="hero-scroll-mouse" />
        </div>
      </section>
    </>
  );
}

export default Hero;