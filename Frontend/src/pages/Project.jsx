// src/pages/Projects.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const CONFIG = {
  requestTimeout: 15000,
  skeletonCount: 6,
  defaultImage: 'https://via.placeholder.com/600x400?text=Projet',
};

/* ─────────────────────────────────────────────────────────────
   Carte projet (mémoïsée)
   ───────────────────────────────────────────────────────────── */
const ProjectCard = React.memo(function ProjectCard({ project, onSelect }) {
  const {
    title,
    description,
    image,
    tags = [],
    demoUrl,
    repoUrl,
    featured = false,
  } = project;

  return (
    <article className={`project-card${featured ? ' featured' : ''}`}>
      <div className="project-image-wrapper">
        <img
          src={image || CONFIG.defaultImage}
          alt={`Aperçu de ${title}`}
          loading="lazy"
          className="project-image"
          onError={(e) => {
            e.currentTarget.src = CONFIG.defaultImage;
            e.currentTarget.onerror = null;
          }}
        />
        {featured && <span className="project-badge">⭐ Mis en avant</span>}
      </div>

      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>

        {tags.length > 0 && (
          <ul className="project-tags" aria-label="Technologies utilisées">
            {tags.map((tag) => (
              <li key={tag} className="project-tag">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="project-actions">
          <button
            type="button"
            className="btn-details"
            onClick={() => onSelect(project)}
          >
            Détails
          </button>

          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-demo"
            >
              Démo
            </a>
          )}

          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-repo"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
});

/* ─────────────────────────────────────────────────────────────
   Modale de détails
   ───────────────────────────────────────────────────────────── */
const ProjectModal = React.memo(function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const {
    title,
    description,
    longDescription,
    image,
    tags = [],
    demoUrl,
    repoUrl,
  } = project;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button
          ref={closeRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          ✕
        </button>

        <img
          src={image || CONFIG.defaultImage}
          alt={`Aperçu de ${title}`}
          className="modal-image"
          onError={(e) => {
            e.currentTarget.src = CONFIG.defaultImage;
            e.currentTarget.onerror = null;
          }}
        />

        <h2 id="project-modal-title" className="modal-title">
          {title}
        </h2>

        <p className="modal-description">
          {longDescription || description}
        </p>

        {tags.length > 0 && (
          <ul className="project-tags modal-tags" aria-label="Technologies utilisées">
            {tags.map((tag) => (
              <li key={tag} className="project-tag">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="modal-actions">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-demo"
            >
              Voir la démo
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-repo"
            >
              Voir le code
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   Composant principal
   ───────────────────────────────────────────────────────────── */
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  /* ─── Chargement des projets ─── */
  const fetchProjects = useCallback(async () => {
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
      const response = await fetch(`${API_URL}/projects`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch (err) {
      if (!mountedRef.current) return;

      // Annulation volontaire (démontage) : on ignore
      if (err.name === 'AbortError' && !timedOut) return;

      setError(
        timedOut
          ? 'Le serveur met trop de temps à répondre.'
          : 'Impossible de charger les projets.'
      );
    } finally {
      clearTimeout(timeoutId);
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchProjects();

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [fetchProjects]);

  /* ─── Tags disponibles ─── */
  const allTags = useMemo(() => {
    const tags = new Set();

    projects.forEach((project) => {
      (project.tags || []).forEach((tag) => tags.add(tag));
    });

    return ['all', ...Array.from(tags).sort()];
  }, [projects]);

  /* ─── Projets filtrés ─── */
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTag =
        activeTag === 'all' || (project.tags || []).includes(activeTag);

      if (!matchesTag) return false;
      if (!query) return true;

      return (
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        (project.tags || []).some((tag) =>
          tag.toLowerCase().includes(query)
        )
      );
    });
  }, [projects, search, activeTag]);

  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setActiveTag('all');
  }, []);

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>💼 Mes Projets</h1>
        <p className="subtitle">
          Découvrez une sélection de réalisations, d’expérimentations et de projets open-source.
        </p>
      </header>

      {/* ─── Barre d'outils ─── */}
      <div className="projects-toolbar">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          className="projects-search"
          aria-label="Rechercher un projet"
        />

        <div
          className="projects-filters"
          role="group"
          aria-label="Filtrer par technologie"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`filter-btn${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag === 'all' ? 'Tous' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Chargement ─── */}
      {loading && (
        <div className="projects-grid">
          {Array.from({ length: CONFIG.skeletonCount }).map((_, index) => (
            <div key={index} className="project-card skeleton" aria-hidden="true">
              <div className="skeleton-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )}

      {/* ─── Erreur ─── */}
      {!loading && error && (
        <div className="alert error" role="alert">
          ❌ {error}
          <button type="button" onClick={fetchProjects} className="retry-btn">
            Réessayer
          </button>
        </div>
      )}

      {/* ─── État vide ─── */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="empty-state">
          <p>😕 Aucun projet ne correspond à votre recherche.</p>
          {(search || activeTag !== 'all') && (
            <button type="button" onClick={resetFilters} className="clear-btn">
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* ─── Grille de projets ─── */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              onSelect={handleSelectProject}
            />
          ))}
        </div>
      )}

      {/* ─── Modale ─── */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Projects;