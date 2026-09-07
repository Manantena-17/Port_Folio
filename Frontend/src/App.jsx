// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './componements/Navbar';
import Footer from './componements/Footer';
import Hero from './componements/Hero';
import Skills from './componements/Skills';
import ProjectCard from './componements/ProjectCard';
import ContactForm from './componements/ContactForm';
import Header from './componements/Header';

// Pages
function Home() {
  return (
    <div>
      <Hero />
        <Header />
      <Skills />
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>👤 À propos de moi</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <div>
          <h3>Qui suis-je ?</h3>
          <p style={{ lineHeight: '1.8' }}>
            Je suis un développeur web passionné par la création d'applications 
            modernes et responsives. J'aime apprendre de nouvelles technologies 
            et résoudre des problèmes complexes.
          </p>
          <h3>Expérience</h3>
          <ul>
            <li>2 ans de développement web</li>
            <li>Projets personnels et professionnels</li>
            <li>Stack MERN (MongoDB, Express, React, Node.js)</li>
          </ul>
        </div>
        <div>
          <h3>Ce que j'aime</h3>
          <ul>
            <li>⚛️ React et l'écosystème JavaScript</li>
            <li>🎨 UI/UX Design</li>
            <li>📱 Applications mobiles avec React Native</li>
            <li>☁️ Déploiement cloud</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const projects = [
    {
      id: 1,
      title: 'Portfolio',
      description: 'Mon portfolio personnel construit avec React et Vite',
      technologies: ['React', 'Vite', 'CSS3'],
      link: '#'
    },
    {
      id: 2,
      title: 'E-commerce App',
      description: 'Application e-commerce complète avec panier et paiement',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#'
    },
    {
      id: 3,
      title: 'Blog Platform',
      description: 'Plateforme de blog avec création et gestion d\'articles',
      technologies: ['React', 'Express', 'MongoDB', 'JWT'],
      link: '#'
    }
  ];

  return (
    <div>
      <h1>💼 Mes Projets</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {projects.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h1>📱 Contact</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        N'hésitez pas à me contacter pour toute question ou collaboration
      </p>
      <ContactForm />
    </div>
  );
}

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;