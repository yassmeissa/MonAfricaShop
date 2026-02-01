const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, total } = req.body;
    
    if (!customer || !items || !paymentMethod || !total) {
      return res.status(400).json({ message: 'Données incomplètes' });
    }

    const order = await Order.create({
      customer,
      items,
      paymentMethod,
      total,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Erreur création commande:', err);
    res.status(400).json({ message: 'Erreur lors de la création de la commande' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    console.log('getMyOrders - req.user:', req.user?._id);
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    console.log('getMyOrders - found', orders.length, 'orders for user', req.user._id);
    
    // Transformer les items pour inclure productName et price
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product._id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }))
    }));
    
    res.json(transformedOrders);
  } catch (err) {
    console.error('getMyOrders - error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Transformer les items pour inclure productName et price
    const transformedOrder = {
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.product._id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }))
    };
    
    res.json(transformedOrder);
  } catch (err) {
    console.error('Error in getOrderById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById };
