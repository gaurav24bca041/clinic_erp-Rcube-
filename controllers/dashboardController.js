const Invoice = require("../models/invoices");
const Appointment = require("../models/appointment");
const Patient = require("../models/patients");
const Doctor = require("../models/doctor");

exports.getDashboard = async (req, res) => {
  try {
    // --- Aaj ki date ---
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // --- Current Month start & end ---
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // ✅ Monthly Revenue
    const invoices = await Invoice.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $regex: /^paid$/i }
    });

    const monthlyRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    // ✅ Today’s Appointments
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ New Patients today
    const newPatients = await Patient.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // ✅ Active Doctors
    const doctorsActive = await Doctor.countDocuments({ isActive: true });

    // ✅ Render dashboard
    res.render("index", {
      username: req.session.username || "User",
      monthlyRevenue,
      todayAppointments,
      newPatients,
      doctorsActive,
      revenueData: JSON.stringify([]) // later chart ke liye
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.render("index", {
      username: req.session.username || "User",
      monthlyRevenue: 0,
      todayAppointments: 0,
      newPatients: 0,
      doctorsActive: 0,
      revenueData: JSON.stringify([])
    });
  }
};
