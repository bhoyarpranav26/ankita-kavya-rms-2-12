const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
