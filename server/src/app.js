const express = require('express');
const cors = require('cors');

const breathingRoutes = require('./routes/breathing');
const moodRoutes = require('./routes/MoodRoutes');
const authRoutes = require('./routes/AuthRoutes');
const journalRoutes = require("./routes/journalRoutes")
const sleepRoutes = require('./routes/sleepRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const meditationRoutes = require('./routes/meditation');
const DailySpark = require('./models/DailySpark');
const dailySparks = require('./data/sparks');
const sparkRoutes = require('./routes/sparkRoutes');
const QuickAction= require('./routes/quickActions')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json());
app.use('/api/meditation', meditationRoutes);
app.use('/api/breathing', require('./routes/breathing'));
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sleep', sleepRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/sparks', sparkRoutes);
app.use('/api/quick-actions',QuickAction);

const seedSparks = async () => {
  try {
    const count = await DailySpark.countDocuments();
    if (count === 0) {
      await DailySpark.insertMany(dailySparks);
      console.log('✨ Daily Sparks seeded successfully');
    }
  } catch (err) {
    console.error('Spark seeding error:', err);
  }
};
seedSparks();


app.get('/', (req, res) => {
  res.send('MindMate API is running perfectly!');
});

module.exports = app;