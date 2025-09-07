// controllers/billingController.js
const Invoice = require('../models/invoices');
const Setting = require('../models/setting');

// --- Billing Dashboard ---
exports.getBilling = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    // ✅ Fetch invoices
    const invoices = await Invoice.find({ userId: req.session.userId }).sort({ date: -1 });

    // ✅ Fetch clinic settings
    const setting = await Setting.findOne({ userId: req.session.userId });

    res.render('billing', { 
      invoices,
      clinicName: setting?.clinicName || "My Clinic",
      clinicAddress: setting?.address || "",
      clinicPhone: setting?.phone || "",
      clinicEmail: setting?.email || ""
    });
  } catch (err) {
    console.error("Error loading billing:", err);
    res.send('Error loading billing: ' + err);
  }
};

// --- Mark Invoice as Paid ---
exports.payInvoice = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/');

    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!invoice) return res.status(404).send('Invoice not found');

    invoice.status = 'Paid';
    invoice.paidDate = new Date();
    await invoice.save();

    res.redirect('/billing');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// --- Generate Invoice Form ---
exports.getGenerateInvoice = (req, res) => {
  res.render('generate-invoice');
};

// --- Save New Invoice ---
exports.postGenerateInvoice = async (req, res) => {
  if (!req.session.userId) return res.redirect('/');

  try {
    const { patientName, services, amount, status, date } = req.body;

    const newInvoice = new Invoice({
      patientName,
      services,
      amount,
      status,
      date: new Date(date),
      userId: req.session.userId
    });

    await newInvoice.save();
    res.redirect('/billing');
  } catch (err) {
    console.error("Error saving invoice:", err);
    res.send('Error saving invoice: ' + err);
  }
};
