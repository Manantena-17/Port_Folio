const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Le titre est requis' },
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La description est requise' }
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  technologies: {
    type: DataTypes.JSON, // Stocké comme JSON en MySQL
    allowNull: true,
    defaultValue: []
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: { msg: 'Format URL invalide' }
    }
  },
  github: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: { msg: 'Format URL invalide' }
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'projects',
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Utilise snake_case
});

module.exports = Project;