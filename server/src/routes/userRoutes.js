// Add this to your user routes file
const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController'); // Import the controller
const { protect } = require('../middleware/authMiddleware');

// The frontend is specifically asking for /profile
router.get('/profile', protect, getUserProfile);


module.exports = router;