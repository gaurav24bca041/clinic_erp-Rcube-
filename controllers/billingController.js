const Invoice = require('../models/invoices');

exports.getBilling = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.render('billing', { invoices });
  } catch (err) {
    res.send('Error loading billing: ' + err);
  }
};

exports.payInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
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
  try {
    const { patientName, services, amount, status, date } = req.body;
    const newInvoice = new Invoice({
      patientName,
      services,
      amount,
      status,
      date: new Date(date)
    });
    await newInvoice.save();
    res.redirect('/billing');
  } catch (err) {
    res.send('Error saving invoice: ' + err);
  }
};
