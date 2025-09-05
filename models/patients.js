const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true }, // ✅ Custom Patient ID
  name: { type: String, required: true },
  contact: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  history: String,

  // ✅ Extra fields from Appointment
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'active' }, // active, inactive, etc.
  
  // For tracking doctor/patient relation
  doctor: { type: String, ref: 'Doctor' },

  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-generate Patient ID before saving
patientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    const count = await mongoose.models.Patient.countDocuments();
    this.patientId = `PAT-${(count + 1).toString().padStart(4, '0')}`; 
    // Example: PAT-0001, PAT-0002 ...
  }
  next();
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
