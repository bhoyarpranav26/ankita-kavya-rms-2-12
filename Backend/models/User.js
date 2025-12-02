const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['customer','admin','superadmin'], default: 'customer' },
});

module.exports = mongoose.model("User", userSchema);
