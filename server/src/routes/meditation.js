// routes/meditationRoutes.js
const router = require('express').Router();
const MeditationSession = require('../models/MeditationSession');
const { protect } = require('../middleware/authMiddleware');

// 1. SAVE SESSION
router.post('/save', protect, async (req, res) => {
  try {
    const newSession = new MeditationSession({
      user: req.user._id,
      duration: req.body.duration,
      // Sound is ignored here
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ message: "Failed to save session" });
  }
});

// 2. GET ANALYTICS
router.get('/analytics', protect, async (req, res) => {
  try {

  const sevenDaysAgo = new Date();

sevenDaysAgo.setHours(0, 0, 0, 0);

sevenDaysAgo.setDate(
  sevenDaysAgo.getDate() - 6
);

    const sessions = await MeditationSession.find({
      user: req.user._id,
     date: { $gte: sevenDaysAgo }
    });

    // TOTAL TIME
    const totalTime = sessions.reduce(
      (acc, s) => acc + s.duration,
      0
    );

    // AVERAGE
    const avgSession =
      sessions.length > 0
        ? (totalTime / sessions.length).toFixed(1)
        : 0;

    // GROUP BY DAY
   const dailyStats = [];

for (let i = 6; i >= 0; i--) {

  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  currentDate.setDate(currentDate.getDate() - i);

  const nextDate = new Date(currentDate);

  nextDate.setDate(nextDate.getDate() + 1);

  const daySessions = sessions.filter(s => {

    const sessionDate = new Date(s.date);

    return (
      sessionDate >= currentDate &&
      sessionDate < nextDate
    );

  });

  const totalMinutes = daySessions.reduce(
    (acc, s) => acc + s.duration,
    0
  );

  dailyStats.push({
    date: currentDate.getDate(),
    totalMinutes
  });

}
    res.json({
      totalTime,
      avgSession,
      dailyStats
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Analytics fetch failed'
    });

  }
});

module.exports = router;