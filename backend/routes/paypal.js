const express = require('express');
const { createPayPalOrder, capturePayPalPayment } = require('../controllers/paypalController');

const router = express.Router();

// Créer une commande PayPal
router.post('/create-order', createPayPalOrder);

// Capturer le paiement PayPal
router.post('/capture', capturePayPalPayment);

module.exports = router;
