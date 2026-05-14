const express = require('express');
const router = express.Router();
const QuickAction = require('../models/QuickAction');
// IMPORTANT: Adjust the path below if your auth middleware is named differently
const{ protect} = require('../middleware/AuthMiddleware'); 

// The standard defaults for a fresh account
const defaultActions = [
 { id: 1, icon: "💧", title: "Water", done: false },
  { id: 2, icon: "🎵", title: "Music", done: false },
 { id: 3, icon: "🍎", title: "Healthy Bite", done: false },
  { id: 4, icon: "🚶", title: "Walk", done: false },
   { id: 5, icon: "📵", title: "Pause", done: true },
   { id: 6, icon: "☀️", title: "Sunlight", done: false }
];

// GET /api/quick-actions/tasks

router.get('/tasks', protect, async (req, res) => {
  try {
    let actions = await QuickAction.find({ user: req.user.id }).sort({ createdAt: 1 });

    // 1. Auto-seed defaults for new users
    if (actions.length === 0) {
      const actionsToInsert = defaultActions.map(action => ({
        ...action,
        user: req.user.id
      }));
      actions = await QuickAction.insertMany(actionsToInsert);
      return res.json(actions);
    }

    // 2. DAILY RESET LOGIC
    // Check the 'updatedAt' of the first action
    const lastUpdate = new Date(actions[0].updatedAt);
    const today = new Date();

    // Compare year, month, and date
    const isDifferentDay = 
      lastUpdate.getDate() !== today.getDate() ||
      lastUpdate.getMonth() !== today.getMonth() ||
      lastUpdate.getFullYear() !== today.getFullYear();

    if (isDifferentDay) {
      // Reset all 'done' statuses to false for this user
      await QuickAction.updateMany(
        { user: req.user.id }, 
        { $set: { done: false } }
      );
      
      // Re-fetch the freshly reset actions
      actions = await QuickAction.find({ user: req.user.id }).sort({ createdAt: 1 });
    }

    res.json(actions);
  } catch (error) {
    console.error("Error fetching/resetting actions:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.put('/toggle/:id', protect, async (req, res) => {
  try {
    // Search by the document ID AND the logged-in User's ID for security
    const action = await QuickAction.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Toggle the boolean value
    action.done = !action.done;

    // CRITICAL: This line saves the change permanently to the database
    await action.save(); 

    res.json(action);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;