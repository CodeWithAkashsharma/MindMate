const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  answers: { 
    type: Object, // Stores the raw {0: 1, 1: 3...} answer data
    required: true 
  },
  fullDate: { 
    type: Date, 
    required: true 
  },
  displayDate: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);