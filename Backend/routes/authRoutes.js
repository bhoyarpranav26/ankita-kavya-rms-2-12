const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Use controller functions for signup, verify and login
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);

// Protected profile route
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
