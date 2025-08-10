const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  patientName: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid'
  },
  paidDate: Date // 👈 Add this field
});

module.exports = mongoose.model('Invoice', invoiceSchema);
