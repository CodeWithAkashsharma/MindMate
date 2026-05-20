const Mood = require('../models/Mood');
const Journal = require('../models/Journal'); 
const SleepLog = require('../models/SleepLog');
const MeditationSession = require('../models/MeditationSession');
const BreathingSession = require('../models/BreathingSession');
const SparkProgress = require('../models/SparkProgress');
const QuickAction = require('../models/QuickAction');

exports.getWeeklyInsights = async (req, res) => {
  try {
    const userId = req.user.id; 

    // 1. SET THE DATE RANGE (Last 7 Days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 2. FETCH ALL REAL DATA CONCURRENTLY
    const [moods, journals, sleepLogs, meditations, breathings, sparks, quickActions] = await Promise.all([
      Mood.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
      Journal.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
      SleepLog.find({ user: userId, date: { $gte: sevenDaysAgo } }), 
      MeditationSession.find({ user: userId, date: { $gte: sevenDaysAgo } }),
      BreathingSession.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
      SparkProgress.find({ user: userId, dateCompleted: { $gte: sevenDaysAgo } }),
      QuickAction.find({ user: userId, createdAt: { $gte: sevenDaysAgo } })
    ]);

    // 3. CALCULATE KPIs
    let avgMood = 0;
    if (moods.length > 0) {
      const sum = moods.reduce((acc, curr) => acc + curr.score, 0);
      avgMood = Number((sum / moods.length).toFixed(1));
    }

    const journalDays = new Set(journals.map(j => new Date(j.createdAt).toDateString())).size;
    const journalConsistency = Math.round((journalDays / 7) * 100);

    const meditationDays = new Set(meditations.map(m => new Date(m.date).toDateString())).size;

    // 4. GENERATE MOOD TREND CHART
    const moodTrend = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const targetDayString = d.toDateString();

      const daysMoods = moods.filter(m => new Date(m.createdAt).toDateString() === targetDayString);
      
      let dayScore = 0;
      if (daysMoods.length > 0) {
        dayScore = daysMoods.reduce((acc, curr) => acc + curr.score, 0) / daysMoods.length;
      }

      moodTrend.push({
        day: dayNames[d.getDay()],
        score: Number(dayScore.toFixed(1))
      });
    }

    // 5. CALCULATE WELLNESS BREAKDOWN PERCENTAGES
    let sleepScore = 0;
    if (sleepLogs.length > 0) {
      const avgSleepDur = sleepLogs.reduce((acc, curr) => acc + curr.duration, 0) / sleepLogs.length;
      sleepScore = Math.min(Math.round((avgSleepDur / 8) * 100), 100); 
    }

    let productivityScore = 0;
    if (quickActions.length > 0) {
      const completedActions = quickActions.filter(action => action.done === true).length;
      productivityScore = Math.round((completedActions / quickActions.length) * 100);
    }

 // 1. Find the unique days the user actually practiced mindfulness
const mindfulDays = new Set([
  ...meditations.map(m => new Date(m.date).toDateString()),
  ...breathings.map(b => new Date(b.createdAt).toDateString())
]).size;

// 2. Calculate consistency based on active days out of 7
const mindfulnessScore = Math.round((mindfulDays / 7) * 100);;

    // 6. RESPONSE WITHOUT AUTOMATIC GEMINI CODES
    res.status(200).json({
      userId: userId, // 👈 ADD THIS LINE RIGHT HERE!
      aiSummary: "", // Starts completely empty so it shows the "Analyze with AI" option
      kpis: {
        avgMood: avgMood,
        journalConsistency: journalConsistency,
        meditationDays: meditationDays
      },
      moodTrend: moodTrend,
      wellnessBreakdown: [
        { label: "Mental", score: avgMood * 10 },
        { label: "Sleep", score: sleepScore },
        { label: "Productivity", score: productivityScore },
        { label: "Mindfulness", score: mindfulnessScore }
      ],
      habitImpacts: [
        { type: "sleep", title: "Sleep Log Tracking", impact: sleepLogs.length > 0 ? "Active" : "Needs Data", desc: `You logged sleep on ${sleepLogs.length} days this week.` },
        { type: "journal", title: "Emotional Clarity", impact: journals.length > 0 ? "+ Positive" : "Neutral", desc: `You expressed ${journals.reduce((acc, curr) => acc + curr.emotions.length, 0)} total emotions.` },
        { type: "meditation", title: "Mindfulness Practice", impact: meditations.length > 0 ? "Consistent" : "Build Habit", desc: `You completed ${meditations.length} meditation sessions this week.` },
        { type: "spark", title: "Daily Sparks", impact: sparks.length > 0 ? "On Fire!" : "Ignite your day", desc: `You completed ${sparks.length} Daily Spark challenges this week.` }
      ]
    });

  } catch (error) {
    console.error("Error generating weekly insights:", error);
    res.status(500).json({ error: "Server error generating insights" });
  }
};


const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateAiSummary = async (req, res) => {
  try {
    const { avgMood, productivityScore, sleepScore, mindfulnessScore } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 👉 CHANGED TO 1.5-FLASH FOR 1,500 FREE DAILY REQUESTS
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `
      You are MindMate, an empathetic, supportive wellness AI companion.
      Analyze the user's performance over the last 7 days based on these metrics:
      - Average Mood: ${avgMood}/10
      - Productivity Score: ${productivityScore}%
      - Sleep Score: ${sleepScore}%
      - Mindfulness Score: ${mindfulnessScore}%
      
      Write exactly two short, beautifully written sentences. First, acknowledge their current state with warmth based on the data. Second, offer a gentle, encouraging piece of advice for the upcoming week. Keep it highly human and empathetic. Do not use hashtags, bullet points, or robotic language.
    `;

    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text().trim();

    console.log("✅ Gemini 2.5 triggered and generated successfully!");
    res.status(200).json({ aiSummary });

  } catch (aiError) {
    console.error("Gemini API Error:", aiError);
    
    if (aiError.status === 503) {
      return res.status(503).json({ error: "The MindMate AI servers are currently experiencing high demand. Please try re-analyzing in a few minutes." });
    }
    
    // Catch quota errors gracefully
    if (aiError.status === 429) {
      return res.status(429).json({ error: "Daily AI generation limit reached. Your data is safely recorded, and insights will update tomorrow." });
    }
    
    res.status(500).json({ error: "Failed to generate AI reflections." });
  }
};



exports.generateDashboardSuggestions = async (req, res) => {
  try {
    const { avgMood, productivityScore, sleepScore, mindfulnessScore } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are MindMate, a concise health AI assistant. Analyze these metrics:
      - Mood: ${avgMood}/10, Productivity: ${productivityScore}%, Sleep: ${sleepScore}%, Mindfulness: ${mindfulnessScore}%
      
      Identify the weakest metric. Write exactly one clear, precise, and highly actionable recommendation for today. Do not explain why. Keep it under 20 words total.

      Return a strict JSON object with exactly two keys:
      {
        "text": "Your short recommendation here.",
        "actionType": "meditation" (or "journal", "sleep", "mood")
      }
    `;

    const result = await model.generateContent(prompt);
    const cleanJsonString = result.response.text().replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJsonString);

    res.status(200).json(parsedData);
  } catch (err) {
    console.error(err);
    res.status(200).json({ 
      text: "Mindfulness is your weakest metric. Try a 5-minute guided meditation right now.",
      actionType: "meditation"
    });
  }
};