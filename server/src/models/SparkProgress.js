const mongoose = require('mongoose');

const sparkProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true
  },
  spark: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailySpark', // Reference to the Spark model
    required: true
  },
  dateCompleted: {
    type: Date,
    default: Date.now // This helps us check the 24-hour rule
  }
}, { timestamps: true });

module.exports = mongoose.model('SparkProgress', sparkProgressSchema);