const Patient = require('../models/patients');

// --- List All Patients ---
exports.getPatients = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

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

  try {
    await Patient.create({
      name,
      contact,
      gender,
      dob,
      history,
      address,
      phone,
      status: status || "Active",  // default
      doctor,
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
      name, contact, gender, dob, history, address, phone, status, doctor
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
