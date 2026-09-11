// routes/skillRoutes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');

// Routes publiques
router.get('/', skillController.getSkills);
router.get('/category/:category', skillController.getSkillsByCategory);
router.get('/:id', skillController.getSkillById);

// Routes d'administration (à protéger plus tard avec JWT)
router.post('/', skillController.createSkill);
router.put('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;