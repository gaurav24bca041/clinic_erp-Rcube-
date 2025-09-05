const Patient = require('../models/patients');

// --- List All Patients ---
exports.getPatients = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const patients = await Patient.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.render('patients', { username: req.session.user, patients });
  } catch (err) {
    console.error('Error loading patients:', err);
    res.status(500).send('Server error while loading patients.');
  }
};

// --- Add Patient Form ---
exports.getAddPatient = (req, res) => {
  res.render('add-patient');
};

// --- Save New Patient ---
exports.postAddPatient = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const { name, contact, gender, dob, history, address, phone, status, doctor } = req.body;

  console.log("Form Data:", req.body); // Debug

  try {
    await Patient.create({
      name: name || "Unknown",
      contact: contact || "N/A",
      gender: ['Male','Female','Other','N/A'].includes(gender) ? gender : "N/A",
      dob: dob ? new Date(dob) : new Date(),
      history: history || "",
      address: address || "N/A",
      phone: phone || "N/A",
      status: status || "Active",
      doctor: doctor || "N/A",
      userId: req.session.userId
    });

    res.redirect('/patients');
  } catch (err) {
    console.error("Error saving patient:", err);
    res.status(500).send('Failed to save patient.');
  }
};

// --- Edit Patient Form ---
exports.getEditPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send("Patient not found");
    res.render('edit-patient', { patient });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Error loading patient edit form.");
  }
};

// --- Update Patient ---
exports.postEditPatient = async (req, res) => {
  try {
    const { name, contact, gender, dob, history, address, phone, status, doctor } = req.body;

    await Patient.findByIdAndUpdate(req.params.id, {
      name: name || "Unknown",
      contact: contact || "N/A",
      gender: ['Male','Female','Other','N/A'].includes(gender) ? gender : "N/A",
      dob: dob ? new Date(dob) : new Date(),
      history: history || "",
      address: address || "N/A",
      phone: phone || "N/A",
      status: status || "Active",
      doctor: doctor || "N/A"
    });

    res.redirect('/patients');
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).send("Failed to update patient.");
  }
};

// --- Delete Patient ---
exports.postDeletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.redirect('/patients');
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).send("Failed to delete patient.");
  }
};
