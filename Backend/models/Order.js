const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  price: Number,
  quantity: Number,
  spiceLevel: String,
  subtotal: Number,
});

const orderSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','preparing','ready','served','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
