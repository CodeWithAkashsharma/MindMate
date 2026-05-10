const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    // req.user is set by your protect middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name, // This will return "akash sharma"
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getUserProfile };