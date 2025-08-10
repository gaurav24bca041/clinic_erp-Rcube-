const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, patientController.getPatients);
router.get('/add-patient', authMiddleware, patientController.getAddPatient);
router.post('/add-patients', authMiddleware, patientController.postAddPatient);

module.exports = router;
