const Doctor = require('../models/doctor');

// Show all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.render('doctor', { doctors });
  } catch (err) {
    console.error("Error loading doctor:", err.message);
    res.send('Error loading doctors');
  }
};

// Add new doctor
exports.postAddDoctor = async (req, res) => {
  try {
    const { name, specialization, contact, email, fee, isActive } = req.body;

    const doctor = new Doctor({
      name,
      specialization,
      contact,
      email,
      fee,
      isActive: isActive === 'on'
    });

    await doctor.save();
    res.redirect('/doctor');
  } catch (err) {
    console.error("Error adding doctor:", err.message);
    res.send('Error adding doctor');
  }
};
