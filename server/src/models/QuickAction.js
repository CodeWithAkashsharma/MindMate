const mongoose = require('mongoose');

const quickActionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Indexed for fast database searching
  },
  title: { 
    type: String, 
    required: true 
  },
  icon: { 
    type: String, 
    required: true 
  },
  done: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('QuickAction', quickActionSchema);