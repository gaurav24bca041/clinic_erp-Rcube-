const Appointment = require('../models/appointment');

// --- List all appointments ---
exports.getAppointments = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const appointments = await Appointment.find({ userId: req.session.userId }).sort({ time: 1 });
    res.render('appointments', { appointments });
  } catch (err) {
    console.error("Error loading appointments:", err);
    res.send('Error loading appointments.');
  }
};

// --- Add Appointment Form ---
exports.getAddAppointment = (req, res) => {
  res.render('add-appointment');
};

// --- Add Appointment ---
exports.postAddAppointment = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');

  try {
    const appointmentDateTime = new Date(`${req.body.date}T${req.body.time}`);

    await Appointment.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      dob: req.body.dob,   // ✅ DOB handle kiya
      date: appointmentDateTime,
      time: req.body.time,
      status: req.body.status || 'scheduled',
      reason: req.body.reason,
      address: req.body.address,
      phone: req.body.phone,
      userId: req.session.userId
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).send("Error adding appointment");
  }
};

// --- Edit Appointment Form ---
exports.getEditAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    res.render('edit-appointment', { appointment });
  } catch (err) {
    console.error("Error loading appointment:", err);
    res.status(500).send("Error loading appointment");
  }
};

// --- Update Appointment ---
exports.postEditAppointment = async (req, res) => {
  try {
    const appointmentDateTime = new Date(`${req.body.date}T${req.body.time}`);

    await Appointment.findByIdAndUpdate(req.params.id, {
      patient: req.body.patient,
      doctor: req.body.doctor,
      dob: req.body.dob,   // ✅ DOB update bhi hoga
      date: appointmentDateTime,
      time: req.body.time,
      status: req.body.status,
      reason: req.body.reason,
      address: req.body.address,
      phone: req.body.phone
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).send("Error updating appointment");
  }
};

// --- Delete Appointment ---
exports.postDeleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect('/appointments');
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).send("Error deleting appointment");
  }
};
