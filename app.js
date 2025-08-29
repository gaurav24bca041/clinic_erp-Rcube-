const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/stylesheet', express.static(path.join(__dirname, 'stylesheet')));
app.set("view engine", 'ejs');

app.use(expressSession({
  secret: 'clinicSecret123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

mongoose.connect("mongodb+srv://gk505305shah:sb2soklUvc7To9Sy@clinicerpdb.lhg2z2d.mongodb.net/?retryWrites=true&w=majority&appName=clinicerpdb")
  

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/dashboardRoutes'));
// app.use('/patients', require('./routes/patientRoutes'));
app.use('/', require('./routes/appointmentRoutes'));
app.use('/billing', require('./routes/billingRoutes'));
app.use('/reports', require('./routes/reportRoutes'));
app.use('/doctor', require('./routes/doctorRoutes'));
app.use('/settings', require('./routes/settingsRoutes'));

const patientRoutes = require('./routes/patientRoutes');
app.use('/', patientRoutes);

const forgetPasswordRoutes = require("./routes/forgetPasswordRoutes");
app.use("/", forgetPasswordRoutes);

 
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
