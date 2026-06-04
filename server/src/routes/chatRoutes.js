const express = require("express");
const { getChatResponse, getChatHistory, clearChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware"); // Or whatever your auth middleware is named

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(protect); 

router.post("/message", getChatResponse);
router.get("/history", getChatHistory);
router.delete("/clear", clearChatHistory);

module.exports = router;