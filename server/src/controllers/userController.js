const bcrypt = require('bcryptjs');
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









const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    const updateFields = {};

    // 🌟 FIXED: If name field is empty or spaces, fall back to the existing user name automatically
    if (name && name.trim() !== "") {
      updateFields.name = name.trim();
    } else {
      updateFields.name = user.name; // Keep old name as it is
    }

    // Handle Secure Password Verification Check
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to change passwords." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password." });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { returnDocument: 'after' , runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        name: updatedUser.name
      }
    });

  } catch (err) {
    console.error("Profile update system error:", err);
    res.status(500).json({ error: "Internal server error during profile update." });
  }
};
module.exports = { getUserProfile , updateProfile };
