// server/src/routes/insightsRoutes.js
const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const {protect} = require('../middleware/AuthMiddleware'); // Make sure this matches your auth middleware file name!

// GET /api/insights/weekly
router.get('/weekly', protect , insightsController.getWeeklyInsights);
router.post('/generate-ai', protect, insightsController.generateAiSummary);
module.exports = router;