const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: String,
  reason: String,
  status: { type: String, default: 'scheduled' } // e.g. scheduled, completed, cancelled
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

