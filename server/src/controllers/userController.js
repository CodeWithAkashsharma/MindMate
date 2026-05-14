const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        sparkPoints: user.sparkPoints || 0,
        sparkStreak: user.sparkStreak || 0,
        lastSparkDate: user.lastSparkDate,
        isDev: user.isDev 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getUserProfile };