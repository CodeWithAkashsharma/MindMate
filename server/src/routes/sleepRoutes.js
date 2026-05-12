const router = require('express').Router();
const SleepLog = require('../models/SleepLog');
const { protect } = require('../middleware/authMiddleware'); // Your auth middleware

// Helper to calculate hours slept
const calculateSleepDuration = (bed, wake) => {
  const [bedHrs, bedMins] = bed.split(':').map(Number);
  const [wakeHrs, wakeMins] = wake.split(':').map(Number);

  let bedDate = new Date(2026, 0, 1, bedHrs, bedMins); // Use a dummy date
  let wakeDate = new Date(2026, 0, 1, wakeHrs, wakeMins);

  // If wake time is earlier than bed time, it means they slept past midnight
  if (wakeDate <= bedDate) {
    wakeDate.setDate(wakeDate.getDate() + 1); // Add 1 day to wake time
  }

  const diffMs = wakeDate - bedDate;
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  return Number(diffHrs.toFixed(1)); // Return rounded to 1 decimal (e.g., 7.5)
};

// POST: Save Sleep Log
router.post('/save', protect, async (req, res) => {
  try {
    const { bedTime, wakeTime, quality, factors } = req.body;
    
    // Calculate total hours
    const duration = calculateSleepDuration(bedTime, wakeTime);

    const newLog = new SleepLog({
      user: req.user._id,
      bedTime,
      wakeTime,
      duration,
      quality,
      factors
    });

    await newLog.save();
    res.status(201).json({ message: "Sleep logged successfully!", log: newLog });
    
  } catch (err) {
    console.error("Save Sleep Error:", err);
    res.status(500).json({ error: "Failed to save sleep log" });
  }
});


// GET: Sleep Analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    // 1. Fetch the user's last 14 sleep logs, newest first
    const logs = await SleepLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(14);

    // If no data exists yet, return empty defaults
    if (logs.length === 0) {
      return res.json({
        dailyStats: Array(14).fill(0), // 14 empty days
        avgDuration: 0,
        efficiency: 0,
        avgBedtime: '--:--',
        avgWakeTime: '--:--'
      });
    }

    // 2. Prepare Data for the Graph (Reverse to make chronological left-to-right)
    const chronologicalLogs = [...logs].reverse();
    // Fill with 0s if they have less than 14 logs so the graph doesn't break
    const dailyStats = Array(14).fill(0).map((_, i) => {
      const log = chronologicalLogs[i - (14 - chronologicalLogs.length)];
      return log ? log.duration : 0; 
    });

    // 3. Calculate Averages
    const totalDuration = logs.reduce((acc, log) => acc + log.duration, 0);
    const avgDuration = (totalDuration / logs.length).toFixed(1);
    
    // Efficiency: (Avg Duration / 8 hours goal) * 100, capped at 100%
    const efficiency = Math.min(Math.round((avgDuration / 8) * 100), 100);

    // 4. Time Averaging Helper (Simplified)
    const averageTime = (times, isWakeTime = false) => {
      let totalMins = 0;
      times.forEach(t => {
        let [h, m] = t.split(':').map(Number);
        // Handle bedtime crossing midnight (treat 1am as 25:00 for math)
        if (!isWakeTime && h < 12) h += 24; 
        totalMins += (h * 60) + m;
      });
      
      let avgMins = Math.round(totalMins / times.length);
      let avgH = Math.floor(avgMins / 60) % 24;
      let avgM = avgMins % 60;
      
      let ampm = avgH >= 12 ? 'pm' : 'am';
      let displayH = avgH % 12 || 12;
      let displayM = avgM < 10 ? '0' + avgM : avgM;
      
      return `${displayH}:${displayM}${ampm}`;
    };

    const avgBedtime = averageTime(logs.map(l => l.bedTime), false);
    const avgWakeTime = averageTime(logs.map(l => l.wakeTime), true);

    res.json({ dailyStats, avgDuration, efficiency, avgBedtime, avgWakeTime });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});



module.exports = router;