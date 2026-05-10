const express = require('express');
const router = express.Router();
const { addMood, getMoods } = require('../controllers/MoodController');

// IMPORT THE BOUNCER
const { protect } = require('../middleware/AuthMiddleware');



// Add 'protect' as the middle argument before your controllers!
router.route('/')
  .get(protect, getMoods)
  .post(protect, addMood);

module.exports = router;

// problem in this file---------------------------