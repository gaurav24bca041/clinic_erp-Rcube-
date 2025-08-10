const Patient = require('../models/patients');

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.render('patients', { username: req.session.user, patients });
  } catch (err) {
    console.error('Error loading patients:', err);
    res.status(500).send('Server error while loading patients.');
  }
};

exports.getAddPatient = (req, res) => {
  res.render('add-patient');
};

exports.postAddPatient = async (req, res) => {
  const { name, contact, gender, dob, history } = req.body;
  try {
    await Patient.create({ name, contact, gender, dob, history });
    res.redirect('/patients');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save patient.');
  }
};
