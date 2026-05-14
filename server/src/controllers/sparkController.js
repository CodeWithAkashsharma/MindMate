const SparkProgress = require('../models/SparkProgress');
const DailySpark = require('../models/DailySpark');
const User = require('../models/User');

// --- 1. GET TODAY's SPARK ---
const getTodaySpark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if the frontend sent the Dev Mode flag
    const isDevActive = user.isDev && req.query.devMode === 'true';

    // 🔥 THE TRICK: If Dev is active, pick a random task! Otherwise, use the daily task.
    const sparkIndex = isDevActive 
      ? Math.floor(Math.random() * 30) 
      : new Date().getDate() % 30;

    const spark = await DailySpark.findOne({ sparkId: sparkIndex });
    if (!spark) return res.status(404).json({ message: "Spark not found" });

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const isCompleted = await SparkProgress.findOne({
      user: req.user._id,
      dateCompleted: { $gte: todayStart }
    });

    res.status(200).json({
      task: spark.task,
      // If Dev is active, always tell React the button is NOT completed
      isCompleted: isDevActive ? false : !!isCompleted 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. COMPLETE DAILY SPARK ---
// --- 2. COMPLETE DAILY SPARK ---
const completeDailySpark = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId); 
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // 1. Check if an entry already exists for today
    const alreadyDone = await SparkProgress.findOne({
      user: userId,
      dateCompleted: { $gte: todayStart }
    });

    // 🔥 100% SURETY: Check both the URL Query AND the Body Payload for the Dev Flag!
    const devFlag = req.query.devMode === 'true' || req.body.devMode === true;
    const isDevActive = user.isDev === true && devFlag;

    // Tracker 1: Print to VS Code terminal so you know if the flag is working
    console.log(`[DEBUG] Dev Mode Active: ${isDevActive}`); 

    // 2. Block normal users if they already did it today
    if (alreadyDone && !isDevActive) {
      return res.status(400).json({ message: "Already captured today!" });
    }

    // 3. CREATE THE DATABASE ENTRY
    if (isDevActive || !alreadyDone) {
        const sparkIndex = isDevActive ? Math.floor(Math.random() * 30) : new Date().getDate() % 30;
        let spark = await DailySpark.findOne({ sparkId: sparkIndex });

        // Safety Net: If the random spark math failed, grab a default task so MongoDB doesn't crash
        if (!spark) {
            spark = await DailySpark.findOne({});
        }

        try {
            // Forcefully inject the new document into MongoDB
            await SparkProgress.create({ 
                user: userId, 
                spark: spark ? spark._id : null, 
                dateCompleted: new Date() 
            });
            console.log(`[DEBUG] Successfully saved new document to SparkProgress!`);
        } catch (dbError) {
            // Tracker 2: If MongoDB blocks the save, it will scream exactly why right here!
            console.log(`[CRITICAL ERROR] MongoDB blocked the save:`, dbError.message);
        }
    }

    // 4. STREAK LOGIC
    let newStreak = user.sparkStreak || 0;
    const todayStr = new Date().toDateString();
    const lastSparkStr = user.lastSparkDate ? new Date(user.lastSparkDate).toDateString() : null;

    if (isDevActive) {
        newStreak += 1; 
    } else {
        if (lastSparkStr !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastSparkStr === yesterday.toDateString()) {
                newStreak += 1; 
            } else {
                newStreak = 1; 
            }
        }
    }

    // 5. POINTS & SAVE
    const newPoints = (user.sparkPoints || 0) + 10;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { sparkPoints: newPoints, sparkStreak: newStreak, lastSparkDate: new Date() } },
      { new: true } 
    );

    res.status(200).json({ points: updatedUser.sparkPoints, streak: updatedUser.sparkStreak });
  } catch (error) {
    console.error("Spark Save Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodaySpark, completeDailySpark };