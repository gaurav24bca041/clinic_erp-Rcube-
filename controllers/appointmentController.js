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
  try {
    // Combine date + time into one Date object
    const appointmentDateTime = new Date(`${req.body.date}T${req.body.time}`);

    await Appointment.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: appointmentDateTime, // Proper Date object
      time: req.body.time, // Keep time string if you want
      status: req.body.status,
      reason: req.body.reason
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding appointment");
  }
};
