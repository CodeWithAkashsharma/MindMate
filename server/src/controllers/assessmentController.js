const Assessment = require('../models/Assessment');


exports.saveAssessment = async (req, res) => {
  try {
    const { score, fullDate, displayDate, answers } = req.body;

    const newAssessment = new Assessment({
      user: req.user.id, // Assuming your auth middleware sets req.user
      score,
      fullDate,
      displayDate,
      answers
    });

    const savedAssessment = await newAssessment.save();
    
    // Return the saved data so the frontend can immediately add it to the graph
    res.status(201).json(savedAssessment);
  } catch (error) {
    console.error("Error saving assessment:", error);
    res.status(500).json({ message: 'Server error while saving assessment' });
  }
};

exports.getHistory = async (req, res) => {
  try {

    // Find assessments belonging to this user
    const history = await Assessment.find({
      user: req.user.id
    }).sort({ fullDate: 1 });

    // Latest assessment
    const latestAssessment = history[history.length - 1];

    res.status(200).json({
      history,
      nextAssessmentDate: latestAssessment?.fullDate || null
    });

  } catch (error) {

    console.error("Error fetching history:", error);

    res.status(500).json({
      message: 'Server error while fetching history'
    });

  }
};