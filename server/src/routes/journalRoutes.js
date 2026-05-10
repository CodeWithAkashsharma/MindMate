const express = require('express');
const router = express.Router();
const { addJournal, getJournals } = require('../controllers/JournalController');
const Journal = require('../models/Journal'); // Use your actual filename here

// Bring in the Bouncer
const { protect } = require('../middleware/authMiddleware');

// Lock down both the GET and POST routes
router.route('/')
.post(protect, addJournal)
// GET all journals for the logged-in user
// This goes in journalRoutes.js
router.get('/', protect, async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) tells MongoDB to sort by "Newest First"
    const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});


// 1. DELETE ENTRY
router.delete('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) return res.status(404).json({ message: "Entry not found" });
    
    // Check if user owns the entry
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await journal.deleteOne();
    res.json({ message: "Entry removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. UPDATE ENTRY
router.put('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedJournal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Add this function to your controller
const getMoodStats = async (req, res) => {
  try {
    const stats = await Journal.aggregate([
      // 1. Filter for the current user
      { $match: { user: req.user._id } },
      // 2. Unwind the emotions array (since your DB stores them as arrays)
      { $unwind: "$emotions" },
      // 3. Group by the emotion label and count them
      { $group: { 
          _id: "$emotions", 
          count: { $sum: 1 },
          color: { $first: "$color" } // Optional if you add colors to DB
        } 
      },
      // 4. Sort by highest count
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

router.get('/stats', protect, getMoodStats)

module.exports = router;