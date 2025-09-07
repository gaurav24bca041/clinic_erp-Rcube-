const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middleware/authMiddleware');

// List all invoices
router.get('/', authMiddleware, billingController.getBilling);

// Mark invoice as paid
router.post('/pay/:id', authMiddleware, billingController.payInvoice);

// Generate invoice
router.get('/generate-invoice', authMiddleware, billingController.getGenerateInvoice);
router.post('/generate-invoice', authMiddleware, billingController.postGenerateInvoice);

// Edit invoice
router.get('/edit/:id', authMiddleware, billingController.getEditInvoice);
router.post('/edit/:id', authMiddleware, billingController.postEditInvoice);

// Delete invoice
router.post('/delete/:id', authMiddleware, billingController.deleteInvoice);

module.exports = router;
