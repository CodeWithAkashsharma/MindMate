const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const VoiceNote = require('../models/VoiceNote');

// IMPORT YOUR AUTH MIDDLEWARE HERE
// (Change the path to match wherever your middleware file is located)
const {protect} = require('../middleware/authMiddleware'); 
const storage = multer.memoryStorage();
const upload = multer({ storage });
// ... cloudinary config and multer setup stays exactly the same ...

// 1. Add `protect` (or whatever you named it) to the route
router.post('/upload',protect, upload.single('audio'), async (req, res) => {
 

        cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

    const uploadAudioToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: 'mindmate_audio' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const cloudinaryResult = await uploadAudioToCloudinary(req.file.buffer);

    // 2. Use the dynamically extracted user ID from the token
    const newNote = new VoiceNote({
      user: req.user._id, // Tied securely to the logged-in user
      audioUrl: cloudinaryResult.secure_url,
      duration: req.body.duration || '0:00',
    });

    await newNote.save();
    res.status(201).json(newNote);

  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: 'Failed to process voice note' });
  }
});

// Protect the GET route too, so users only see THEIR own notes
router.get('/recent', protect, async (req, res) => {
  try {
    const notes = await VoiceNote.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});


// In your backend routes (e.g., server/routes/voiceNotes.js)
router.get('/all', protect, async (req, res) => {
  try {
    // Make sure there is NO .limit() here, just a sort
    const notes = await VoiceNote.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all notes" });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {

    const note = await VoiceNote.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: 'Voice note not found',
      });
    }

    await VoiceNote.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: 'Voice note deleted',
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Failed to delete voice note',
    });
  }
});

module.exports = router;