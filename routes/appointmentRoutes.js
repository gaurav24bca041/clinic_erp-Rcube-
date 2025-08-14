const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// List all appointments
router.get('/appointments', authMiddleware, appointmentController.getAppointments);

// Show add appointment form
router.get('/add-appointment', authMiddleware, appointmentController.getAddAppointment);

// Handle appointment submission
router.post('/add-appointment', authMiddleware, appointmentController.postAddAppointment);

module.exports = router;
