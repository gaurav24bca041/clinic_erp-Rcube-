const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: String, ref: 'Patients', required: true },
  doctor: { type: String, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: String,
  reason: String,
  status: { type: String, default: 'scheduled' } // e.g. scheduled, completed, cancelled
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

