import { useState,useEffect } from 'react';
import { Link,useNavigate ,useLocation} from 'react-router-dom';

export default function Journal() {
  const location = useLocation();
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [gratitude, setGratitude] = useState('');
  const [activePrompt, setActivePrompt] = useState(null);
  const [entries, setEntries] = useState([]);
const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pagination State for Prompts only
  const [promptOffset, setPromptOffset] = useState(0);

  const prompts = [
    "What's one thing that made you smile today?",
    "What is a challenge you're currently facing?",
    "Who is someone you're glad is in your life and why?",
    "What is one goal you want to focus on this week?",
    "What are you looking forward to tomorrow?",
    "What is something you learned today, even if it was small?",
    "How do you want to feel by this time tomorrow?",
    "What are you feeling in your body right now?",
    "What is the most beautiful thing you saw today?",
    "What is a small luxury you enjoyed today (like a coffee or a sunset)?",
    "Describe a moment where you felt at peace.",
    "If you could redo one moment from today, how would you handle it?",
  ];

  const emotionGroups = [
    '😊 Happy', '😫 Overwhelmed', '😴 Tired', '😌 Peaceful',
    '💪 Confident', '🔋 Energized', '😔 Sad', '🌪️ Anxious',
    '😤 Frustrated', '😶 Numb', '🥰 Grateful', '🩹 Healing',
    '🌙 Quiet', '🤩 Excited', '🍃 Calm', '✨ Inspired'
  ];


  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {


      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/journals', {
          headers: {
            'Authorization': `Bearer ${token}` // Sends your login token
          }
        });
        const data = await response.json();
        if (response.ok) {
          setEntries(data); // Put the data into our 'entries' state
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEntries();
  }, [location.pathname]); // Run once when page opens


  // Logic to shuffle only the Sidebar Prompts
  const handleRefreshPrompts = () => {
    setPromptOffset((prev) => (prev + 4 >= prompts.length ? 0 : prev + 4));
  };

  const visiblePrompts = prompts.slice(promptOffset, promptOffset + 4);



const handleSave = async () => {
  const token = localStorage.getItem('token');
  setIsSaving(true);

  try {
    const response = await fetch('http://localhost:5000/api/journals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: entry,
        emotions: selectedMood,
        gratitude: gratitude
      }),
    });


 if (response.ok) {

  const data = await response.json();

  // Create complete frontend object manually
  const newEntry = {
    _id: Date.now(),

    content: entry,

    emotions: [selectedMood],

    gratitude: [gratitude],

    createdAt: new Date().toISOString()
  };

  // Add instantly to UI
  setEntries((prev) => [newEntry, ...prev]);

  // Popup
  setShowSuccessModal(true);

  // Clear fields
  setEntry('');
  setSelectedMood(null);
  setGratitude('');
}

  } catch (error) {
    console.error('Error connecting to server:', error);
  } finally {
    setIsSaving(false);
  }
};
  
const latestEntries = entries.slice(0, 4);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-8">

{/* SUCCESS POPUP */}
{showSuccessModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* High-quality backdrop blur */}
    <div 
      className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-in fade-in duration-500" 
      onClick={() => {
    setShowSuccessModal(false); // 1. Close the popup
   
  }}
      
    />
    
    {/* Modal Card */}
    <div className="relative bg-surface w-full max-w-sm p-10 rounded-[3rem] shadow-2xl border border-sage-light/10 text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
      <div className="w-20 h-20 bg-sage-pale rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner">
        ✨
      </div>
      
      <h3 className="font-serif text-3xl text-ink mb-3 tracking-tight">Saved to MindMate</h3>
      <p className="text-ink-muted text-sm leading-relaxed mb-10 px-4">
        Your reflection has been captured. Take a moment to appreciate this step toward your wellness.
      </p>
      
      <button 
      onClick={() => {
    setShowSuccessModal(false); // 1. Close the popup
  
  }}
        className="w-full py-4 bg-ink text-white rounded-2xl font-medium hover:bg-sage-dark transition-all active:scale-95 shadow-lg shadow-ink/20"
      >
        Continue
      </button>
    </div>
  </div>
)}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: WRITING AREA */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-3xl text-ink">New Entry</h2>
            <p className="text-ink-soft">Capture your thoughts for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          {/* Mood Selector (Full List - Responsive) */}
          <div className="bg-surface p-5 rounded-2xl border border-sage-light/20 shadow-card">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest block mb-4">How is your heart feeling?</span>
            <div className="flex flex-wrap gap-3">
              {emotionGroups.map((mood, index) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all duration-300 active:scale-95 
                    ${selectedMood === mood ? 'bg-sage text-white border-sage shadow-md' : 'bg-paper text-ink-soft border-sage-light/30 hover:border-sage'}
                    ${index <= 4 ? 'inline-flex' : 'hidden'} 
                    ${index > 4 && index <= 7 ? 'sm:inline-flex' : ''}
                    ${index > 7 && index <= 11 ? 'md:inline-flex' : ''}
                    ${index > 11 ? 'lg:inline-flex' : ''}
                  `}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Writing Card */}
          <div className=" relative bg-surface rounded-2xl border border-sage-light/20 shadow-card overflow-hidden flex flex-col">
            
{/* 2. THE PROMPT CODE (Paste inside the wrapper) */}
{activePrompt && (
  /* Container scales width and position based on screen size */
  <div className="absolute 
    top-2 right-2          /* Mobile default */
    md:top-4 md:right-6    /* Tablet/Desktop */
    z-30 animate-in fade-in zoom-in duration-300 
    w-auto 
    max-w-[45%]            /* Prevents overlap on 300px-400px */
    lg:max-w-[40%]         /* Keeps it tight on 800px-1400px */
  ">
    <div className="bg-sage text-white 
      px-2 py-1.5          /* Mobile density */
      md:px-4 md:py-2      /* Desktop density */
      rounded-lg md:rounded-xl 
      shadow-xl flex items-center 
      gap-1.5 md:gap-3 
      border border-white/20"
    >
      {/* Icon disappears below 400px to save space */}
      <span className="text-[10px] hidden min-[400px]:inline">💡</span>
      
      {/* Font scales smoothly across breakpoints */}
      <p className="
        text-[9px]         /* Under 400px */
        sm:text-[10px]     /* 400px - 800px */
        lg:text-[11px]     /* 800px - 1400px */
        font-medium leading-tight truncate italic tracking-tight"
      >
        {activePrompt}
      </p>

      <button 
        onClick={() => setActivePrompt(null)}
        className="hover:bg-white/20 rounded-full p-0.5 md:p-1 transition-colors flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}


            <div className="p-6 border-b border-sage-light/10">
  <span className="text-[11px] font-bold text-ink-muted uppercase tracking-widest block mb-3">Gratitude focus</span>            <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="One thing you're thankful for..."
                className="w-full bg-transparent text-lg text-ink focus:outline-none placeholder:text-ink-muted/60 italic font-serif"
              />
            </div>
            
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder={activePrompt ? "Write your response here..." : "Start writing your reflection here..."}
              className="w-full h-[300px] py-4 px-6 text-ink-soft leading-relaxed placeholder:text-ink-muted/60 resize-none focus:outline-none bg-transparent"
            />

            <div className="px-6 py-4 bg-paper-warm/30 border-t border-sage-light/10 flex items-center justify-between">
              <span className="text-xs text-ink-muted">{entry.length} characters</span>
              <button
                onClick={handleSave}
                disabled={!entry || !selectedMood || isSaving}
                className="px-8 py-2.5 bg-ink text-paper rounded-xl font-medium text-sm hover:bg-ink-mid transition-all active:scale-95 shadow-sm disabled:opacity-30"
              >
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-[2.5rem] border border-sage-light/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-ink">Prompts</h3>
              <button onClick={handleRefreshPrompts} className="p-2 hover:bg-sage-pale rounded-full transition-colors group" title="Shuffle Prompts">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink-muted group-hover:text-sage transition-transform duration-500 group-active:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-5">Click to guide your session</p>
            <div className="flex flex-col gap-4">
              {visiblePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setActivePrompt(prompt)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all animate-in fade-in slide-in-from-right-2 ${
                    activePrompt === prompt ? 'bg-sage border-sage shadow-md' : 'bg-white border-transparent hover:border-sage-light shadow-sm'
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${activePrompt === prompt ? 'text-white font-medium' : 'text-ink-soft group-hover:text-sage-dark'}`}>
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-lavender-pale/50 to-sage-pale/50 p-5 rounded-2xl border border-white shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-md">✨</span>
              <h4 className="font-serif text-md text-ink">MindMate Tips</h4>
            </div>
            <p className="text-[13px] text-ink-soft leading-relaxed italic">
              "Don't worry about being perfect. Just let the words flow. Your future self will thank you for this honesty."
            </p>
          </div>
        </div>
      </div>
   

 {/* LATEST ENTRIES PREVIEW - FULLY RESPONSIVE */}
<div className="mt-5 pb-10">
  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
    <div className="flex flex-col gap-1.5 md:gap-2">
      <span className="text-[10px] font-black text-sage-dark/60 uppercase tracking-[0.2em]">
        Your Journey
      </span>
      {/* Dynamic Heading Size */}
      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ink">
        Recent Reflections
      </h3>
    </div>
    
    <Link 
      to="/history" 
      className="group self-end md:self-auto flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-sage-dark uppercase tracking-widest hover:text-sage transition-colors"
    >
      View Full History
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  </div>

  {/* Dynamic Grid: Auto-adjusts columns based on screen width */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {latestEntries.length > 0 ? (
      latestEntries.map((item) => (
        <div key={item._id} className="group relative bg-surface border border-sage-light/20 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[250px] sm:min-h-[280px]">
          
          {/* SAFE BACKGROUND WATERMARK: Fixes split error and prevents crash */}
          <div className="absolute -bottom-4 -right-4 text-sage-light/10 text-8xl font-serif select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
            {item.emotions && item.emotions.length > 0 && typeof item.emotions[0] === 'string' 
              ? item.emotions[0].split(' ')[0] 
              : '✨'} 
          </div>

          <div className="relative z-10">
            {/* Header: Date and Mood */}
            <div className="flex justify-between items-start mb-6 gap-2">
              <span className="text-[9px] min-[360px]:text-[10px] font-black text-ink-muted/50 uppercase tracking-[0.2em] pt-1">
                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div className="px-1.5 lg:px-2.5 py-1.5 bg-sage-pale rounded-md sm:rounded-full border border-sage-light/20 flex items-center gap-2  flex-shrink-0">
                {/* Array Access Fix: Use [0] */}
                <span className="text-[7px] font-bold text-sage-dark uppercase tracking-tight truncate max-w-[60px] lg:text-[9px] lg:max-w-[80px]">
                  {Array.isArray(item.emotions) ? item.emotions[0] : item.emotions}
                </span>
              </div>
            </div>

            {/* Gratitude: Scaled Typography for impact */}
            <div className="mb-6 text-center">
              {/* Array Access Fix: Use [0] */}
              <p className="text-lg min-[360px]:text-xl md:text-2xl font-serif italic text-ink leading-relaxed line-clamp-2">
               "{Array.isArray(item.gratitude) ? item.gratitude[0] : item.gratitude}"
              </p>
            </div>
          </div>

          {/* Content Footer: Reflection */}
          <div className="relative z-10 mt-auto border-t border-sage-light/10 pt-5">
            <span className="text-[9px] font-bold text-sage-dark/40 uppercase tracking-widest block mb-2">Reflection</span>
            <p className="text-[11px] min-[360px]:text-xs md:text-sm text-ink-soft leading-relaxed line-clamp-3">
              {item.content}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full py-16 text-center border-2 border-dashed border-sage-light/20 rounded-[2rem]">
        <p className="text-xs text-ink-muted italic">No entries yet. Start writing your first note above to see it appear.</p>
      </div>
    )}
  </div>
</div>

    </div>

  );
}