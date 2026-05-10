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

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 2. Create the new user in the database
    const user = await User.create({
      name,
      email,
      password
    });

    // 3. Send back the user info PLUS the token
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
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

    // 1. Find the user by email
    // We must use .select('+password') because we hid it in the Model!
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists AND if the passwords match
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};