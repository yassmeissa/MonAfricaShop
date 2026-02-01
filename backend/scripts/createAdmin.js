require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

async function createAdmin() {
  try {
    await connectDB();

    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('✅ Un admin existe déjà:', adminExists.email);
      process.exit(0);
    }

    // Créer l'admin
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Shop',
      email: 'admin@africashop.com',
      password: 'Admin@123456', // À changer après la première connexion
      phone: '+33612345678',
      address: '123 Admin Street',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin créé avec succès!');
    console.log('Email: admin@africashop.com');
    console.log('Mot de passe: Admin@123456');
    console.log('⚠️  Changez le mot de passe après la première connexion!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createAdmin();
