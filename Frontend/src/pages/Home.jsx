
import React, { useEffect, useState, useCallback } from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

function Home() {
  // 🔹 États pour les témoignages (chargés via backend)
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Chargement des témoignages
  const loadTestimonials = useCallback((signal) => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/testimonials`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`);
        return res.json();
      })
      .then((json) => setTestimonials(json))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTestimonials(controller.signal);
    return () => controller.abort();
  }, [loadTestimonials]);

  const handleRetry = () => loadTestimonials();

  return (
    <div className="home-page">
      <Hero />
      <Skills />

      {/* ─── Section Témoignages ─── */}
      <section className="testimonials-section" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="section-title">
          🌟 Ce que disent mes clients
        </h2>

        {/* État : chargement */}
        {loading && (
          <div className="testimonials-state" aria-busy="true">
            <div className="spinner" aria-hidden="true" />
            <p>Chargement des témoignages…</p>
          </div>
        )}

        {/* État : erreur */}
        {error && !loading && (
          <div className="testimonials-state">
            <p role="alert" className="error-msg">
              ❌ Impossible de charger les témoignages.
            </p>
            <button type="button" onClick={handleRetry} className="cta-btn">
              🔄 Réessayer
            </button>
          </div>
        )}

        {/* État : vide */}
        {!loading && !error && testimonials.length === 0 && (
          <p className="testimonials-empty">Aucun témoignage pour le moment.</p>
        )}

        {/* État : données */}
        {!loading && !error && testimonials.length > 0 && (
          <div className="testimonials-grid">
            {testimonials.map(({ id, quote, author, role }) => (
              <blockquote key={id} className="testimonial-card">
                <p className="testimonial-quote">"{quote}"</p>
                <footer className="testimonial-author">
                  <strong>{author}</strong>
                  {role && <span className="testimonial-role"> · {role}</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;