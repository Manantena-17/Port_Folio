import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#projets', label: 'Projets' },
    { href: '#competences', label: 'Compétences' },
    { href: '#contact', label: 'Contact' },
  ];

  // Détecter le scroll pour ajouter un effet au header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Détecter la section active
  useEffect(() => {
    const sections = navLinks.map((link) => link.href.substring(1));
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

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
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

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <a href="#accueil" className="logo" onClick={handleLinkClick}>
          <span className="logo-icon" aria-hidden="true">🚀</span>
          <span className="logo-text">Mon Portfolio</span>
        </a>

        <button
          ref={toggleRef}
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav
          id="main-nav"
          ref={menuRef}
          className={`nav ${isMenuOpen ? 'open' : ''}`}
          aria-hidden={!isMenuOpen && window.innerWidth < 768}
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={activeSection === href.substring(1) ? 'active' : ''}
            >
              {label}
            </a>
          ))}
        </nav>

        {isMenuOpen && (
          <div
            className="overlay"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
};

export default Header;