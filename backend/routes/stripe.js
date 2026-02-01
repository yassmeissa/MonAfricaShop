const express = require('express');
const { createPaymentIntent, confirmPayment } = require('../controllers/stripeController');

const router = express.Router();

// Créer une Payment Intent Stripe
router.post('/create-intent', createPaymentIntent);

// Confirmer un paiement Stripe
router.post('/confirm', confirmPayment);

module.exports = router;
