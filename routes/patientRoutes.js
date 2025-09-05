const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware'); // login check

// List Patients
router.get('/patients', authMiddleware, patientController.getPatients);

// Add Patient
router.get('/patients/add-patient', authMiddleware, patientController.getAddPatient);
router.post('/patients/add-patient', authMiddleware, patientController.postAddPatient);

// Edit Patient
router.get('/patients/edit/:id', authMiddleware, patientController.getEditPatient);
router.post('/patients/edit/:id', authMiddleware, patientController.postEditPatient);

// Delete Patient
router.post('/patients/delete/:id', authMiddleware, patientController.postDeletePatient);

module.exports = router;
