const express = require("express");
const router = express.Router();
const forgetPasswordController = require("../controllers/forgetPasswordController");

router.get("/forgetPassword", forgetPasswordController.getForgetPassword);
router.post("/forgetPassword", forgetPasswordController.postForgetPassword);

module.exports = router;
