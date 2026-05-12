// models/BreathingSession.js
const mongoose = require('mongoose');

const BreathingSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String,
  time: String,
  cycles: Number,
  duration: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BreathingSession', BreathingSessionSchema);