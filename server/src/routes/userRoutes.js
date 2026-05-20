// Add this to your user routes file
const express = require('express');
const router = express.Router();
const { getUserProfile,updateProfile } = require('../controllers/userController'); // Import the controller
const { protect } = require('../middleware/authMiddleware');

// The frontend is specifically asking for /profile
router.get('/profile', protect, getUserProfile);
router.put('/update-profile', protect, updateProfile);

module.exports = router;