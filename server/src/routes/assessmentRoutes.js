const express = require('express');
const router = express.Router();
const { saveAssessment, getHistory } = require('../controllers/assessmentController');

// Import your existing auth middleware
// Note: Adjust the path if your middleware is named differently
const {protect} = require('../middleware/AuthMiddleware'); 



router.post('/save', protect, saveAssessment);
router.get('/history', protect, getHistory);

module.exports = router;