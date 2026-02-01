const Delivery = require('../models/Delivery');

const createDelivery = async (req, res) => {
  try {
    const { order, deliveryMode, deliveryFee, deliveryStatus, deliveryDate } = req.body;
    const delivery = await Delivery.create({ order, deliveryMode, deliveryFee, deliveryStatus, deliveryDate });
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('order');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createDelivery, getDeliveries };
