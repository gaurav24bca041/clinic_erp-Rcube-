const express = require('express');
const router = express.Router();
const invoices = require('../models/invoices');
const Appointment = require('../models/appointment');
const Patient = require('../models/patients');
const Doctor = require('../models/doctor');

router.get('/index', async (req, res) => {
  try {
    // --- Aaj ki date ka 12:00 AM ---
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // --- Aaj ki date ka 11:59:59 PM ---
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ✅ Total Revenue
    const totalRevenue = await invoices.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // ✅ Aaj ke appointments count
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ Aaj ke new patients count
    const newPatients = await Patient.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ Active doctors count
    const doctorsActive = await Doctor.countDocuments({ isActive: true });


    // ✅ Render dashboard
    res.render('index', {
      username: req.session.username || 'User',
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      todayAppointments,
      newPatients,
      doctorsActive,
      revenueData: JSON.stringify([]) // Placeholder for revenue data
    });

  } catch (err) {
    console.error(err);
    res.send("Error loading dashboard");
  }
});

module.exports = router;

