require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/africaShop');
    console.log('MongoDB connecté');

    // Récupérer les catégories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('❌ Aucune catégorie trouvée. Exécutez d\'abord seedCategories.js');
      process.exit(1);
    }

    // Créer une map catégorie -> ID
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('📁 Catégories trouvées:', Object.keys(categoryMap));

    // Vérifier si des produits existent déjà
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`${existingProducts} produits existent déjà. Suppression...`);
      await Product.deleteMany({});
    }

    const productsData = [
      // Épices & Condiments
      {
        name: 'Berbère Éthiopien Premium',
        description: 'Mélange d\'épices traditionnel éthiopien avec piment, gingembre et coriandre.',
        price: 12.99,
        category: categoryMap['Épices & Condiments'],
        image: 'https://images.unsplash.com/photo-1596040299507-4c4d0f7f6c5f?w=400&h=400&fit=crop',
        stock: 25
      },
      {
        name: 'Harissa Tunisienne',
        description: 'Pâte de piment rouge intense avec ail et épices, produite artisanalement.',
        price: 8.99,
        category: categoryMap['Épices & Condiments'],
        image: 'https://images.unsplash.com/photo-1596040299507-4c4d0f7f6c5f?w=400&h=400&fit=crop',
        stock: 30
      },
      {
        name: 'Curry Sénégalais',
        description: 'Mélange savoureux de curcuma, cumin et autres épices d\'Afrique de l\'Ouest.',
        price: 9.99,
        category: categoryMap['Épices & Condiments'],
        image: 'https://images.unsplash.com/photo-1596040299507-4c4d0f7f6c5f?w=400&h=400&fit=crop',
        stock: 20
      },
      {
        name: 'Gingembre Séché Bio',
        description: 'Gingembre séché premium d\'Afrique, parfait pour les infusions et cuisines.',
        price: 14.99,
        category: categoryMap['Épices & Condiments'],
        image: 'https://images.unsplash.com/photo-1596040299507-4c4d0f7f6c5f?w=400&h=400&fit=crop',
        stock: 15
      },
      {
        name: 'Sel Rose de l\'Himalaya Africain',
        description: 'Sel cristallisé fin avec minéraux essentiels, idéal pour la cuisine.',
        price: 6.99,
        category: categoryMap['Épices & Condiments'],
        image: 'https://images.unsplash.com/photo-1596040299507-4c4d0f7f6c5f?w=400&h=400&fit=crop',
        stock: 40
      },

      // Fruits Exotiques
      {
        name: 'Mangue Kent Premium',
        description: 'Mangues juteuses et sucrées, directement d\'Afrique de l\'Ouest.',
        price: 4.99,
        category: categoryMap['Fruits Exotiques'],
        image: 'https://images.unsplash.com/photo-1585518419759-3a4b932e9c3e?w=400&h=400&fit=crop',
        stock: 50
      },
      {
        name: 'Plantain Frais',
        description: 'Plantain demi-mûr pour cuisson, saveur douce et texture moelleuse.',
        price: 3.99,
        category: categoryMap['Fruits Exotiques'],
        image: 'https://images.unsplash.com/photo-1585518419759-3a4b932e9c3e?w=400&h=400&fit=crop',
        stock: 45
      },
      {
        name: 'Fruits du Baobab Bio',
        description: 'Poudre de baobab riche en vitamines C, parfait pour les jus et smoothies.',
        price: 16.99,
        category: categoryMap['Fruits Exotiques'],
        image: 'https://images.unsplash.com/photo-1585518419759-3a4b932e9c3e?w=400&h=400&fit=crop',
        stock: 10
      },
      {
        name: 'Noix de Coco Séchée',
        description: 'Noix de coco râpée séchée, 100% naturelle, sans additifs.',
        price: 7.99,
        category: categoryMap['Fruits Exotiques'],
        image: 'https://images.unsplash.com/photo-1585518419759-3a4b932e9c3e?w=400&h=400&fit=crop',
        stock: 35
      },
      {
        name: 'Bananes Plantain Rouges',
        description: 'Variété rouge rare, parfait pour les fritures et poêlées africaines.',
        price: 5.99,
        category: categoryMap['Fruits Exotiques'],
        image: 'https://images.unsplash.com/photo-1585518419759-3a4b932e9c3e?w=400&h=400&fit=crop',
        stock: 30
      },

      // Céréales & Légumineuses
      {
        name: 'Fonio Blanc Premium',
        description: 'Céréale ancestrale ouest-africaine, riche en fibres et minéraux.',
        price: 11.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 20
      },
      {
        name: 'Riz Basmati Africain',
        description: 'Riz long grain parfumé d\'Afrique de l\'Est, cuisson légère et fluide.',
        price: 8.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 60
      },
      {
        name: 'Haricots Niébé',
        description: 'Haricots noir traditionnels africains, protéines complètes et nutritives.',
        price: 6.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 40
      },
      {
        name: 'Mil Bio',
        description: 'Mil complet sans OGM, aliment de base sain d\'Afrique subsaharienne.',
        price: 9.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 25
      },
      {
        name: 'Sorgho Blanc',
        description: 'Sorgho décortiqué, idéal pour porridges et farine traditionnelle.',
        price: 7.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 18
      },
      {
        name: 'Lentilles Rouges Africaines',
        description: 'Lentilles riches en protéines et fer, parfaites pour les ragoûts.',
        price: 5.99,
        category: categoryMap['Céréales & Légumineuses'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        stock: 50
      },

      // Boissons & Breuvages
      {
        name: 'Jus de Bissap Concentré',
        description: 'Boisson traditionnelle à base d\'hibiscus, rafraîchissante et revitalisante.',
        price: 9.99,
        category: categoryMap['Boissons & Breuvages'],
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd1ee3fa?w=400&h=400&fit=crop',
        stock: 30
      },
      {
        name: 'Thé Moringa Bio',
        description: 'Thé vert avec feuilles de moringa, super-aliment naturel très énergisant.',
        price: 13.99,
        category: categoryMap['Boissons & Breuvages'],
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd1ee3fa?w=400&h=400&fit=crop',
        stock: 22
      },
      {
        name: 'Café Éthiopien Yirgacheffe',
        description: 'Café premium d\'Éthiopie avec notes florales et fruitées distinctives.',
        price: 18.99,
        category: categoryMap['Boissons & Breuvages'],
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd1ee3fa?w=400&h=400&fit=crop',
        stock: 15
      },
      {
        name: 'Cacao 100% Pur Africain',
        description: 'Poudre de cacao non-sucré d\'Afrique de l\'Ouest, riche en antioxydants.',
        price: 14.99,
        category: categoryMap['Boissons & Breuvages'],
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd1ee3fa?w=400&h=400&fit=crop',
        stock: 20
      },

      // Viandes & Poissons
      {
        name: 'Poisson Sec Traditionnel',
        description: 'Poisson séché selon la méthode ancestrale africaine, intense en saveur.',
        price: 19.99,
        category: categoryMap['Viandes & Poissons'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        stock: 12
      },
      {
        name: 'Viande Séchée Biltong',
        description: 'Biltong sud-africain savoureux, protéines complètes sans additifs.',
        price: 22.99,
        category: categoryMap['Viandes & Poissons'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        stock: 8
      },
      {
        name: 'Anchois Séchés Premium',
        description: 'Petits poissons séchés, parfait pour les sauces et ragoûts africains.',
        price: 12.99,
        category: categoryMap['Viandes & Poissons'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        stock: 25
      },

      // Produits Laitiers
      {
        name: 'Lait de Chamelle Poudre',
        description: 'Lait riche en nutriments, parfait pour la santé et la vitalité.',
        price: 17.99,
        category: categoryMap['Produits Laitiers'],
        image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=400&fit=crop',
        stock: 10
      },
      {
        name: 'Fromage Africain Fermier',
        description: 'Fromage traditionnel artisanal d\'Afrique de l\'Ouest, saveur authentique.',
        price: 15.99,
        category: categoryMap['Produits Laitiers'],
        image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=400&fit=crop',
        stock: 14
      },
      {
        name: 'Beurre de Karité Pur',
        description: 'Beurre de karité 100% naturel, cosmétique et culinaire, très nourrissant.',
        price: 11.99,
        category: categoryMap['Produits Laitiers'],
        image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=400&fit=crop',
        stock: 28
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} produits créés avec succès!`);

    // Afficher les statistiques par catégorie
    const stats = {};
    products.forEach(p => {
      const catName = categories.find(c => c._id.equals(p.category))?.name || 'Unknown';
      stats[catName] = (stats[catName] || 0) + 1;
    });

    console.log('\n📊 Statistiques par catégorie:');
    Object.entries(stats).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count} produit(s)`);
    });

    await mongoose.connection.close();
    console.log('\n✨ Base de données prête!');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedProducts();
