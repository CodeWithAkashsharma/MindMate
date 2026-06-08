const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthMiddleware');
const { sendEmailOtp, verifyEmailOtp } = require('../controllers/otpController');

// Securely mount localized OTP routes behind authentication middleware
router.post('/send-email-otp', protect, sendEmailOtp);
router.put('/verify-email-otp', protect, verifyEmailOtp);

module.exports = router;