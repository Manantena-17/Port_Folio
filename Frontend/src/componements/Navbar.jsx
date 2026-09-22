// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// Données de navigation (hors composant)
// ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/',         label: 'Accueil',  end: true },
  { to: '/about',    label: 'À propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact',  label: 'Contact' },
];

// ─────────────────────────────────────────────────────────────
// CSS injecté (scopé avec le préfixe nb-)
// ─────────────────────────────────────────────────────────────
const styles = `
  /* ---------- Base ---------- */
  .nb-navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: rgba(26, 26, 46, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, box-shadow 0.3s ease,
                padding 0.3s ease;
  }

  .nb-navbar.nb-scrolled {
    background-color: rgba(26, 26, 46, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  }

  /* ---------- Conteneur interne ---------- */
  .nb-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transition: height 0.3s ease;
  }

  .nb-navbar.nb-scrolled .nb-inner {
    height: 64px;
  }

  /* ---------- Logo ---------- */
  .nb-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #f1c40f;
    font-size: 1.6rem;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .nb-logo span {
    color: #fff;
  }

  .nb-logo:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }

  /* ---------- Liste de liens ---------- */
  .nb-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* ---------- Lien ---------- */
  .nb-link {
    position: relative;
    display: block;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    color: #fff;
    font-size: 1.05rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.25s ease, background-color 0.25s ease;
  }

  .nb-link::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: #f1c40f;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .nb-link:hover {
    color: #f1c40f;
    background-color: rgba(255, 255, 255, 0.07);
  }

  .nb-link.nb-active {
    color: #f1c40f;
    background-color: rgba(241, 196, 15, 0.12);
  }

  .nb-link.nb-active::after {
    width: 40%;
  }

  /* ---------- Focus visible (accessibilité) ---------- */
  .nb-link:focus-visible,
  .nb-logo:focus-visible,
  .nb-burger:focus-visible {
    outline: 2px solid #f1c40f;
    outline-offset: 2px;
  }

  /* ---------- Burger ---------- */
  .nb-burger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 22px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  .nb-burger:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .nb-burger span {
    display: block;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: #fff;
    transition: transform 0.3s ease, opacity 0.3s ease,
                background-color 0.25s ease;
  }

  .nb-burger.nb-open span:nth-child(1) {
    transform: translateY(9.5px) rotate(45deg);
  }

  .nb-burger.nb-open span:nth-child(2) {
    opacity: 0;
  }

  .nb-burger.nb-open span:nth-child(3) {
    transform: translateY(-9.5px) rotate(-45deg);
  }

  /* ---------- Overlay mobile ---------- */
  .nb-overlay {
    display: none;
    position: fixed;
    inset: 72px 0 0 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    animation: nb-fade-in 0.3s ease forwards;
  }

  @keyframes nb-fade-in {
    to { opacity: 1; }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 768px) {
    .nb-inner {
      padding: 0 1.25rem;
    }

    .nb-burger {
      display: flex;
      z-index: 1001;
    }

    .nb-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      gap: 0.25rem;
      background: #1a1a2e;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
      max-height: 0;
      padding: 0 1.25rem;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transition: max-height 0.35s ease, opacity 0.25s ease,
                  padding 0.35s ease, visibility 0.35s;
      z-index: 999;
    }

    .nb-links.nb-open {
      max-height: 70vh;
      padding: 0.75rem 1.25rem 1rem;
      opacity: 1;
      visibility: visible;
    }

    .nb-link {
      padding: 0.9rem 1rem;
      font-size: 1.1rem;
      border-radius: 8px;
      border-left: 3px solid transparent;
    }

    .nb-link.nb-active {
      background-color: rgba(241, 196, 15, 0.1);
      border-left-color: #f1c40f;
    }

    .nb-link::after {
      display: none;
    }

    .nb-overlay {
      display: block;
    }
  }

  /* ---------- Réduction des animations ---------- */
  @media (prefers-reduced-motion: reduce) {
    .nb-navbar,
    .nb-inner,
    .nb-links,
    .nb-link,
    .nb-link::after,
    .nb-burger,
    .nb-burger span,
    .nb-logo {
      transition: none !important;
      animation: none !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────
// Composant Navbar
// ─────────────────────────────────────────────────────────────
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  const navRef = useRef(null);
  const burgerRef = useRef(null);

  // ── Ferme le menu à chaque changement de page ──
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // ── Détecte le scroll pour styliser la navbar ──
  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
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

  // ── Ferme le menu avec la touche Échap ──
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        burgerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // ── Ferme le menu au clic extérieur ──
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // ── Bloque le scroll quand le menu mobile est ouvert ──
  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <style>{styles}</style>

      <nav
        className={`nb-navbar ${isScrolled ? 'nb-scrolled' : ''}`}
        aria-label="Navigation principale"
      >
        <div className="nb-inner">
          {/* Logo */}
          <Link to="/" className="nb-logo" onClick={closeMenu}>
            Mon<span>Portfolio</span>
          </Link>

          {/* Burger (mobile) */}
          <button
            ref={burgerRef}
            type="button"
            className={`nb-burger ${isMenuOpen ? 'nb-open' : ''}`}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Liens */}
          <ul
            id="navbar-menu"
            ref={navRef}
            className={`nb-links ${isMenuOpen ? 'nb-open' : ''}`}
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nb-link ${isActive ? 'nb-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Overlay mobile */}
        {isMenuOpen && (
          <div
            className="nb-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </nav>
    </>
  );
}

export default Navbar;