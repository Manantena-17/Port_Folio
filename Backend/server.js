// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import des routes
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);  // 👈 Ajout des routes utilisateurs

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Portfolio fonctionnelle ✅',
    timestamp: new Date().toISOString()
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
}); 

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health`);
});