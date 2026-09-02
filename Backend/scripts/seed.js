const sequelize = require('../src/config/database');
const Project = require('../src/models/Project');
const Skill = require('../src/models/Skill');

const seedData = async () => {
  try {
    // ⚠️ Attention: Supprime toutes les données existantes
    await sequelize.sync({ force: true });
    console.log('✅ Tables recréées');

    // Ajouter des compétences
    const skills = await Skill.bulkCreate([
      { name: 'React', category: 'frontend', level: 'avancé', icon: '⚛️' },
      { name: 'JavaScript', category: 'frontend', level: 'avancé', icon: '🟨' },
      { name: 'Node.js', category: 'backend', level: 'intermédiaire', icon: '🟢' },
      { name: 'MySQL', category: 'database', level: 'intermédiaire', icon: '🐬' },
      { name: 'Express', category: 'backend', level: 'intermédiaire', icon: '🚂' },
      { name: 'Docker', category: 'devops', level: 'débutant', icon: '🐳' }
    ]);
    console.log(`✅ ${skills.length} compétences ajoutées`);

    // Ajouter des projets
    const projects = await Project.bulkCreate([
      {
        title: 'Application E-commerce',
        description: 'Application de vente en ligne avec panier, paiement Stripe et gestion des stocks',
        image: 'https://via.placeholder.com/600x400/3498db/ffffff?text=E-commerce',
        technologies: ['React', 'Node.js', 'MySQL', 'Stripe'],
        link: 'https://mon-ecommerce.com',
        github: 'https://github.com/votre-nom/ecommerce',
        isFeatured: true
      },
      {
        title: 'Dashboard Analytics',
        description: 'Tableau de bord interactif pour visualiser des données en temps réel avec graphiques',
        image: 'https://via.placeholder.com/600x400/2ecc71/ffffff?text=Dashboard',
        technologies: ['React', 'D3.js', 'WebSocket', 'Express'],
        link: 'https://mon-dashboard.com',
        github: 'https://github.com/votre-nom/dashboard',
        isFeatured: true
      },
      {
        title: 'API REST Portfolio',
        description: 'API RESTful complète pour gérer un portfolio avec authentification JWT',
        image: 'https://via.placeholder.com/600x400/e74c3c/ffffff?text=API',
        technologies: ['Node.js', 'Express', 'MySQL', 'JWT'],
        github: 'https://github.com/votre-nom/portfolio-api'
      },
      {
        title: 'Application Mobile',
        description: 'Application mobile multiplateforme avec React Native',
        image: 'https://via.placeholder.com/600x400/9b59b6/ffffff?text=Mobile',
        technologies: ['React Native', 'Expo', 'Firebase'],
        github: 'https://github.com/votre-nom/mobile-app'
      }
    ]);
    console.log(`✅ ${projects.length} projets ajoutés`);

    console.log('✅ Seed terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error.message);
    process.exit(1);
  }
};

seedData();