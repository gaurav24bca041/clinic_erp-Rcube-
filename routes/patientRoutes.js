const express = require('express');
const router = express.Router();
// const multer = require('multer');
const path = require('path');
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware'); // login check

// ------------------ Multer Config ------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/patient_files'); // ✅ folder create करना होगा
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// ------------------ Routes ------------------

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

// Upload Files
// router.post(
//   '/patients/upload/:id',
//   authMiddleware,
//   upload.array('files', 10),  // ✅ multiple files (max 10)
//   patientController.postUploadFiles
// );

module.exports = router;
