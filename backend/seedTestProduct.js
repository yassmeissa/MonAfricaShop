require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
  }
};

const seedTestProduct = async () => {
  try {
    await connectDB();

    // Obtenir la catégorie "Épices" (ou créer une)
    let category = await Category.findOne({ name: 'Test' });
    if (!category) {
      category = await Category.create({
        name: 'Test',
        description: 'Produits de test'
      });
      console.log('Catégorie "Test" créée');
    }

    // Vérifier si le produit existe déjà
    const existingProduct = await Product.findOne({ name: 'Produit Test 0.1€' });
    if (existingProduct) {
      console.log('Produit de test existe déjà');
      process.exit(0);
    }

    // Créer le produit de test
    const testProduct = await Product.create({
      name: 'Produit Test 0.1€',
      description: 'Produit de test pour tester les paiements Stripe et PayPal. Prix très bas pour tester facilement.',
      price: 0.1,
      category: category._id,
      image: 'https://via.placeholder.com/400?text=Test+Product',
      stock: 100
    });

    console.log('✅ Produit de test créé avec succès:');
    console.log(`   ID: ${testProduct._id}`);
    console.log(`   Nom: ${testProduct.name}`);
    console.log(`   Prix: ${testProduct.price}€`);
    console.log('');
    console.log('Vous pouvez maintenant ajouter ce produit au panier et tester les paiements!');

    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
};

seedTestProduct();
