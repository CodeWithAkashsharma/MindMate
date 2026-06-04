const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.GITHUB_TOKEN,
    baseURL: "https://models.inference.ai.azure.com"
});

const getChatResponse = async (req, res) => {
    try {
        const { messages } = req.body;
        
        // The system prompt gives the AI the app's context and formatting rules
        const systemPrompt = `You are MindMate AI, the official support assistant for the MindMate app. 
Your job is to help the user navigate the app, understand its features, and provide mental wellness support.

APP KNOWLEDGE BASE:
- Daily Spark: Quick daily motivational tasks and reflections.
- Moods: For tracking daily emotions.
- Journals: A place to write thoughts (supports Voice Notes).
- Meditation & Breathing: Guided exercises for relaxation and focus.
- Sleep: Track sleep patterns.
- Assessments: Quizzes to check mental health status.
- Quick Actions: Shortcuts on the dashboard for fast logging.

FORMATTING RULES (STRICT):
1. Reply exactly like you are texting a friend on WhatsApp. 
2. Keep responses short, precise, and conversational.
3. NEVER use markdown. Do not use hashtags, asterisks, bold text, or bullet points. Use plain text only.
4. Use normal punctuation and occasional emojis naturally.
5. If the user asks how to find something, guide them to the specific section mentioned in the app knowledge base.`;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7
        });

        res.status(200).json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("MindMate AI Error:", error);
        res.status(500).json({ error: "Sorry, I am offline right now. Try again later." });
    }
};

module.exports = { getChatResponse };