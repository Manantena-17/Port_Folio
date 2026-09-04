const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');

// Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // URL de Vite
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Portfolio fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// ✅ Synchronisation de la base de données et démarrage
const startServer = async () => {
  try {
    // Synchroniser les modèles avec MySQL
    await sequelize.sync({ alter: true }); // alter: true met à jour les tables sans perdre les données
    console.log('✅ Tables synchronisées avec MySQL');
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
      console.log(`📊 Base de données: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error.message);
  }
};

startServer();