const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true }, // Minutes spent
  date: { type: Date, default: Date.now }      // When it happened
});

module.exports = mongoose.model('MeditationSession', MeditationSchema);