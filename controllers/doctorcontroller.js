const Doctor = require('../models/doctor');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.render('doctor', { doctors });
  } catch (err) {
    console.error("Error loading doctor:", err.message);
    res.send('Error loading doctors');
  }
};

exports.postAddDoctor = async (req, res) => {
  try {
    const { name, specialization, isActive } = req.body;
    const doctor = new Doctor({
      name,
      specialization,
      isActive: isActive === 'on'
    });
    await doctor.save();
    res.redirect('/doctor');
  } catch (err) {
    res.send('Error adding doctor');
  }
};
