const mongoose = require('mongoose');

const voiceNoteSchema = new mongoose.Schema({
  // Now it strictly references the User collection
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  audioUrl: { type: String, required: true },
  duration: { type: String, required: true },
  tag: { type: String, default: 'Brain Dump' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VoiceNote', voiceNoteSchema);