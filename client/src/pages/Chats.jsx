import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaRobot, FaBrain, FaLeaf,FaTrash, FaPlus, FaCopy, FaCheck } from "react-icons/fa";

const Chat = () => {
  const defaultMessages = [
    {
      role: "assistant",
      content: "Hi, I'm MindMate AI. 🌿 Tell me what's on your mind today."
    }
  ];

  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const suggestions = [
    "Analyze my mood",
    "Help me calm down",
    "Create journal entry",
    "Breathing exercise"
  ];

  // Fetch Chat History from DB on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust if your token is stored differently
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Send user token
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: data.error || "Unable to connect." }]);
      }
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuggestions = messages.length === 1 && messages[0].role === "assistant";

  const sendSuggestion = (text) => {
    setInput(text);
  };

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => { setCopiedIndex(null); }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };
  
  const handleClearChat = async () => {
    // 1. Optimistic UI update
    setMessages(defaultMessages);
    
    // 2. Clear from database
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/chat/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to clear chat in database", error);
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-8rem)] overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8faf8] via-[#f6fbf8] to-[#eef7f1]">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-400/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/20 blur-[120px]" />

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 blur-xl opacity-40" />
              <div className="relative h-7 w-7 sm:h-12 sm:w-12 rounded-md sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FaBrain className="text-white text-xl" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-md sm:text-xl">MindMate AI</h2>
              <p className="text-[10px] sm:text-sm text-slate-500">Your wellness companion</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
           {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-xl border border-red-200 bg-white text-red-500 text-xs sm:text-sm font-medium transition-all hover:bg-red-700 hover:text-white hover:border-red-500 shadow-sm"
              >
                <FaTrash size={10} className="sm:size-3 sm:mb-1.5"  />
                <span className="hidden sm:inline">Clear Chat</span>
                <span className="inline sm:hidden">Clear</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl shadow-xl">
              <FaBrain />
            </div>
            <h2 className="mt-5 text-3xl font-bold text-slate-800">MindMate AI</h2>
            <p className="mt-2 text-slate-500 max-w-md">
              Share your thoughts, emotions, or concerns and get personalized support.
            </p>
          </div>
        )}
        <div className="max-w-6xl mx-auto flex flex-col gap-1 sm:gap-5 lg:gap-8">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-3 hidden sm:flex">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                      <FaRobot />
                    </div>
                  </div>
                )}
                <div className="flex flex-col group">
                  <div
                    className={`max-w-[95%] sm:max-w-[80%] lg:max-w-[70%] rounded-3xl px-5 py-4 shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white max-w-[250px] sm:max-w-[500px] sm:w-fit lg:max-w-[600px] lg:w-fit xl:max-w-[700px] xl:w-fit"
                        : "bg-white/80 backdrop-blur-xl border border-white text-slate-800 max-w-[70%]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {msg.content}
                    </p>
                  </div>
                  {msg.content !==
  "Hi, I'm MindMate AI. 🌿 Tell me what's on your mind today." &&(
                  <button
                    onClick={() => copyMessage(msg.content, index)}
                    className="mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 hover:text-green-600 self-start"
                  >
                    {copiedIndex === index ? <FaCheck size={14} /> : <FaCopy size={14} />}
                  </button>
  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <FaLeaf />
              </div>
              <div className="bg-white rounded-3xl px-5 py-4 shadow-lg">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && !isLoading && (
        <div className="px-3 sm:px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => sendSuggestion(item)}
                className="shrink-0 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-green-400 hover:bg-green-50 text-sm transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 p-2 flex items-center transition-all duration-300 focus-within:border-emerald-500">
            <input
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 bg-transparent outline-none px-3 py-1 sm:py-3 text-xs sm:text-base"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-7 w-7 sm:h-12 sm:w-12 rounded-md sm:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-all disabled:opacity-40"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;