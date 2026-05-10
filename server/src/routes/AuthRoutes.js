const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/AuthController');

// Map the specific URLs to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;