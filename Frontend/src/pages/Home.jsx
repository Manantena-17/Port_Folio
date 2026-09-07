// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';

function Home() {
  return (
    <div>
      <Hero />
      <Skills />
      
      {/* Section supplémentaire : Témoignages */}
      <section style={{
        marginTop: '4rem',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          🌟 Ce que disent mes clients
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
              "Excellent travail ! Très professionnel et à l'écoute."
            </p>
            <strong>- Client 1</strong>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
              "Un développeur talentueux qui a su comprendre mes besoins."
            </p>
            <strong>- Client 2</strong>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
              "Je recommande vivement ses services !"
            </p>
            <strong>- Client 3</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;