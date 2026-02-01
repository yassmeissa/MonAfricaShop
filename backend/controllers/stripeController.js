const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const createPaymentIntent = async (req, res) => {
  try {
    const { total, email } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    // Créer une Payment Intent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Montant en cents
      currency: 'eur',
      metadata: {
        email: email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLIC_KEY
    });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ message: 'Erreur lors de la création du paiement' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, customer, items, total } = req.body;

    // Récupérer les détails du Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Paiement non confirmé' });
    }

    // Extraire l'userId du token s'il existe
    let userId = null;
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7); // Retirer "Bearer "
      console.log('Token extracted:', token.substring(0, 20) + '...');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        console.log('Decoded userId:', userId);
      } catch (err) {
        console.log('Token invalide:', err.message);
      }
    }

    // Créer la commande en base de données
    // Transformer les items pour que le modèle reçoive product (ObjectId) et quantity
    const transformedItems = items.map(item => ({
      product: item.product._id || item.product, // Extraire l'ID du product
      quantity: item.quantity
    }));

    const order = await Order.create({
      user: userId, // Ajouter l'ID utilisateur si connecté
      customer,
      items: transformedItems,
      paymentMethod: 'card',
      total,
      status: 'paid', // Marquer comme payée
      stripePaymentIntentId: paymentIntentId
    });

    console.log('Order created with userId:', userId, 'Order:', order._id);
    res.status(201).json(order);
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la confirmation du paiement' });
  }
};

module.exports = { createPaymentIntent, confirmPayment };
