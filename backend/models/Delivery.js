const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  deliveryMode: { type: String, enum: ['home', 'pickup'], required: true },
  deliveryFee: { type: Number, required: true },
  deliveryStatus: { type: String, required: true },
  deliveryDate: { type: Date }
});

module.exports = mongoose.model('Delivery', deliverySchema);
