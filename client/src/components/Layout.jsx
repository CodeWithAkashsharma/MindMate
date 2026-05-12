import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo"

export default function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', streak: 0 });
  const isActive = (path) => location.pathname === path;
  const closeSidebar = () => setIsSidebarOpen(false);
 const [greeting, setGreeting] = useState("");
  const [subtext, setSubtext] = useState("");

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







  useEffect(() => {
    const fetchSidebarData = async () => {
      const token = localStorage.getItem('token');
      
      // If no token, don't try to fetch (prevents errors on login/landing pages)
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [userRes, journalsRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/profile', { headers }),
          fetch('http://localhost:5000/api/journals', { headers })
        ]);

        if (userRes.ok) {
          const user = await userRes.json();
          setUserData(prev => ({ ...prev, name: user.name }));
        }

if (journalsRes.ok) {

  
  const journals = await journalsRes.json();
  
  // 1. Get unique dates and sort them (Newest first)
  const uniqueDates = [...new Set(journals.map(e => new Date(e.createdAt).toDateString()))]
  .map(d => new Date(d))
  .sort((a, b) => b - a);
  

  let currentStreak = 0;
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  // 2. Check if user has an entry today or yesterday to even start the streak
  const hasEntryToday = uniqueDates.some(d => d.toDateString() === todayStr);
  const hasEntryYesterday = uniqueDates.some(d => d.toDateString() === yesterdayStr);

  if (hasEntryToday || hasEntryYesterday) {
    let checkDate = hasEntryToday ? today : yesterday;
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = uniqueDates[i];
      const diffInMs = checkDate.getTime() - entryDate.getTime();
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      // 0 means same day, 1 means consecutive day
      if (diffInDays === 0 || diffInDays === 1) {
        currentStreak++;
        checkDate = entryDate;
      } else {
        break; 
      }
    }
  }

  setUserData(prev => ({ ...prev, streak: currentStreak }));
}
      } catch (err) {
        console.error("Layout fetch error:", err);
      }
    };

const updateHeader = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  // 1. Greeting Logic (Keep as is)
  if (hour < 12) setGreeting("Good Morning ☀️");
  else if (hour < 17) setGreeting("Good Afternoon 🌤️");
  else if (hour < 21) setGreeting("Good Evening 🌙");
  else setGreeting("Good Night 🌌");

  // 2. CHANGE THIS: Rotate every 3 minutes
  // Total minutes passed today divided by 3
  const totalMinutesToday = (hour * 60) + minutes;
  const promptIndex = Math.floor(totalMinutesToday / 3) % soulPrompts.length;
  
  setSubtext(soulPrompts[promptIndex]);
};

    updateHeader();
    fetchSidebarData();
    const interval = setInterval(updateHeader, 30000); 
    return () => clearInterval(interval);


    
  }, [location.pathname]); // Runs once on mount




 

 const handleLogout = () => {
  // 1. Clear the token and any user data from storage
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // If you stored user info there

  // 2. Redirect the user to the login page
  // We use window.location.href to ensure a clean state reset
 window.location.href = '/';
};


  // ... rest of your component ...


  return (
    <div className="flex min-h-screen bg-paper w-full overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
     <aside className={`
  fixed inset-y-0 left-0 z-50
  w-[260px] max-w-[85vw]
  bg-surface border-r border-sage-light/20
flex flex-col h-[100dvh] min-h-0 overflow-hidden

  scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]

  transform transition-transform duration-300 ease-in-out

  lg:relative lg:translate-x-0 lg:shadow-none

  ${isSidebarOpen
    ? 'translate-x-0 shadow-2xl'
    : '-translate-x-full'
  }
`}>
        
        {/* Logo Area */}
        <div className="p-6 pb-5 border-b border-sage-light/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sage to-sage-dark  rounded-xl flex items-center justify-center text-white shrink-0">
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
<div className="flex-1 overflow-y-auto scrollbar-none min-h-0 overscroll-contain">  {/* User Card */}
        <div className="p-3 mx-3 my-4 bg-sage-pale rounded-2xl flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white font-medium">
         {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="overflow-hidden">
<div className="font-medium text-sm text-ink truncate">
  {userData.name
    ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
    : "Loading..."}
</div>            <div className="text-xs text-sage-dark flex items-center gap-1 truncate">🔥 {userData.streak !== undefined ? userData.streak : 0}-day streak</div>
          </div>
        </div>

        {/* Navigation Links */}
       {/* Navigation */}
<nav className="px-3 flex flex-col gap-1">          <span className="text-[10px] tracking-widest uppercase text-ink-muted px-3 py-2">Main</span>
         <Link to="/dashboard" onClick={closeSidebar} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${isActive('/dashboard') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
    <span className="text-[17px]  opacity-80">⊹</span>Dashboard
  </Link>

  
  <Link to="/journal" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/journal') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
    <span className="text-base opacity-80">📑</span> Daily Journal
  </Link>
  
  <Link to="/mood" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/mood') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
    <span className="text-base opacity-80">😊</span> Mood Tracker
  </Link>

          {/* WELLNESS TOOLS */}
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

          {/* GROWTH */}
          <span className="text-[10px] tracking-widest uppercase text-ink-muted px-3 py-2 mt-4">Growth</span>
          <Link to="/assessment" onClick={closeSidebar} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/assessment') ? 'bg-sage-pale text-sage-dark font-medium border-l-4 border-sage' : 'text-ink-soft hover:bg-sage-pale/50'}`}>
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
        <div className="mt-auto pt-10">
    <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all group"
    >
      <svg 
        className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
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
            <button 
              className="lg:hidden p-1.5 -ml-1.5 text-ink-soft hover:bg-sage-pale rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <div className="overflow-hidden">
              <h1 className="font-serif text-lg lg:text-2xl text-ink tracking-tight truncate">{greeting}</h1>
              <p className="text-[10px] lg:text-sm text-ink-muted truncate hidden sm:block">{subtext}</p>
            </div>
          </div>

          <div className="flex gap-2 lg:gap-3 shrink-0">
            <button className="hidden sm:block px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium border border-sage-light/50 text-ink-soft rounded-lg hover:border-sage hover:text-sage-dark transition-all whitespace-nowrap">
              Check-in
            </button>
            <button className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium bg-sage text-white rounded-lg hover:bg-sage-dark transition-all shadow-sm whitespace-nowrap">
              Chat ✨
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}