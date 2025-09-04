const Invoice = require('../models/invoices');

exports.getBilling = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const invoices = await Invoice.find({ userId: req.session.userId }).sort({ date: -1 });
    res.render('billing', { invoices });
  } catch (err) {
    console.error("Error loading billing:", err);
    res.send('Error loading billing: ' + err);
  }
};

exports.payInvoice = async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

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

exports.getGenerateInvoice = (req, res) => {
  res.render('generate-invoice');
};

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
      userId: req.session.userId   // 👈 zaroori
    });
    await newInvoice.save();
    res.redirect('/billing');
  } catch (err) {
    console.error("Error saving invoice:", err);
    res.send('Error saving invoice: ' + err);
  }
};
