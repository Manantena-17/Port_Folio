
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const CONFIG = {
  requestTimeout: 15000,
};

/* ─────────────────────────────────────────────────────────────
   Carte témoignage (mémoïsée)
   ───────────────────────────────────────────────────────────── */
const TestimonialCard = React.memo(function TestimonialCard({
  quote,
  author,
  role,
}) {
  return (
    <blockquote className="testimonial-card">
      <p className="testimonial-quote">« {quote} »</p>
      <footer className="testimonial-author">
        <strong>{author}</strong>
        {role && <span className="testimonial-role"> · {role}</span>}
      </footer>
    </blockquote>
  );
});

/* ─────────────────────────────────────────────────────────────
   États : chargement / erreur / vide
   ───────────────────────────────────────────────────────────── */
function TestimonialsState({ children, busy = false }) {
  return (
    <div className="testimonials-state" aria-busy={busy || undefined}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────── */
function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  /* ─── Chargement des témoignages ─── */
  const loadTestimonials = useCallback(async () => {
    // Annule une éventuelle requête précédente (utile pour le retry)
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, CONFIG.requestTimeout);

    try {
      const response = await fetch(`${API_URL}/testimonials`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
      }

      const json = await response.json();
      if (!mountedRef.current) return;

      setTestimonials(Array.isArray(json) ? json : json.testimonials || []);
    } catch (err) {
      if (!mountedRef.current) return;
      // Annulation volontaire (démontage) → on ignore
      if (err.name === 'AbortError' && !timedOut) return;

      setError(
        timedOut
          ? 'Le serveur met trop de temps à répondre.'
          : err.message || 'Erreur inconnue'
      );
    } finally {
      clearTimeout(timeoutId);
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadTestimonials();

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [loadTestimonials]);

  const hasTestimonials = !loading && !error && testimonials.length > 0;

  return (
    <div className="home-page">
      <Hero />
      <Skills />

      {/* ─── Section Témoignages ─── */}
      <section
        className="testimonials-section"
        aria-labelledby="testimonials-title"
      >
        <h2 id="testimonials-title" className="section-title">
          🌟 Ce que disent mes clients
        </h2>

        {/* État : chargement */}
        {loading && (
          <TestimonialsState busy>
            <div className="spinner" aria-hidden="true" />
            <p>Chargement des témoignages…</p>
          </TestimonialsState>
        )}

        {/* État : erreur */}
        {!loading && error && (
          <TestimonialsState>
            <p role="alert" className="error-msg">
              ❌ {error}
            </p>
            <button
              type="button"
              onClick={loadTestimonials}
              className="cta-btn"
            >
              🔄 Réessayer
            </button>
          </TestimonialsState>
        )}

        {/* État : vide */}
        {!loading && !error && testimonials.length === 0 && (
          <p className="testimonials-empty">Aucun témoignage pour le moment.</p>
        )}

        {/* État : données */}
        {hasTestimonials && (
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id ?? `${testimonial.author}-${index}`}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;