// routes/contact.routes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Routes publiques
router.get('/', contactController.getContacts);
router.get('/search', contactController.searchContacts);
router.get('/:id', contactController.getContactById);

// Route publique pour envoyer un message
router.post('/', contactController.createContact);

// Routes d'administration (à protéger plus tard avec JWT)
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;