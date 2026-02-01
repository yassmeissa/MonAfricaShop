const axios = require('axios');
const Order = require('../models/Order');

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// Récupérer le token d'accès PayPal
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erreur PayPal token:', error.response?.data || error.message);
    throw new Error('Impossible d\'obtenir le token PayPal');
  }
};

const createPayPalOrder = async (req, res) => {
  try {
    const { total, customer, items } = req.body;

    if (!total || total <= 0 || !customer || !items) {
      return res.status(400).json({ message: 'Données incomplètes' });
    }

    const accessToken = await getPayPalAccessToken();

    // Créer une commande PayPal
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: total.toString()
          },
          description: `Commande ${items.length} article(s)`,
          custom_id: customer.email
        }
      ],
      payer: {
        name: {
          given_name: customer.firstName,
          surname: customer.lastName
        },
        email_address: customer.email
      },
      application_context: {
        return_url: `http://localhost:5173/payment-success`,
        cancel_url: `http://localhost:5173/payment-cancel`
      }
    };

    const response = await axios.post(`${PAYPAL_API_BASE}/v2/checkout/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Sauvegarder les infos pour plus tard
    res.json({
      id: response.data.id,
      approvalUrl: response.data.links.find(link => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('Erreur création commande PayPal:', error.response?.data || error.message);
    res.status(500).json({ message: 'Erreur lors de la création de la commande PayPal' });
  }
};

const capturePayPalPayment = async (req, res) => {
  try {
    const { orderId, customer, items, total } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'ID commande manquant' });
    }

    const accessToken = await getPayPalAccessToken();

    // Capturer le paiement
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'COMPLETED') {
      // Créer la commande en base de données
      const order = await Order.create({
        customer,
        items,
        paymentMethod: 'paypal',
        total,
        status: 'paid',
        paypalOrderId: orderId
      });

      return res.status(201).json(order);
    } else {
      return res.status(400).json({ message: 'Paiement non complété' });
    }
  } catch (error) {
    console.error('Erreur capture PayPal:', error.response?.data || error.message);
    res.status(500).json({ message: 'Erreur lors de la capture du paiement PayPal' });
  }
};

module.exports = { createPayPalOrder, capturePayPalPayment };
