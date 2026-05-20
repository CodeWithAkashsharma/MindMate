const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, // Reads your email string
    pass: process.env.EMAIL_PASS  // Reads your 16-character key string
  },
  tls: {
    rejectUnauthorized: false
  }
});

const otpCache = new Map();

const dns = require('dns').promises;


exports.sendEmailOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) {
      return res.status(400).json({ error: "Email address is required." });
    }

    // 1. FIRST GUARD: Check if email is already taken in your database collection
    const emailExists = await User.findOne({ email: newEmail.trim().toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ error: "This email address is already registered to an account." });
    }

  
    // 2. SECOND GUARD: Run the live domain existence verification check
    const domain = newEmail.split('@')[1]?.toLowerCase();
    
    // 🚀 LOCAL DEV BYPASS: If it's a known major provider, skip the network DNS check to prevent firewall blocks
    const majorProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    
    if (!majorProviders.includes(domain)) {
      try {
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
          return res.status(400).json({ error: "The domain entered does not support active email services." });
        }
      } catch (dnsErr) {
        // This captures true domain errors if someone types something like user@gmaillll.com
        return res.status(400).json({ error: "This email domain does not exist in the real world." });
      }
    }

    // 3. Generate secure 6-digit string code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Cache token allocation (10 minutes)
    otpCache.set(req.user.id, { 
      otp, 
      newEmail: newEmail.trim().toLowerCase(), 
      expiresAt: Date.now() + 10 * 60 * 1000 
    });

    // 4. Fire email dispatch payload
    await transporter.sendMail({
      from: `"MindMate Security" <${process.env.EMAIL_USER}>`,
      to: newEmail.trim().toLowerCase(),
      subject: "Verify your new email address",
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #1A1F1C; max-width: 500px; margin: auto; border: 1px solid #E9EFEA; border-radius: 24px;">
          <h2 style="color: #4A6B55; font-size: 20px; margin-bottom: 4px;">Confirm Your Email Change</h2>
          <p style="font-size: 14px; color: #4A5550; line-height: 1.5;">You requested to update your registered email address on MindMate. Use the verification code below to authorize this change:</p>
          <div style="background: #F4F8F5; padding: 16px; font-size: 26px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #3D5946; margin: 24px 0; border-radius: 16px; border: 1px solid #E4ECE7;">
            ${otp}
          </div>
          <p style="font-size: 11px; color: #94A3B8; line-height: 1.4;">This verification code is strictly confidential and will expire in 10 minutes.</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: "Verification code sent successfully!" });
  } catch (err) {
    console.error("OTP generation breakdown failure:", err);
    res.status(500).json({ error: "Failed to transmit verification code email." });
  }
};
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const cachedData = otpCache.get(req.user.id);

    if (!cachedData) {
      return res.status(400).json({ error: "No pending email verification sessions found." });
    }
    if (Date.now() > cachedData.expiresAt) {
      otpCache.delete(req.user.id);
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }
    if (cachedData.otp !== otp) {
      return res.status(400).json({ error: "Incorrect verification code." });
    }

    // Code matches perfectly -> Execute direct atomic patch modification query
   
const updatedUser = await User.findByIdAndUpdate(
  req.user.id,
  { $set: { email: cachedData.newEmail } },
  { returnDocument: 'after' } // <-- Updated!
);

    // Evaporate temporary session details immediately from operational cache memory
    otpCache.delete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Email address verified and updated successfully!",
      email: updatedUser.email
    });
  } catch (err) {
    console.error("OTP collection verification exception:", err);
    res.status(500).json({ error: "Internal server error during email verification workflow." });
  }
};