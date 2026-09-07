// controllers/userController.js
const User = require('../models/User');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ============================================
// ✅ Obtenir tous les utilisateurs (Admin)
// ============================================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['name', 'ASC']],
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// ============================================
// ✅ Obtenir un utilisateur par ID (Admin)
// ============================================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
};

// ============================================
// ✅ Créer un utilisateur (Inscription)
// ============================================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    // Générer un token
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

// ============================================
// ✅ Connexion utilisateur (Login)
// ============================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Mettre à jour la dernière connexion
    await user.update({ lastLogin: new Date() });
    
    // Générer un token
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// ============================================
// ✅ Mettre à jour un utilisateur
// ============================================
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: req.body.email,
          id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé par un autre utilisateur'
        });
      }
    }
    
    await user.update(req.body);
    
    // Récupérer l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// ============================================
// ✅ Supprimer un utilisateur (Admin)
// ============================================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Empêcher la suppression de son propre compte
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }
    
    await user.destroy();
    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// ============================================
// ✅ Rechercher des utilisateurs (Admin)
// ============================================
exports.searchUsers = async (req, res) => {
  try {
    const { q, role } = req.query;
    const where = {};
    
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } }
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    const users = await User.findAll({ 
      where,
      order: [['name', 'ASC']],
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};

// ============================================
// ✅ Obtenir son propre profil
// ============================================
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// ============================================
// ✅ Mettre à jour son propre profil
// ============================================
exports.updateMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Vérifier si l'email est modifié
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: req.body.email,
          id: { [Op.ne]: req.user.id }
        } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
    }
    
    // Ne pas permettre de changer son rôle via cette route
    delete req.body.role;
    
    await user.update(req.body);
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    
    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};