const Doctor = require('../models/doctor');

// Show all doctors (user-specific)
exports.getDoctors = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const doctors = await Doctor.find({ userId: req.session.userId });
    res.render('doctor', { doctors });
  } catch (err) {
    console.error("Error loading doctor:", err.message);
    res.send('Error loading doctors');
  }
};

// Add new doctor (assign userId)
exports.postAddDoctor = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const { name, specialization, contact, email, fee, isActive } = req.body;

    const doctor = new Doctor({
      name,
      specialization,
      contact,
      email,
      fee,
      isActive: isActive === 'on',
      userId: req.session.userId // 👈 important
    });

    await doctor.save();
    res.redirect('/doctor');
  } catch (err) {
    console.error("Error adding doctor:", err.message);
    res.send('Error adding doctor');
  }
};
