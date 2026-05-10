const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: [true, 'Please add some text to your journal entry']
    },
    emotions: {
      type: [String], // Array to store multiple feelings (e.g., ["Anxious", "Determined"])
    },
    gratitude: {
      type: [String], // Array to store exactly 3 things they are grateful for
    },
    aiInsight: {
      type: String, // We will leave this blank for now, but the database is ready for it later!
    }
  },
  {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
  }
);

module.exports = mongoose.model('Journal', journalSchema);