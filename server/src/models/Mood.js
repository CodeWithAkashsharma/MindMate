const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  { 
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    score: {
      type: Number,
      required: [true, 'Please provide a mood score'],
      min: 1,
      max: 10
    },
    emotions: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      maxLength: [500, 'Notes cannot be more than 500 characters']
    }
  }, 
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Mood', moodSchema);