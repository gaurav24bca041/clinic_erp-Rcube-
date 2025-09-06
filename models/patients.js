const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  gender: { type: String, enum: ['Male','Female','Other','N/A'], default: 'N/A' },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Active' },
  doctor: { type: String, ref: 'Doctor', default: "N/A" },
  uploads: [String], // ✅ multiple file paths
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-generate Patient ID before saving
patientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    const count = await mongoose.models.Patient.countDocuments();
    this.patientId = `PAT-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
