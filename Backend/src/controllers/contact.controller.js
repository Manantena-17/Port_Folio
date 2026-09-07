// controllers/contactController.js
const Contact = require('../models/Contact');
const { Op } = require('sequelize');

// ✅ Obtenir tous les messages de contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

// ✅ Obtenir un message de contact par ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message',
      error: error.message
    });
  }
};

// ✅ Envoyer un message de contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Récupérer l'IP et le user agent
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ip,
      userAgent,
      status: 'non lu'
    });
    
    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// ✅ Mettre à jour un message de contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    await contact.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Message mis à jour avec succès',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// ✅ Supprimer un message de contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    await contact.destroy();
    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// ✅ Rechercher des messages de contact
exports.searchContacts = async (req, res) => {
  try {
    const { q, status } = req.query;
    const where = {};
    
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { subject: { [Op.like]: `%${q}%` } },
        { message: { [Op.like]: `%${q}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    const contacts = await Contact.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};