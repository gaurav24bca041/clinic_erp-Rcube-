const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  fee: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);


