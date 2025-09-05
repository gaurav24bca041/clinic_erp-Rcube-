const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Show all appointments
router.get('/', appointmentController.getAppointments);

// Add appointment
router.get('/add-appointment', appointmentController.getAddAppointment);
router.post('/add-appointment', appointmentController.postAddAppointment);

// Edit appointment
router.get('/edit/:id', appointmentController.getEditAppointment);
router.post('/edit/:id', appointmentController.postEditAppointment);

// Delete appointment
router.post('/delete/:id', appointmentController.postDeleteAppointment);

module.exports = router;
