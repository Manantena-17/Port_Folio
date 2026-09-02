const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Le nom de la compétence est requis' }
    }
  },
  category: {
    type: DataTypes.ENUM('frontend', 'backend', 'database', 'devops', 'other'),
    defaultValue: 'other'
  },
  level: {
    type: DataTypes.ENUM('débutant', 'intermédiaire', 'avancé', 'expert'),
    defaultValue: 'intermédiaire'
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'skills',
  timestamps: true,
  underscored: true
});

module.exports = Skill;