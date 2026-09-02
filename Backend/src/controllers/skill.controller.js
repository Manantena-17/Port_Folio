const Skill = require('../models/Skill');

// ✅ Obtenir toutes les compétences
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [['category', 'ASC']]
    });
    res.status(200).json({
      success: true,
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

// ✅ Créer une compétence
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création',
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
      message: 'Compétence supprimée'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};