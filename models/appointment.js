const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true }, // ✅ Custom Appointment ID
  patient: { type: String, ref: 'Patients', required: true },
  doctor: { type: String, ref: 'Doctor', required: true },
  dob: { type: Date, required: true }, // ✅ Patient Date of Birth
  date: { type: Date, required: true }, // Appointment Date
  time: { type: String, required: true }, // Store time as string "HH:MM"
  reason: String,
  status: { type: String, default: 'scheduled' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-generate Appointment ID before saving
appointmentSchema.pre('save', async function (next) {
  if (!this.appointmentId) {
    const count = await mongoose.models.Appointment.countDocuments();
    this.appointmentId = `APT-${(count + 1).toString().padStart(4, '0')}`; 
    // Example: APT-0001, APT-0002 ...
  }
  next();
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
