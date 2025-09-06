const Appointment = require('../models/appointment');
const Patient = require('../models/patients');
const Doctor = require('../models/doctor');   // ✅ Doctor model import

// --- List all appointments ---
exports.getAppointments = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const appointments = await Appointment.find({ userId: req.session.userId })
      .sort({ date: 1, time: 1 });

    res.render('appointments', { appointments });
  } catch (err) {
    console.error("Error loading appointments:", err.message, err);
    res.status(500).send('Error loading appointments.');
  }
};

// --- Add Appointment Form ---
exports.getAddAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    // ✅ Sirf active doctors fetch
    const doctors = await Doctor.find({
      userId: req.session.userId,
      status: "active"
    }).sort({ name: 1 });

    res.render('add-appointment', { doctors });
  } catch (err) {
    console.error("Error loading add appointment form:", err.message, err);
    res.status(500).send("Error loading form");
  }
};

// --- Add Appointment ---
exports.postAddAppointment = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const { patient, doctor, dob, date, time, address, phone, gender, reason, status } = req.body;

    if (!patient || !doctor || !dob || !date || !time || !address || !phone) {
      return res.status(400).send("Please fill all required fields");
    }

    const appointmentDateTime = new Date(`${date}T${time}`);
    const dobDate = new Date(dob);

    await Appointment.create({
      patient,
      gender: gender || "N/A",
      doctor,   // doctor ka naam ya id save hoga (aapke hisaab se)
      dob: dobDate,
      date: appointmentDateTime,
      time,
      status: status || 'scheduled',
      reason,
      address,
      phone,
      userId: req.session.userId
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error adding appointment:", err.message, err);
    res.status(500).send("Error adding appointment");
  }
};

// --- Edit Appointment Form ---
exports.getEditAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    // ✅ Doctors list laa rahe hain
    const doctors = await Doctor.find({
      userId: req.session.userId,
      status: "active"
    }).sort({ name: 1 });

    res.render('edit-appointment', { appointment, doctors });
  } catch (err) {
    console.error("Error loading appointment:", err.message, err);
    res.status(500).send("Error loading appointment");
  }
};

// --- Update Appointment ---
exports.postEditAppointment = async (req, res) => {
  try {
    const { patient, doctor, dob, date, time, address, phone, gender, reason, status } = req.body;

    if (!patient || !doctor || !dob || !date || !time || !address || !phone) {
      return res.status(400).send("Please fill all required fields");
    }

    const appointmentDateTime = new Date(`${date}T${time}`);
    const dobDate = new Date(dob);

    await Appointment.findByIdAndUpdate(req.params.id, {
      patient,
      gender: gender || "N/A",
      doctor,
      dob: dobDate,
      date: appointmentDateTime,
      time,
      status,
      reason,
      address,
      phone
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error updating appointment:", err.message, err);
    res.status(500).send("Error updating appointment");
  }
};

// --- ✅ Reschedule Appointment Form ---
exports.getRescheduleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    res.render('reschedule', { appointment });
  } catch (err) {
    console.error("Error loading reschedule form:", err.message, err);
    res.status(500).send("Error loading reschedule form");
  }
};

// --- ✅ Reschedule Appointment Save ---
exports.postRescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).send("Please select both date and time");
    }

    const appointmentDateTime = new Date(`${date}T${time}`);

    await Appointment.findByIdAndUpdate(req.params.id, {
      date: appointmentDateTime,
      time,
      status: "rescheduled"  // optional
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("Error rescheduling appointment:", err.message, err);
    res.status(500).send("Error rescheduling appointment");
  }
};

// --- Delete Appointment ---
exports.postDeleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect('/appointments');
  } catch (err) {
    console.error("Error deleting appointment:", err.message, err);
    res.status(500).send("Error deleting appointment");
  }
};

// --- Add Appointment to Patients ---
exports.addToPatient = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).send("Appointment not found");

    const existingPatient = await Patient.findOne({
      name: appointment.patient,
      contact: appointment.phone,
      userId: req.session.userId
    });

    if (existingPatient) {
      console.log("⚠️ Patient already exists:", existingPatient._id);
      return res.redirect('/patients');
    }

    await Patient.create({
      name: appointment.patient,
      gender: appointment.gender || "N/A",
      dob: appointment.dob,
      contact: appointment.phone,
      phone: appointment.phone,
      address: appointment.address,
      history: appointment.reason,
      doctor: appointment.doctor,
      status: appointment.status,
      userId: req.session.userId || appointment.userId
    });

    res.redirect('/patients');
  } catch (err) {
    console.error("❌ Error adding appointment to patients:", err.message, err);
    res.status(500).send("Failed to add appointment to patients");
  }
};
