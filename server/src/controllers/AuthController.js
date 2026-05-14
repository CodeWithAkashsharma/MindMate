const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate the VIP Pass (Token)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token expires in 30 days
  });
};

// --- REGISTER A NEW USER ---
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      sparkPoints: user.sparkPoints || 0,
      sparkStreak: user.sparkStreak || 0,
      lastSparkDate: user.lastSparkDate,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- LOGIN EXISTING USER ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        // ✅ Send the spark data to the frontend on login!
        sparkPoints: user.sparkPoints || 0,
        sparkStreak: user.sparkStreak || 0,
        lastSparkDate: user.lastSparkDate,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- GET USER PROFILE (For the Dashboard) ---
const getUserProfile = async (req, res) => {
  try {
    // req.user._id comes from your protect/auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // ✅ This is what your Layout.jsx and Dashboard.jsx need!
        sparkPoints: user.sparkPoints || 0,
        sparkStreak: user.sparkStreak || 0,
        lastSparkDate: user.lastSparkDate
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};