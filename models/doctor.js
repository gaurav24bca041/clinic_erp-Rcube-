const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  contact: String,
  email: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);


