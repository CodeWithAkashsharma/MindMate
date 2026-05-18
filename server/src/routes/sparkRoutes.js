const express = require('express');
const router = express.Router();
const { getTodaySpark, completeDailySpark } = require('../controllers/sparkController');

const { protect } = require('../middleware/AuthMiddleware'); 
router.get('/today', protect, getTodaySpark);
router.post('/complete', protect, completeDailySpark);

module.exports = router;