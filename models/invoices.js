const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  patientName: String,
  services: String,
  amount: Number,
  status: String,
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

