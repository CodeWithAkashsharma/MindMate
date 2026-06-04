const { OpenAI } = require("openai");
const Chat = require("../models/Chat"); // Import your new model

const client = new OpenAI({
    apiKey: process.env.GITHUB_TOKEN,
    baseURL: "https://models.inference.ai.azure.com"
});

// 1. Generate AI Response & Save to DB
const getChatResponse = async (req, res) => {
    try {
        const { messages } = req.body;
        const userId = req.user.id; // Assuming your auth middleware sets req.user

        const systemPrompt = `You are MindMate AI, the official support assistant for the MindMate app. 
Keep responses short, precise, and conversational. NEVER use markdown. Use plain text only.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini", // Using the mini model to avoid rate limits
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7
        });

        const aiReply = completion.choices[0].message.content;

        // Save the updated conversation to the database
        const updatedMessages = [...messages, { role: "assistant", content: aiReply }];
        
        let chat = await Chat.findOne({ userId });
        if (!chat) {
            chat = new Chat({ userId, messages: updatedMessages });
        } else {
            chat.messages = updatedMessages;
        }
        await chat.save();

        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error("MindMate AI Error:", error);
        if (error.status === 400) {
            return res.status(400).json({ error: "Your message triggered our safety filters." });
        }
        res.status(500).json({ error: "Sorry, I am offline right now. Try again later." });
    }
};

// 2. Fetch Chat History on Page Load
const getChatHistory = async (req, res) => {
    try {
        const chat = await Chat.findOne({ userId: req.user.id });
        if (!chat) {
            return res.status(200).json({ messages: [] });
        }
        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history." });
    }
};

// 3. Clear Chat History
const clearChatHistory = async (req, res) => {
    try {
        await Chat.findOneAndDelete({ userId: req.user.id });
        res.status(200).json({ message: "Chat cleared successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear chat." });
    }
};

module.exports = { getChatResponse, getChatHistory, clearChatHistory };