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
    console.error("❌ Error loading appointments:", err);
    res.status(500).send('Error loading appointments.');
  }
};

// --- Add Appointment Form ---
exports.getAddAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    // ✅ Sirf active doctors fetch karenge
    const doctors = await Doctor.find({
      userId: req.session.userId,
      isActive: true 
    }).sort({ name: 1 });

    res.render('add-appointment', { doctors });
  } catch (err) {
    console.error("❌ Error loading add appointment form:", err);
    res.status(500).send("Error loading form");
  }
};

// --- Add Appointment Save ---
exports.postAddAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const { patient, doctor, dob, date, time, address, phone, gender, reason, status } = req.body;

    if (!patient || !doctor || !dob || !date || !time || !address || !phone) {
      return res.status(400).send("⚠️ Please fill all required fields");
    }

    const appointmentDateTime = new Date(`${date}T${time}`);
    const dobDate = new Date(dob);

    await Appointment.create({
      patient,
      gender: gender || "N/A",
      doctor,   // doctor ka naam ya ID (EJS me set karna hoga)
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
    console.error("❌ Error adding appointment:", err);
    res.status(500).send("Error adding appointment");
  }
};

// --- Edit Appointment Form ---
exports.getEditAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    const doctors = await Doctor.find({
      userId: req.session.userId,
      status: "active"
    }).sort({ name: 1 });

    res.render('edit-appointment', { appointment, doctors });
  } catch (err) {
    console.error("❌ Error loading appointment:", err);
    res.status(500).send("Error loading appointment");
  }
};

// --- Update Appointment ---
exports.postEditAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const { patient, doctor, dob, date, time, address, phone, gender, reason, status } = req.body;

    if (!patient || !doctor || !dob || !date || !time || !address || !phone) {
      return res.status(400).send("⚠️ Please fill all required fields");
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
    console.error("❌ Error updating appointment:", err);
    res.status(500).send("Error updating appointment");
  }
};

// --- Reschedule Appointment Form ---
exports.getRescheduleAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    res.render('reschedule', { appointment });
  } catch (err) {
    console.error("❌ Error loading reschedule form:", err);
    res.status(500).send("Error loading reschedule form");
  }
};

// --- Save Reschedule ---
exports.postRescheduleAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).send("⚠️ Please select both date and time");
    }

    const appointmentDateTime = new Date(`${date}T${time}`);

    await Appointment.findByIdAndUpdate(req.params.id, {
      date: appointmentDateTime,
      time,
      status: "rescheduled"  // optional
    });

    res.redirect('/appointments');
  } catch (err) {
    console.error("❌ Error rescheduling appointment:", err);
    res.status(500).send("Error rescheduling appointment");
  }
};

// --- Delete Appointment ---
exports.postDeleteAppointment = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect('/appointments');
  } catch (err) {
    console.error("❌ Error deleting appointment:", err);
    res.status(500).send("Error deleting appointment");
  }
};

// --- Add Appointment → Patients ---
exports.addToPatient = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).send("Appointment not found");

    // Check if already exists
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
      userId: req.session.userId
    });

    res.redirect('/patients');
  } catch (err) {
    console.error("❌ Error adding appointment to patients:", err);
    res.status(500).send("Failed to add appointment to patients");
  }
};
