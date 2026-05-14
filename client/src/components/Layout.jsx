import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Combined user state to hold profile info + spark stats
  const [userData, setUserData] = useState({ 
    name: '', 
    streak: 0, 
    sparkPoints: 0, 
    sparkStreak: 0, 
    lastSparkDate: null,
    isDev: false // Added to track dev status
  });
  
  const [greeting, setGreeting] = useState("");
  const [subtext, setSubtext] = useState("");
  
  // Spark Modal States
  const [showSpark, setShowSpark] = useState(false);
  const [currentSparkTask, setCurrentSparkTask] = useState("Loading your mindful task...");
  
// Tell React to check memory FIRST, otherwise default to false
  const [devMode, setDevMode] = useState(() => {
    return localStorage.getItem('mindmate_devMode') === 'true';
  });

  const isActive = (path) => location.pathname === path;
  const closeSidebar = () => setIsSidebarOpen(false);

  const soulPrompts = [
    "How are you feeling today?",
    "Take a deep breath and center yourself.",
    "What's one thing you're grateful for right now?",
    "Your mind deserves a moment of peace.",
    "Ready to capture a new memory?",
    "Let's check in with your inner self.",
    "Every reflection is a step toward growth.",
    "How's the weather in your head today?"
  ];

// Tell React to update memory every time you toggle the button
  useEffect(() => {
    localStorage.setItem('mindmate_devMode', devMode);
  }, [devMode]);

  // --- SPARK SUBMIT LOGIC ---
  const handleSparkComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/sparks/complete', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // 🔥 SEND DEV MODE FLAG TO BACKEND
        body: JSON.stringify({ devMode }) 
      });
if (response.ok) {
        const data = await response.json();
        
        // 1. Update Layout's own memory
        setUserData(prev => ({
          ...prev,
          sparkPoints: data.points,
          sparkStreak: data.streak,
          lastSparkDate: new Date().toISOString()
        }));
        
        // 🔥 2. THE LOUD BROADCAST: Tell the Dashboard exactly what the new numbers are!
        const syncEvent = new CustomEvent('FORCE_DASHBOARD_UPDATE', {
          detail: { points: data.points, streak: data.streak }
        });
        window.dispatchEvent(syncEvent);
        console.log("📢 Layout Broadcasted New Points:", data.points);

        // 3. Shuffle Dev Mode Task
        if (devMode) {
          const sparkRes = await fetch(`http://localhost:5000/api/sparks/today?devMode=true`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          if (sparkRes.ok) {
            const sparkData = await sparkRes.json();
            setCurrentSparkTask(sparkData.task);
          }
        }
      }
      
      setShowSpark(false); 
    } catch (err) {
      console.error("Spark sync failed:", err);
      setShowSpark(false);
    }
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchLayoutData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [userRes, journalsRes, sparkRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/profile', { headers }),
          fetch('http://localhost:5000/api/journals', { headers }),
          // 🔥 APPEND DEV MODE TO THE URL SO BACKEND KNOWS TO SEND A RANDOM TASK
          fetch(`http://localhost:5000/api/sparks/today?devMode=${devMode}`, { headers })
        ]);

        // 1. Handle User Profile & Spark Stats
        if (userRes.ok) {
          const user = await userRes.json();
          setUserData(prev => ({ 
            ...prev, 
            name: user.name,
            sparkPoints: user.sparkPoints,
            sparkStreak: user.sparkStreak,
            lastSparkDate: user.lastSparkDate,
            isDev: user.isDev // Store dev status
          }));
        }

        // 2. Handle Journal Consistency Streak
        if (journalsRes.ok) {
          const journals = await journalsRes.json();
          const uniqueDates = [...new Set(journals.map(e => new Date(e.createdAt).toDateString()))]
            .map(d => new Date(d))
            .sort((a, b) => b - a);
          
          let currentStreak = 0;
          let today = new Date();
          let yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const hasEntryToday = uniqueDates.some(d => d.toDateString() === today.toDateString());
          const hasEntryYesterday = uniqueDates.some(d => d.toDateString() === yesterday.toDateString());

          if (hasEntryToday || hasEntryYesterday) {
            let checkDate = hasEntryToday ? today : yesterday;
            for (let i = 0; i < uniqueDates.length; i++) {
              const diffInDays = Math.round((checkDate.getTime() - uniqueDates[i].getTime()) / (1000 * 60 * 60 * 24));
              if (diffInDays === 0 || diffInDays === 1) {
                currentStreak++;
                checkDate = uniqueDates[i];
              } else break;
            }
          }
          setUserData(prev => ({ ...prev, streak: currentStreak }));
        }

        // 3. Handle Today's Spark Task
        try {
          const sparkData = await sparkRes.json();
          if (sparkRes.ok && sparkData.task) {
            setCurrentSparkTask(sparkData.task);
          } else {
            setCurrentSparkTask("Take a slow deep breath and reset your mind.");
          }
        } catch (err) {
          setCurrentSparkTask("Pause for a moment and relax your shoulders.");
        }
      } catch (err) {
        console.error("Layout fetch error:", err);
      }
    };

    const updateHeader = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();

      if (hour < 12) setGreeting("Good Morning ☀️");
      else if (hour < 17) setGreeting("Good Afternoon 🌤️");
      else if (hour < 21) setGreeting("Good Evening 🌙");
      else setGreeting("Good Night 🌌");

      const totalMinutesToday = (hour * 60) + minutes;
      const promptIndex = Math.floor(totalMinutesToday / 3) % soulPrompts.length;
      setSubtext(soulPrompts[promptIndex]);
    };

    updateHeader();
    fetchLayoutData();
    const interval = setInterval(updateHeader, 30000); 
    return () => clearInterval(interval);

  // 🔥 ADD DEVMODE TO DEPENDENCY ARRAY SO IT RE-FETCHES WHEN TOGGLED
  }, [location.pathname, devMode]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    window.location.href = '/';
  };

  // 🔥 BYPASS DISABLE IF DEV MODE IS ON
  const isSparkDoneToday = !devMode && userData.lastSparkDate && 
    new Date(userData.lastSparkDate).toDateString() === new Date().toDateString();

  return (
    <div className="flex min-h-screen bg-paper w-full overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] max-w-[85vw] bg-surface border-r border-sage-light/20 flex flex-col h-[100dvh] min-h-0 overflow-hidden scrollbar-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="p-6 pb-5 border-b border-sage-light/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sage to-sage-dark rounded-xl flex items-center justify-center text-white shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            </div>
            <div>
              <div className="font-serif text-xl tracking-tight text-ink">MindMate</div>
              <div className="text-[10px] text-ink-muted tracking-widest uppercase mt-[1px]">Wellness Companion</div>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1 text-ink-muted hover:bg-sage-pale rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto scrollbar-none min-h-0 overscroll-contain">  
          {/* User Card */}
          <div className="p-3 mx-3 my-4 bg-sage-pale rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white font-medium">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium text-sm text-ink truncate">
                {userData.name ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1) : "Loading..."}
              </div>            
              <div className="text-xs text-sage-dark flex items-center gap-1 truncate">
                🔥 {userData.streak !== undefined ? userData.streak : 0}-day streak
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 flex flex-col gap-1">          
            <span className="text-[10px] tracking-widest uppercase text-ink-muted px-3 py-2">Main</span>
            <Link to="/dashboard" onClick={closeSidebar} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive('/dashboard') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="text-[17px] opacity-80">⊹</span>Dashboard
            </Link>
            <Link to="/journal" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/journal') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="text-base opacity-80">📑</span> Daily Journal
            </Link>
            <Link to="/mood" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/mood') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="text-base opacity-80">😊</span> Mood Tracker
            </Link>

            <span className="text-[10px] tracking-widest uppercase text-ink-muted px-3 py-2 mt-4">Wellness Tools</span>
            <Link to="/breathing" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/breathing') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">🌬️</span> Breathing
            </Link>
            <Link to="/meditation" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/meditation') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">🧘</span> Meditation
            </Link>
            <Link to="/habits" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/habits') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">✅</span> Habit Tracker
            </Link>
            <Link to="/sleep" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/sleep') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">🌙</span> Sleep Log
            </Link>

            <span className="text-[10px] tracking-widest uppercase text-ink-muted px-3 py-2 mt-4">Growth</span>
            <Link to="/SelfAssesment" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/SelfAssesment') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">📊</span> Self-Assessment
            </Link>
            <Link to="/resources" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/resources') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">ℹ️</span> Resources
            </Link>
            <Link to="/insights" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/insights') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
              <span className="opacity-70">📈</span> Insights & Reports
            </Link>
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="mt-auto pt-10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all group">
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="bg-surface border-b border-sage-light/20 px-4 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="lg:hidden p-1.5 -ml-1.5 text-ink-soft hover:bg-sage-pale rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="overflow-hidden">
              <h1 className="font-serif text-lg lg:text-2xl text-ink tracking-tight truncate">{greeting}</h1>
              <p className="text-[10px] lg:text-sm text-ink-muted truncate hidden sm:block">{subtext}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* DAILY SPARK BUTTON */}
            <button 
              disabled={isSparkDoneToday}
              onClick={() => setShowSpark(true)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 text-xs lg:text-sm font-bold rounded-2xl transition-all duration-300 ${
                isSparkDoneToday 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-transparent' 
                  : 'bg-white border-2 border-sage/20 text-sage-dark shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <span>{isSparkDoneToday ? '✓' : '⚡'}</span>
              {isSparkDoneToday ? 'Spark Captured' : 'Daily Spark'}
            </button>

            <Link to="/chat" className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 text-xs lg:text-sm font-bold bg-[#1A1F1C] text-white rounded-2xl hover:bg-black transition-all shadow-md active:scale-95 whitespace-nowrap">
              <span>🤖</span> Chat
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* DAILY SPARK MODAL */}
      {showSpark && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-sage-light/20 relative animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-pale rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl animate-bounce">⚡</span>
              </div>
              <h2 className="font-serif text-2xl text-ink mb-2">Daily Spark</h2>
              <p className="text-sm text-ink-soft leading-relaxed mb-8 italic">
                "{currentSparkTask}"
              </p>
              <button 
                onClick={handleSparkComplete}
                className="w-full py-4 bg-sage text-white rounded-2xl font-bold hover:bg-sage-dark transition-all active:scale-95 shadow-lg shadow-sage/20"
              >
                I've done it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 FLOATING DEV TOGGLE - FIXED BOTTOM RIGHT */}
   {userData.isDev && location.pathname === '/dashboard' && (
  <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center bg-white rounded-xl p-1 sm:p-1.5 py-2 sm:py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all hover:shadow-xl max-w-[calc(100vw-2rem)]">
    
    {/* Text Section */}
    <div className="flex flex-col pl-2 pr-3 sm:pl-3 sm:pr-4 justify-center min-w-0">
      <span className="text-[9px] sm:text-[10px] font-black text-sage-dark uppercase tracking-widest leading-tight truncate">
        Developer Access
      </span>
      <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-tight truncate">
        Authorized Session
      </span>
    </div>

    {/* Button */}
    <button
      onClick={() => setDevMode(!devMode)}
      className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap shrink-0 ${
        devMode 
          ? 'bg-sage text-white' 
          : 'bg-ink text-white hover:bg-black' 
      }`}
    >
      {devMode ? 'Lock mode' : 'Unlock mode'}
    </button>
    
  </div>
)}
    </div>
  );
}