const Journal = require('../models/Journal');

// --- CREATE A NEW JOURNAL ENTRY ---
const addJournal = async (req, res) => {
  try {
    const { content, emotions, gratitude } = req.body;

    const newJournal = await Journal.create({
      user: req.user._id, 
      content,
      emotions,
      gratitude
    });

    res.status(201).json({ success: true, data: newJournal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- GET ALL JOURNALS FOR LOGGED-IN USER ---
const getJournals = async (req, res) => {
  try {
    // Only fetch journals that belong to the person requesting them
    const journals = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: journals.length, data: journals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  addJournal,
  getJournals
};