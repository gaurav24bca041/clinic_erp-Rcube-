

// routes/settingsRoutes.js
const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const authMiddleware = require('../middleware/authMiddleware');
// GET settings page
router.get("/", settingsController.getSettings);

// POST update settings
router.post("/update", settingsController.updateSettings);

module.exports = router;


