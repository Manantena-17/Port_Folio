// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#1a1a2e',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      {/* Logo */}
      <Link to="/" style={{
        color: '#f1c40f',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textDecoration: 'none'
      }}>
        Mon Portfolio
      </Link>

      {/* Menu Desktop */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({
            color: isActive ? '#f1c40f' : 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            transition: 'all 0.3s',
            backgroundColor: isActive ? 'rgba(241, 196, 15, 0.1)' : 'transparent'
          })}
        >
          Accueil
        </NavLink>
        <NavLink 
          to="/about" 
          style={({ isActive }) => ({
            color: isActive ? '#f1c40f' : 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            transition: 'all 0.3s',
            backgroundColor: isActive ? 'rgba(241, 196, 15, 0.1)' : 'transparent'
          })}
        >
          À propos
        </NavLink>
        <NavLink 
          to="/projects" 
          style={({ isActive }) => ({
            color: isActive ? '#f1c40f' : 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            transition: 'all 0.3s',
            backgroundColor: isActive ? 'rgba(241, 196, 15, 0.1)' : 'transparent'
          })}
        >
          Projets
        </NavLink>
        <NavLink 
          to="/contact" 
          style={({ isActive }) => ({
            color: isActive ? '#f1c40f' : 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            transition: 'all 0.3s',
            backgroundColor: isActive ? 'rgba(241, 196, 15, 0.1)' : 'transparent'
          })}
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;