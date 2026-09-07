// controllers/skillController.js
const Skill = require('../models/Skill');
const { Op } = require('sequelize');

// ✅ Obtenir toutes les compétences
exports.getSkills = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const where = {};

    // Filtres
    if (category) {
      where.category = category;
    }
    if (level) {
      where.level = level;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    const skills = await Skill.findAll({
      where,
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    // Grouper par catégorie
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
      grouped: groupedSkills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences',
      error: error.message
    });
  }
};

// ✅ Obtenir une compétence par ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la compétence',
      error: error.message
    });
  }
};

// ✅ Créer une compétence
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;

    // Vérifier si la compétence existe déjà
    const existingSkill = await Skill.findOne({ where: { name } });
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Cette compétence existe déjà'
      });
    }

    const skill = await Skill.create({
      name,
      category,
      level,
      icon
    });

    res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la compétence',
      error: error.message
    });
  }
};

// ✅ Mettre à jour une compétence
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour la même compétence)
    if (req.body.name && req.body.name !== skill.name) {
      const existingSkill = await Skill.findOne({ 
        where: { 
          name: req.body.name,
          id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Une compétence avec ce nom existe déjà'
        });
      }
    }

    await skill.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Compétence mise à jour avec succès',
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// ✅ Supprimer une compétence
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }

    await skill.destroy();

    res.status(200).json({
      success: true,
      message: 'Compétence supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// ✅ Obtenir les compétences par catégorie
exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const skills = await Skill.findAll({
      where: { category },
      order: [['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      category,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences',
      error: error.message
    });
  }
};

// ✅ Obtenir les statistiques des compétences
exports.getSkillStats = async (req, res) => {
  try {
    const total = await Skill.count();
    
    const categoryStats = await Skill.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count']
      ],
      group: ['category']
    });

    const levelStats = await Skill.findAll({
      attributes: [
        'level',
        [sequelize.fn('COUNT', sequelize.col('level')), 'count']
      ],
      group: ['level']
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        byCategory: categoryStats,
        byLevel: levelStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};