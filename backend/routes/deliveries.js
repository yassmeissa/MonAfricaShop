const express = require('express');
const router = express.Router();
const { createDelivery, getDeliveries } = require('../controllers/deliveryController');
const { auth, admin } = require('../middlewares/auth');

router.post('/', auth, admin, createDelivery);
router.get('/', auth, admin, getDeliveries);

module.exports = router;
