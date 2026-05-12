// routes/breathing.js
const router = require('express').Router();
const BreathingSession = require('../models/BreathingSession');
const { protect } = require('../middleware/authMiddleware');// Assuming you have auth middleware

// GET LATEST 10 SESSIONS
// GET LATEST 10 SESSIONS
router.get('/history', protect, async (req, res) => {
  try {
    // MongoDB uses _id. Ensure we use the correct property from req.user
    const history = await BreathingSession.find({ user: req.user._id }) 
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json(history);
  } catch (err) {
    console.error("History Fetch Error:", err);
    res.status(500).json({ message: "Server error fetching history" });
  }
});

// SAVE SESSION
router.post('/save', protect, async (req, res) => {
  try {
    const newSession = new BreathingSession({
      ...req.body,
      user: req.user._id // Use _id here as well
    });
    
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ message: "Save failed" });
  }
});

module.exports = router;