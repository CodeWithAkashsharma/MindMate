const express = require("express");
const { getChatResponse } = require("../controllers/chatController");

const router = express.Router();

router.post("/message", getChatResponse);

module.exports = router;