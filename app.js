const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/stylesheet', express.static(path.join(__dirname, 'stylesheet')));

app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 



app.use(expressSession({
  secret: 'clinicSecret123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));


mongoose.connect('mongodb://127.0.0.1:27017/clinicDB')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


// 🟢 GET login page
app.get('/', (req, res) => {
  res.render('login');
});

// 🟢 GET register page
app.get('/register', (req, res) => {
  res.render('register');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.send('No such user found.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.send('Incorrect password.');
    }

    req.session.user = user.username;
    res.redirect('/index');
  } catch (err) {
    console.log(err);
    res.send('Login error.');
  }
});


const User = require('./models/user');
const bcrypt = require('bcrypt');  // already imported

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    req.session.user = username;
    res.redirect('/index');
  } catch (err) {
    console.log(err);
    res.send('Registration failed. Username might already exist.');
  }
});

// 🟢 GET dashboard
app.get(['/index', '/'], async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patientsCount = await Patient.countDocuments();

    const appointmentsToday = await Appointment.countDocuments({
      date: { $gte: today }
    });

    const doctorsActive = await Doctor.countDocuments({ isActive: true });

    // Monthly revenue date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    endOfMonth.setHours(0, 0, 0, -1); // Last millisecond of month

    const invoices = await Invoice.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
      status: { $regex: /^paid$/i } // case-insensitive match
    });

    const totalRevenue = invoice.reduce((sum, inv) => sum + inv.amount, 0);

    res.render('index', {
      appointmentsToday,
      patientsCount,
      doctorsActive,
      totalRevenue
    });

  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.render('index', {
      appointmentsToday: 0,
      patientsCount: 0,
      doctorsActive: 0,
      totalRevenue: 0
    });
  }
});






// 🟢 Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
});

app.get('/patients', async (req, res) => {
  const username = req.session.user;
  try {
    const patients = await Patient.find().sort({ createdAt: -1 }); // latest first
    res.render('patients', { username, patients });
  } catch (err) {
    console.error('Error loading patients:', err);
    res.status(500).send('Server error while loading patients.');
  }
});

// adding patients
app.get('/add-patient', (req, res) => {
  res.render('add-patient'); // will load the EJS file
});


const Patient = require('./models/patients');

app.post('/add-patients', async (req, res) => {
  const { name, contact, gender, dob, history } = req.body;

  try {
    await Patient.create({ name, contact, gender, dob, history });
    res.redirect('/patients');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save patient.');
  }
});

//appointment
const Appointment = require('./models/appointment'); 
const invoices = require('./models/invoice');

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ time: 1 });
    res.render('appointments', { appointments });
  } catch (err) {
    console.error(err);
    res.send('Error loading appointments.');
  }
});
app.get('/appointments', async (req, res) => {
  const appointments = await Appointment.find().sort({ time: 1 });
  res.render('appointments', { appointments });
});


app.get('/add-appointment', (req, res) => {
  res.render('add-appointment');
});

app.post('/add-appointment', async (req, res) => {
  const { patient, doctor, time, status } = req.body;

  try {
    await Appointment.create({ patient, doctor, time, status });
    res.redirect('/appointments');
  } catch (err) {
    console.error(err);
    res.send('Error saving appointment.');
  }
});

//billing
const Invoice = require('./models/invoice');


app.get('/billing', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 }); // newest first
    res.render('billing', { invoices });
  } catch (err) {
    res.send('Error loading billing: ' + err);
  }
});

 

app.post('/billing/pay/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    invoice.status = 'Paid';
    invoice.paidDate = new Date(); // 👈 Save the payment date
    await invoice.save();

    res.redirect('/billing');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});




// New Invoice Form
app.get('/generate-invoice', (req, res) => {
  res.render('generate-invoice');
});

app.post('/generate-invoice', async (req, res) => {
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
});

//reports


app.get('/reports', async (req, res) => {
  try {
    const patientsCount = await Patient.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    // const amountsCount = await amount.countDocuments();
    const doctorsActive = await Doctor.countDocuments({ isActive: true });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const invoices = await Invoice.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },status:'paid'
      
    });

    let monthlyRevenue = 0;
    invoices.forEach(inv => monthlyRevenue += inv.amount);

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
});



//doctor

const Doctor = require('./models/doctor');


app.get('/doctor', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.render('doctor', { doctors });
  } catch (err) {
    console.error("Error loading doctor:", err.message);
    res.send('Error loading doctors');
  }
});

app.post('/doctor', async (req, res) => {
  try {
    const { name, specialization, isActive } = req.body;
    const doctor = new Doctor({
      name,
      specialization,
      isActive: isActive === 'on' // checkbox returns 'on' when checked
    });
    await doctor.save();
    res.redirect('/doctor');
  } catch (err) {
    res.send('Error adding doctor');
  }
});

//settings

app.get('/settings', (req, res) => {
  res.render('settings'); // this renders views/settings.ejs
});


// const Setting = require('./models/Setting');

app.post('/settings', async (req, res) => {
  try {
    const { clinicName, address, contactEmail } = req.body;

    // Assuming single settings document
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    settings.clinicName = clinicName;
    settings.address = address;
    settings.contactEmail = contactEmail;

    await settings.save();

    res.redirect('/settings');
  } catch (error) {
    console.error('Error saving settings:', error);
    res.send('Error saving settings');
  }
});






















// 🟢 Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});