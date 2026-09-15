// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Accueil',  end: true },
  { to: '/about',    label: 'À propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact',  label: 'Contact' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Ferme le menu à chaque changement de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Ferme le menu avec la touche Échap
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Styles pour ce qui ne peut pas être fait en inline :
          media queries, :hover, animation du burger, focus */}
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: #1a1a2e;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .navbar__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .navbar__logo {
          color: #f1c40f;
          font-size: 1.6rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity .25s ease;
        }
        .navbar__logo span { color: #fff; }
        .navbar__logo:hover { opacity: .85; }

        .navbar__links {
          display: flex;
          align-items: center;
          gap: .25rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .navbar__link {
          display: block;
          padding: .5rem 1rem;
          border-radius: 6px;
          color: #fff;
          font-size: 1.05rem;
          text-decoration: none;
          transition: color .25s ease, background-color .25s ease;
        }
        .navbar__link:hover {
          color: #f1c40f;
          background-color: rgba(255,255,255,.07);
        }
        .navbar__link.is-active {
          color: #f1c40f;
          background-color: rgba(241,196,15,.12);
        }
        .navbar__link:focus-visible,
        .navbar__logo:focus-visible,
        .navbar__burger:focus-visible {
          outline: 2px solid #f1c40f;
          outline-offset: 2px;
        }

        /* Burger (caché en desktop) */
        .navbar__burger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 22px;
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
        }
        .navbar__burger span {
          display: block;
          width: 100%;
          height: 3px;
          border-radius: 3px;
          background: #fff;
          transition: transform .3s ease, opacity .3s ease;
        }
        .navbar__burger.is-open span:nth-child(1) { transform: translateY(9.5px) rotate(45deg); }
        .navbar__burger.is-open span:nth-child(2) { opacity: 0; }
        .navbar__burger.is-open span:nth-child(3) { transform: translateY(-9.5px) rotate(-45deg); }

        /* ---------- Mobile ---------- */
        @media (max-width: 768px) {
          .navbar__inner { padding: 0 1.25rem; }
          .navbar__burger { display: flex; }

          .navbar__links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            align-items: stretch;
            gap: .25rem;
            background: #1a1a2e;
            border-top: 1px solid rgba(255,255,255,.08);
            box-shadow: 0 12px 24px rgba(0,0,0,.35);
            max-height: 0;
            padding: 0 1.25rem;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: max-height .35s ease, opacity .25s ease,
                        padding .35s ease, visibility .35s;
          }
          .navbar__links.is-open {
            max-height: 70vh;
            padding: .75rem 1.25rem 1rem;
            opacity: 1;
            visibility: visible;
          }
          .navbar__link {
            padding: .9rem 1rem;
            font-size: 1.1rem;
            border-radius: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar__links,
          .navbar__link,
          .navbar__burger span { transition: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            Mon<span>Portfolio</span>
          </Link>

          {/* Bouton burger (mobile) */}
          <button
            type="button"
            className={`navbar__burger ${isMenuOpen ? 'is-open' : ''}`}
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
            className={`navbar__links ${isMenuOpen ? 'is-open' : ''}`}
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;