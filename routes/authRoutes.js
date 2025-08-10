const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth pages
router.get('/', authController.getLogin);
router.get('/register', authController.getRegister);

// Auth actions
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
