// src/components/Hero.jsx
import React from 'react';

function Hero() {
  return (
    <>
      <style>{`
        .hero-container {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
          color: #ffffff;
          border-radius: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .hero-glow {
          position: absolute;
          width: 18rem;
          height: 18rem;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-glow-left {
          top: -6rem;
          left: -6rem;
          background: rgba(234, 179, 8, 0.08);
        }

        .hero-glow-right {
          bottom: -6rem;
          right: -6rem;
          background: rgba(217, 119, 6, 0.08);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: #d1d5db;
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
          color: #111827;
          padding: 0.85rem 2rem;
          text-decoration: none;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1.05rem;
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.25);
          transition: all 0.3s ease;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.4);
        }

        .hero-btn-secondary {
          background: rgba(31, 41, 55, 0.8);
          color: #ffffff;
          border: 1px solid #374151;
          padding: 0.85rem 2rem;
          text-decoration: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          background: rgba(55, 65, 81, 0.9);
          border-color: #4b5563;
          transform: translateY(-2px);
        }
      `}</style>

      <section className="hero-container">
        <div className="hero-glow hero-glow-left"></div>
        <div className="hero-glow hero-glow-right"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Développeur Web
          </h1>
          
          <p className="hero-subtitle">
            Passionné par la création d'applications web modernes, performantes et centrées sur l'expérience utilisateur.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="hero-btn-primary">
              Voir mes projets
            </a>

            <a href="#contact" className="hero-btn-secondary">
              Me contacter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;