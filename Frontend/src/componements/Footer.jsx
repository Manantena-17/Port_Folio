// src/components/Footer.jsx
import React, { useMemo } from 'react';


const SITE_NAME = 'Mon Portfolio';

const SOCIALS = [
  { name: 'GitHub', url: 'https://github.com/votre-compte', icon: '🐙' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/votre-compte', icon: '💼' },
  { name: 'Twitter', url: 'https://twitter.com/votre-compte', icon: '🐦' },
];

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Projets', href: '/projects' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/* ─────────────────────────────────────────────────────────────
   Lien social (mémoïsé)
   ───────────────────────────────────────────────────────────── */
const SocialLink = React.memo(function SocialLink({ name, url, icon }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-social-link"
      aria-label={`Profil ${name}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{name}</span>
    </a>
  );
});

/* ─────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────── */
function Footer() {
  // Calculé une seule fois au montage : pas de re-calcul à chaque rendu
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ─── Navigation ─── */}
        <nav className="footer-nav" aria-label="Navigation de pied de page">
          <ul className="footer-nav-list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="footer-nav-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ─── Réseaux sociaux ─── */}
        <div className="footer-socials">
          {SOCIALS.map((social) => (
            <SocialLink key={social.name} {...social} />
          ))}
        </div>

        {/* ─── Copyright ─── */}
        <p className="footer-copyright">
          © {currentYear} {SITE_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer;