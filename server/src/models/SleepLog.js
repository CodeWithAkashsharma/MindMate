const mongoose = require('mongoose');

const SleepLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bedTime: { type: String, required: true },   // e.g., "22:30"
  wakeTime: { type: String, required: true },  // e.g., "06:30"
  duration: { type: Number, required: true },  // Calculated hours (e.g., 8.0)
  quality: { type: String, required: true },   // "Poor", "Fair", "Good", "Great"
  factors: [{ type: String }],                 // Array of selected factors
  date: { type: Date, default: Date.now }      // Date logged
});

module.exports = mongoose.model('SleepLog', SleepLogSchema);