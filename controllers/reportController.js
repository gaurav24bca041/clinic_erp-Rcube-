const Patient = require('../models/patients');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Invoice = require('../models/invoices');

exports.getReports = async (req, res) => {
  try {
    const patientsCount = await Patient.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const doctorsActive = await Doctor.countDocuments({ isActive: true });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const invoices = await Invoice.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $regex: /^paid$/i }
    });

    const monthlyRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    res.render('reports', {
      patientsCount,
      appointmentsCount,
      doctorsActive,
      monthlyRevenue
    });
  } catch (error) {
    console.error('❌ Error loading /reports:', error);
    res.send('Error loading reports');
  }
};
