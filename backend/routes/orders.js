const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById } = require('../controllers/orderController');
const { auth, admin } = require('../middlewares/auth');

// Routes publiques
router.post('/', createOrder);

// Routes protégées - IMPORTANT: /my DOIT être avant /:id
router.get('/my', auth, getMyOrders);
router.get('/:id', getOrderById);
router.get('/', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
