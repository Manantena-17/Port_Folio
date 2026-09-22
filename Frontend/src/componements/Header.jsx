// src/componements/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// CSS injecté (scopé avec le préfixe hdr-)
// ─────────────────────────────────────────────────────────────
const styles = `
  /* ---------- Reset / base ---------- */
  .hdr-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(26, 26, 46, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease;
    padding: 0.5rem 0;
  }

  .hdr-header.hdr-scrolled {
    background-color: rgba(26, 26, 46, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    padding: 0.25rem 0;
  }

  /* ---------- Barre de progression ---------- */
  .hdr-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #f1c40f, #f39c12);
    transition: width 0.1s linear;
    width: 0;
  }

  /* ---------- Conteneur ---------- */
  .hdr-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  /* ---------- Logo ---------- */
  .hdr-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  .hdr-logo:hover {
    transform: scale(1.05);
  }

  .hdr-logo-icon {
    font-size: 1.5rem;
    animation: hdr-float 3s ease-in-out infinite;
  }

  @keyframes hdr-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .hdr-logo-text {
    background: linear-gradient(90deg, #fff, #f1c40f);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ---------- Navigation ---------- */
  .hdr-nav {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .hdr-nav a {
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    transition: color 0.3s ease, background-color 0.3s ease;
  }

  .hdr-nav a::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: #f1c40f;
    transition: width 0.3s ease;
  }

  .hdr-nav a:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .hdr-nav a.hdr-active {
    color: #f1c40f;
  }

  .hdr-nav a.hdr-active::after {
    width: 60%;
  }

  /* ---------- Bouton hamburger ---------- */
  .hdr-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    width: 42px;
    height: 42px;
    padding: 0;
    position: relative;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  .hdr-toggle:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .hdr-toggle:focus-visible {
    outline: 2px solid #f1c40f;
    outline-offset: 2px;
  }

  .hdr-toggle span {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 2px;
    background-color: #fff;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease;
  }

  .hdr-toggle span:nth-child(1) { top: 14px; }
  .hdr-toggle span:nth-child(2) { top: 20px; }
  .hdr-toggle span:nth-child(3) { top: 26px; }

  .hdr-toggle.hdr-active span:nth-child(1) {
    top: 20px;
    transform: translateX(-50%) rotate(45deg);
  }

  .hdr-toggle.hdr-active span:nth-child(2) {
    opacity: 0;
  }

  .hdr-toggle.hdr-active span:nth-child(3) {
    top: 20px;
    transform: translateX(-50%) rotate(-45deg);
  }

  /* ---------- Overlay mobile ---------- */
  .hdr-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    animation: hdr-fade-in 0.3s ease forwards;
  }

  @keyframes hdr-fade-in {
    to { opacity: 1; }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 768px) {
    .hdr-toggle {
      display: block;
      z-index: 1001;
    }

    .hdr-nav {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: min(320px, 80vw);
      background-color: #1a1a2e;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      padding: 5rem 1.5rem 2rem;
      gap: 0.5rem;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
      overflow-y: auto;
    }

    .hdr-nav.hdr-open {
      transform: translateX(0);
    }

    .hdr-nav a {
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 10px;
      border-left: 3px solid transparent;
    }

    .hdr-nav a.hdr-active {
      background-color: rgba(241, 196, 15, 0.1);
      border-left-color: #f1c40f;
    }

    .hdr-nav a::after {
      display: none;
    }

    .hdr-overlay {
      display: block;
    }

    .hdr-logo-text {
      font-size: 1rem;
    }
  }

  /* ---------- Réduction des animations ---------- */
  @media (prefers-reduced-motion: reduce) {
    .hdr-header,
    .hdr-nav,
    .hdr-toggle span,
    .hdr-nav a,
    .hdr-logo,
    .hdr-logo-icon {
      transition: none !important;
      animation: none !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────
// Données de navigation (hors composant)
// ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#projets', label: 'Projets' },
  { href: '#competences', label: 'Compétences' },
  { href: '#contact', label: 'Contact' }
];

// ─────────────────────────────────────────────────────────────
// Composant Header
// ─────────────────────────────────────────────────────────────
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // ── Scroll : effet + barre de progression ──
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setIsScrolled(scrollY > 20);

        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        setScrollProgress(progress);

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Détection responsive (évite window.innerWidth dans le rendu) ──
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Section active via IntersectionObserver ──
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.substring(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Fermer le menu au clic extérieur ──
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // ── Fermer le menu avec Escape + navigation clavier ──
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // ── Bloquer le scroll quand le menu mobile est ouvert ──
  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  // ── Scroll fluide vers la section ──
  const handleLinkClick = useCallback((event, href) => {
    event.preventDefault();
    const id = href.substring(1);
    const target = document.getElementById(id);

    if (target) {
      const headerOffset = 80;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Met à jour l'URL sans saut
      window.history.replaceState(null, '', href);
    }

    setIsMenuOpen(false);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <style>{styles}</style>

      <header className={`hdr-header ${isScrolled ? 'hdr-scrolled' : ''}`}>
        <div className="hdr-container">
          <a
            href="#accueil"
            className="hdr-logo"
            onClick={(e) => handleLinkClick(e, '#accueil')}
            aria-label="Retour à l'accueil"
          >
            <span className="hdr-logo-icon" aria-hidden="true">
              🚀
            </span>
            <span className="hdr-logo-text">Mon Portfolio</span>
          </a>

          <button
            ref={toggleRef}
            className={`hdr-toggle ${isMenuOpen ? 'hdr-active' : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="main-nav"
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="main-nav"
            ref={menuRef}
            className={`hdr-nav ${isMenuOpen ? 'hdr-open' : ''}`}
            aria-hidden={!isDesktop && !isMenuOpen}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className={
                  activeSection === href.substring(1) ? 'hdr-active' : ''
                }
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="hdr-progress"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {isMenuOpen && !isDesktop && (
          <div
            className="hdr-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </header>
    </>
  );
};

export default Header;