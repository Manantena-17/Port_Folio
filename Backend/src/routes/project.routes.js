const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Routes publiques
router.get('/', projectController.getProjects);
router.get('/search', projectController.searchProjects);
router.get('/:id', projectController.getProjectById);

// Routes d'administration (à protéger plus tard avec JWT)
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;