const mongoose = require('mongoose');

const dailySparkSchema = new mongoose.Schema({
    sparkId: { type: Number, unique: true }, // 0 to 29
    task: { type: String, required: true },
    category: { type: String, default: 'Mindfulness' }
});

module.exports = mongoose.model('DailySpark', dailySparkSchema);