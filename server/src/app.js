const express = require('express');
const cors = require('cors');

const breathingRoutes = require('./routes/breathing');
const moodRoutes = require('./routes/MoodRoutes');
const authRoutes = require('./routes/AuthRoutes');
const journalRoutes = require("./routes/journalRoutes")
const sleepRoutes = require('./routes/sleepRoutes');

const meditationRoutes = require('./routes/meditation');
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




app.get('/', (req, res) => {
  res.send('MindMate API is running perfectly!');
});

module.exports = app;