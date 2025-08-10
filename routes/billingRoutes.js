const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, billingController.getBilling);
router.post('/pay/:id', authMiddleware, billingController.payInvoice);
router.get('/generate-invoice', authMiddleware, billingController.getGenerateInvoice);
router.post('/generate-invoice', authMiddleware, billingController.postGenerateInvoice);

module.exports = router;
