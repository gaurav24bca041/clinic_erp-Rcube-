const Appointment = require('../models/appointment');

exports.getAppointments = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const appointments = await Appointment.find({ userId: req.session.userId }).sort({ time: 1 });
    res.render('appointments', { appointments });
  } catch (err) {
    console.error("Error loading appointments:", err);
    res.send('Error loading appointments.');
  }
};

exports.getAddAppointment = (req, res) => {
  res.render('add-appointment');
};

exports.postAddAppointment = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');

  try {
    const appointmentDateTime = new Date(`${req.body.date}T${req.body.time}`);

    await Appointment.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: appointmentDateTime,
      time: req.body.time,
      status: req.body.status,
      reason: req.body.reason,
      userId: req.session.userId
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).send("Error adding appointment");
  }
};
