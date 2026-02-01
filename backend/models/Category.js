const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: '🛍️'
  },
  image: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#059669'
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
