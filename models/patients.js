const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  contact: String,
  gender: String,
  dob: Date,
  history: String,
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }


}, { timestamps: true });

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
