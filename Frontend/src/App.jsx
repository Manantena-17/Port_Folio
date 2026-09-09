// src/App.jsx - Page Projects
import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import ProjectCard from '../componements/ProjectCard';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les projets
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll();
      // Votre backend renvoie: { success: true, count: x, data: [...] }
      const projectsData = response.data.data || [];
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Impossible de charger les projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Recherche
  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (query.trim() === '') {
      await fetchProjects();
    } else {
      try {
        setLoading(true);
        const response = await projectService.search({ q: query });
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtrage par catégorie
  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'all') return true;
    return project.category === selectedCategory;
  });

  // Supprimer un projet
  const handleDelete = async (id) => {
    try {
      await projectService.delete(id);
      // Recharger la liste
      await fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  // Extraire les catégories
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#666' }}>Chargement des projets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
        <p style={{ color: '#dc3545' }}>{error}</p>
        <button 
          onClick={fetchProjects}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ 
        marginBottom: '0.5rem', 
        color: '#1a1a2e',
        fontSize: '2.5rem'
      }}>
        💼 Mes Projets
      </h1>
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '1.1rem'
      }}>
        Découvrez mes réalisations et projets personnels
      </p>

      {/* Filtres */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un projet..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            flex: '1',
            minWidth: '200px',
            maxWidth: '400px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? '📂 Tous les projets' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Compteur */}
      {projects.length > 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '1rem' }}>
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
        </p>
      )}

      {/* Grille */}
      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: '#999' }}>Aucun projet ne correspond à votre recherche</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              fetchProjects();
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginTop: '1rem'
        }}>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              {...project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Projects;