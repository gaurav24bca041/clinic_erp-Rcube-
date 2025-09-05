const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  patient: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'N/A'], default: 'N/A' },

  doctor: { type: String, required: true },
  dob: { type: Date, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  status: { type: String, default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-generate Appointment ID
appointmentSchema.pre('save', async function (next) {
  if (!this.appointmentId) {
    try {
      const count = await mongoose.models.Appointment.countDocuments();
      this.appointmentId = `APT-${(count + 1).toString().padStart(4, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
