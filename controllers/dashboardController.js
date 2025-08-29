const Patient = require('../models/patients');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Invoice = require('../models/invoices');

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newPatients = await Patient.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    
    const appointmentsToday = await Appointment.countDocuments({ date: { $gte: today } });
    const doctorsActive = await Doctor.countDocuments({ isActive: true });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    // ✅ Daily revenue aggregation
    const dailyRevenue = await Invoice.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $regex: /^paid$/i }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    // Convert into array of objects {date, revenue}
    const revenueData = dailyRevenue.map(r => ({
      date: `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,"0")}-${r._id.toString().padStart(2,"0")}`,
      revenue: r.total
    }));

    const invoices = await Invoice.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $regex: /^paid$/i }
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    res.render('index', {
      appointmentsToday,
      newPatients,
      doctorsActive,
      totalRevenue,
      revenueData: JSON.stringify(revenueData),
      username: req.session.user
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.render('index', {
      appointmentsToday: 0,
      newPatients: 0,
      doctorsActive: 0,
      totalRevenue: 0,
      revenueData: JSON.stringify([]),
      username: req.session.user
    });
  }
};
