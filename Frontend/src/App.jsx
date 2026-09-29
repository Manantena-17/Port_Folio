// src/App.jsx - Page Projects
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { projectService } from './services/api';
import ProjectCard from './componements/ProjectCard';

const SEARCH_DEBOUNCE_MS = 400;

// ==================== STYLES (regroupés) ====================
const styles = {
  // États
  status: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#666',
  },
  statusError: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#dc3545',
  },
  statusIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },

  // En-tête
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: {
    marginBottom: '0.5rem',
    color: '#1a1a2e',
    fontSize: '2.5rem',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },

  // Alerte
  alert: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
    borderRadius: '8px',
  },
  alertClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: 'inherit',
  },

  // Filtres
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  search: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    flex: '1',
    minWidth: '200px',
    maxWidth: '400px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  // Compteur
  count: {
    textAlign: 'center',
    color: '#999',
    marginBottom: '1rem',
  },

  // Grille
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '1rem',
  },

  // Boutons
  btnPrimary: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  btnSecondary: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

// ==================== COMPOSANT ====================
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  // ---------- Charger les projets ----------
  const fetchProjects = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getAll({
        signal: abortRef.current.signal,
      });
      // Backend: { success: true, count: x, data: [...] }
      setProjects(response.data?.data ?? []);
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') return;
      console.error('❌ Erreur:', err);
      setError(err.message || 'Impossible de charger les projets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchProjects]);

  // ---------- Recherche (debouncée) ----------
  const handleSearch = useCallback(
    (query) => {
      setSearchTerm(query);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        if (!query.trim()) {
          await fetchProjects();
          return;
        }
        try {
          setLoading(true);
          setError(null);
          const response = await projectService.search({ q: query });
          setProjects(response.data?.data ?? []);
        } catch (err) {
          if (err.name === 'AbortError' || err.name === 'CanceledError') return;
          console.error('Erreur de recherche:', err);
          setError('Erreur lors de la recherche');
        } finally {
          setLoading(false);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [fetchProjects]
  );

  // ---------- Supprimer (optimiste + confirmation) ----------
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;

      const backup = projects;
      setDeletingId(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));

      try {
        await projectService.delete(id);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setProjects(backup);
        setError('Erreur lors de la suppression du projet');
      } finally {
        setDeletingId(null);
      }
    },
    [projects]
  );

  // ---------- Reset ----------
  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    fetchProjects();
  }, [fetchProjects]);

  // ---------- Dérivés (mémoïsés) ----------
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['all', ...set];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // ---------- Loading ----------
  if (loading && projects.length === 0) {
    return (
      <div style={styles.status} role="status" aria-live="polite">
        <div style={styles.statusIcon}>⏳</div>
        <p>Chargement des projets...</p>
      </div>
    );
  }

  // ---------- Erreur bloquante ----------
  if (error && projects.length === 0) {
    return (
      <div style={styles.statusError} role="alert">
        <div style={styles.statusIcon}>❌</div>
        <p>{error}</p>
        <button style={styles.btnPrimary} onClick={fetchProjects}>
          Réessayer
        </button>
      </div>
    );
  }

  // ---------- Rendu principal ----------
  const count = filteredProjects.length;

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>💼 Mes Projets</h1>
        <p style={styles.subtitle}>
          Découvrez mes réalisations et projets personnels
        </p>
      </header>

      {/* Alerte non bloquante */}
      {error && projects.length > 0 && (
        <div style={styles.alert} role="alert">
          <span>{error}</span>
          <button
            style={styles.alertClose}
            onClick={() => setError(null)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filtres */}
      <section style={styles.filters} aria-label="Filtres">
        <input
          type="search"
          placeholder="🔍 Rechercher un projet..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Rechercher un projet"
          style={styles.search}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filtrer par catégorie"
          style={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? '📂 Tous les projets' : cat}
            </option>
          ))}
        </select>
      </section>

      {/* Compteur */}
      {projects.length > 0 && (
        <p style={styles.count}>
          {count} projet{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
        </p>
      )}

      {/* Grille ou état vide */}
      {count === 0 ? (
        <div style={styles.status}>
          <div style={styles.statusIcon}>🔍</div>
          <p>Aucun projet ne correspond à votre recherche</p>
          <button style={styles.btnSecondary} onClick={handleReset}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id ?? project._id}
              {...project}
              onDelete={handleDelete}
              isDeleting={deletingId === project.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;