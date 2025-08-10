const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorcontroller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, doctorController.getDoctors);
router.post('/', authMiddleware, doctorController.postAddDoctor);

module.exports = router;
