require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/africa-shop');
    console.log('MongoDB connecté');

    // Vérifier si des catégories existent déjà
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('Des catégories existent déjà. Suppression...');
      await Category.deleteMany({});
    }

    const categoriesData = [
      {
        name: 'Épices & Condiments',
        description: 'Collection premium d\'épices africaines authentiques',
        emoji: '🌶️',
        image: '',
        color: '#ea580c'
      },
      {
        name: 'Fruits Exotiques',
        description: 'Mangues juteuses, plantains dorés et fruits du continent',
        emoji: '🥭',
        image: '',
        color: '#fbbf24'
      },
      {
        name: 'Céréales & Légumineuses',
        description: 'Fonio, mil, sorgho et haricots niébé traditionnels',
        emoji: '🌾',
        image: '',
        color: '#f59e0b'
      },
      {
        name: 'Boissons & Breuvages',
        description: 'Jus naturels, thés et boissons traditionnelles africaines',
        emoji: '🥤',
        image: '',
        color: '#3b82f6'
      },
      {
        name: 'Viandes & Poissons',
        description: 'Produits carnés de qualité premium',
        emoji: '🍖',
        image: '',
        color: '#dc2626'
      },
      {
        name: 'Produits Laitiers',
        description: 'Fromage, beurre et produits laitiers africains',
        emoji: '🧈',
        image: '',
        color: '#8b5cf6'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ ${categories.length} catégories créées avec succès!`);

    categories.forEach(cat => {
      console.log(`  - ${cat.emoji} ${cat.name}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedCategories();
