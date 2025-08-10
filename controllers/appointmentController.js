const Appointment = require('../models/appointment');

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ time: 1 });
    res.render('appointments', { appointments });
  } catch (err) {
    console.error(err);
    res.send('Error loading appointments.');
  }
};

exports.getAddAppointment = (req, res) => {
  res.render('add-appointment');
};

exports.postAddAppointment = async (req, res) => {
  const { patient, doctor, time, status } = req.body;
  try {
    await Appointment.create({ patient, doctor, time, status });
    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.send('Error saving appointment.');
  }
};

