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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Aaj ka end (11:59:59 PM)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Aaj ke appointments count
    const todayAppointmentsCount = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ Aaj ke appointments list
    const todayAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: 1 });

    res.render('index', {
      appointmentCount: todayAppointmentsCount,
      todayAppointments: todayAppointments
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding appointment");
  }
};
