const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// --- Appointments List ---
router.get('/', appointmentController.getAppointments);

// --- Add Appointment ---
router.get('/add-appointment', appointmentController.getAddAppointment);
router.post('/add-appointment', appointmentController.postAddAppointment);

// --- Edit Appointment ---
router.get('/edit/:id', appointmentController.getEditAppointment);
router.post('/edit/:id', appointmentController.postEditAppointment);

// --- Reschedule Appointment ---
router.get('/reschedule/:id', appointmentController.getRescheduleAppointment);
router.post('/reschedule/:id', appointmentController.postRescheduleAppointment);

// --- Delete Appointment ---
router.post('/delete/:id', appointmentController.postDeleteAppointment);

// --- Add Appointment → Patients ---
router.post('/add-to-patient/:id', appointmentController.addToPatient);

// --- Re-Appointment ---
router.get("/re-appointment/:id", appointmentController.getReAppointment);

// --- Update Status (Dropdown) ---
router.post("/update-status/:id", appointmentController.updateStatus);

module.exports = router;
