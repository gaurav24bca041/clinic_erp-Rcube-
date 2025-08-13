const express = require('express');
const router = express.Router();
const Billing = require('../models/invoices');
const Appointment = require('../models/appointment');
const Patient = require('../models/patients');
const Doctor = require('../models/doctor');
const invoices = require('../models/invoices');

router.get('/index', async (req, res) => {
  try {
    const totalRevenue = await invoices.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const todayAppointments = await Appointment.countDocuments({
      date: new Date().toISOString().split("T")[0]
    });

    const newPatients = await Patient.countDocuments({
      date: new Date().toISOString().split("T")[0]
    });

    const activeDoctors = await Doctor.countDocuments({ active: true });

    res.render('index', {
      username: req.session.username || 'User',
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      todayAppointments,
      newPatients,
      activeDoctors
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
});

module.exports = router;
