const Mood = require('../models/Mood');

// Function to save a new mood
const addMood = async (req, res) => {
  try {
    const { score, emotions, notes } = req.body;

    const newMood = await Mood.create({
      user: req.user._id,
      score: score,
      emotions: emotions,
      notes: notes
    });

    res.status(201).json({
      success: true,
      data: newMood
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Function to fetch all past moods
const getMoods = async (req, res) => {
  try {
const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });    
    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  addMood,
  getMoods
};