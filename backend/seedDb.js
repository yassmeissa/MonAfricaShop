const mongoose = require('mongoose');
require('dotenv').config();

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

const categories = [
  { name: 'Riz & Grains', description: 'Riz, millet, sorgho', icon: '🌾' },
  { name: 'Épices', description: 'Épices africaines authentiques', icon: '🌶️' },
  { name: 'Fruits Secs', description: 'Arachides, noix, dattes', icon: '🥜' },
  { name: 'Boissons', description: 'Cafés, thés, jus naturels', icon: '☕' },
  { name: 'Farines', description: 'Farines traditionnelles', icon: '🌽' },
  { name: 'Viandes Séchées', description: 'Viandes séchées et biltong', icon: '🥩' }
];

const products = [
  { name: 'Riz Basmati Premium', description: 'Riz basmati de qualité supérieure', price: 12.99, category: 'Riz & Grains', image: 'https://via.placeholder.com/300', stock: 50, rating: 4.5 },
  { name: 'Épices Mix Africaines', description: 'Mélange d\'épices traditionnel', price: 8.99, category: 'Épices', image: 'https://via.placeholder.com/300', stock: 30, rating: 4.8 },
  { name: 'Arachides Grillées', description: 'Arachides naturelles grillées', price: 6.99, category: 'Fruits Secs', image: 'https://via.placeholder.com/300', stock: 40, rating: 4.6 },
  { name: 'Café Éthiopien', description: 'Café Arabica authentique d\'Éthiopie', price: 14.99, category: 'Boissons', image: 'https://via.placeholder.com/300', stock: 25, rating: 4.7 },
  { name: 'Farine de Maïs', description: 'Farine de maïs moulue fraîche', price: 5.99, category: 'Farines', image: 'https://via.placeholder.com/300', stock: 60, rating: 4.4 },
  { name: 'Biltong Sec', description: 'Viande séchée traditionnelle sud-africaine', price: 16.99, category: 'Viandes Séchées', image: 'https://via.placeholder.com/300', stock: 20, rating: 4.9 }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI non trouvée dans les variables d\'environnement');
      process.exit(1);
    }

    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Vider les collections
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Collections vidées');

    // Insérer les catégories
    await Category.insertMany(categories);
    console.log('✅ Catégories insérées');

    // Insérer les produits
    await Product.insertMany(products);
    console.log('✅ Produits insérés');

    console.log('🎉 Base de données remplie avec succès !');
    
    await mongoose.connection.close();
    console.log('📴 Connexion fermée');

  } catch (error) {
    console.error('❌ Erreur :', error.message);
    process.exit(1);
  }
}

seedDatabase();
