import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function Dashboard() {
  // --- AFFIRMATIONS LOGIC ---
  const affirmations = [
    "Every small step you take today is a victory. Be gentle with yourself.",
    "You don't have to have it all figured out right now.",
    "It is okay to rest. Recharging is a productive activity.",
    "Your worth is not measured by your productivity today.",
    "Take a deep breath. You are exactly where you need to be.",
    "Progress is not linear. Celebrate your effort, not just the outcome."
  ];

  const [currentQuote, setCurrentQuote] = useState(affirmations[0]);
  const [isFading, setIsFading] = useState(false);

  

  const shuffleQuote = () => {
    setIsFading(true);
    setTimeout(() => {
      let newQuote;
      do {
        newQuote = affirmations[Math.floor(Math.random() * affirmations.length)];
      } while (newQuote === currentQuote);
      setCurrentQuote(newQuote);
      setIsFading(false);
    }, 300);
  };

  // --- HEATMAP DATA ---
  const heatmapData = [
    0, 1, 0, 2, 3, 1, 0, 
    0, 1, 2, 1, 0, 1, 2, 
    3, 3, 2, 1, 0, 1, 2, 
    3, 2, 1, 1, 2, 3, 2
  ];

  const getColorClass = (level) => {
    switch(level) {
      case 1: return 'bg-sage-light';
      case 2: return 'bg-sage';
      case 3: return 'bg-sage-dark';
      default: return 'bg-paper-warm/50';
    }
  };

const location = useLocation();

  // --- 1. STATE MANAGEMENT ---
  const [stats, setStats] = useState({
    rhythm: 0,
    totalEntries: 0,
  });
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/journals', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const journals = await response.json();

if (journals.length > 0) {
  // 1. Group entries by date and get the average hour for each day
  const dailyAverages = Object.values(
    journals.reduce((acc, j) => {
      const date = new Date(j.createdAt).toDateString();
      const hour = new Date(j.createdAt).getHours();
      if (!acc[date]) acc[date] = [];
      acc[date].push(hour);
      return acc;
    }, {})
  ).map(hours => hours.reduce((a, b) => a + b, 0) / hours.length);

  // 2. Calculate variance between the DAILY averages
  let rhythmScore = 100;
  if (dailyAverages.length > 1) {
    const totalAvg = dailyAverages.reduce((a, b) => a + b, 0) / dailyAverages.length;
    const variance = dailyAverages.reduce((a, b) => a + Math.pow(b - totalAvg, 2), 0) / dailyAverages.length;
    
    // Softer calculation: variance * 2 instead of 4
    rhythmScore = Math.max(0, Math.min(100, Math.round(100 - (variance * 2))));
  }

  // 3. Average Mood Logic
  const allEmotions = journals.flatMap(j => j.emotions);
  const emotionCounts = allEmotions.reduce((acc, emo) => {
    acc[emo] = (acc[emo] || 0) + 1;
    return acc;
  }, {});

  const topEmotion = Object.entries(emotionCounts).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0] || "😌 Calm";

  // 4. Update the combined stats state
  setStats({
    rhythm: rhythmScore,
    totalEntries: journals.length,
    averageMood: {
      emoji: topEmotion.split(' ')[0],
      label: topEmotion.split(' ')[1]
    }
  });
}
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

}, [location.pathname]);



  

  return (
    <div className="flex flex-col gap-6 select-none animate-in fade-in duration-700">
      
      {/* 1. AFFIRMATION BANNER */}
      <div className="bg-gradient-to-r from-sage-pale to-lavender-pale p-4 md:p-5 rounded-2xl border border-white shadow-soft flex items-center justify-between relative overflow-hidden group transition-all duration-500 hover:shadow-card">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10 flex items-center gap-4 flex-1 pr-4">
          <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-lg shadow-sm shrink-0 group-hover:rotate-12 transition-transform">
            🌱
          </div>
          <div>
            <h2 className="text-sm md:text-base font-serif text-ink mb-0.5">Mindful Moment</h2>
            <p className={`text-xs md:text-sm text-ink-soft transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              "{currentQuote}"
            </p>
          </div>
        </div>

        <button 
          onClick={shuffleQuote}
          className="relative z-10 p-2 text-ink-soft hover:text-sage-dark hover:bg-white/50 rounded-full transition-all shrink-0 active:scale-90 active:rotate-180"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* TOP ROW: QUICK STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', val: loading ? '...' : `${stats.totalEntries} Entries`, icon: '🖋️', color: 'text-sage-dark' },
          { label: 'Rhythm', val: loading ? '...' : `${stats.rhythm}%`, icon: '⏳', color: 'text-amber',tooltip: "Rhythm increases when you reflect at consistent times. Expressing your feelings with depth and staying true to your routine determines your score." },
          { label: 'Average Mood', val: loading ? '...' : stats.averageMood?.label || 'Calm', 
  icon: loading ? '🌿' : stats.averageMood?.emoji || '🌿', color: 'text-lavender' }
        ].map((stat, i) => (
    <div key={i} className="bg-surface p-4 md:p-5 rounded-2xl border border-sage-light/20 shadow-card flex flex-col gap-1 transition-all duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-soft group cursor-default relative">
      
      {/* TOOLTIP LOGIC: Only shows if 'tooltip' exists in the object */}
      {stat.tooltip && (
        <div className="absolute top-3 right-3">
          <div className="group/tip relative flex items-center">
            <span className="cursor-help w-4 h-4 rounded-full border border-sage-dark/30 text-sage-dark flex items-center justify-center text-[8px] font-bold hover:bg-sage hover:text-white transition-all">i</span>
            <div className="absolute bottom-full right-0 mb-2 w-52 p-3 bg-ink text-white text-[9px] rounded-xl opacity-0 group-hover/tip:opacity-100 translate-y-1 group-hover/tip:translate-y-0 transition-all pointer-events-none z-50 leading-relaxed shadow-xl border border-white/10">
              <p className="font-bold mb-1 text-sage">How it works:</p>
              {stat.tooltip}
              <div className="absolute top-full right-3 border-4 border-transparent border-t-ink" />
            </div>
          </div>
        </div>
      )}

      <span className="text-[10px] md:text-xs font-medium text-ink-muted uppercase tracking-wider group-hover:text-sage-dark transition-colors">{stat.label}</span>
      <div className="flex items-end gap-2 mt-1">
        <span className={`text-2xl md:text-3xl font-serif ${stat.color}`}>{stat.val}</span>
        <span className="text-xs md:text-sm mb-1 font-medium pb-0.5 group-hover:rotate-12 transition-transform">{stat.icon}</span>
      </div>
      
      {/* Optional subtext that fades in on hover */}
      {stat.sub && (
        <p className="text-[10px] text-ink-muted mt-1 italic opacity-0 group-hover:opacity-100 transition-opacity">
          {stat.sub}
        </p>
      )}
    </div>
  ))}

  {/* NEW ENTRY BUTTON (Keep as the 4th item) */}
  <div className="bg-surface p-4 md:p-5 rounded-2xl border border-sage-light/20 shadow-card flex flex-col justify-center">
    <Link to="/journal" className="w-full flex justify-center py-2.5 md:py-3 bg-ink text-paper text-sm font-medium rounded-xl hover:bg-sage-dark transition-all shadow-sm active:scale-95">
      + New Entry
    </Link>
  </div>
</div>

      {/* 2. QUICK EMOTION CLOUD */}
      <div className="bg-surface p-4 md:p-5 rounded-2xl border border-sage-light/20 shadow-card flex flex-col gap-3 transition-all hover:border-sage-light/40">
        <span className="text-[10px] md:text-xs font-medium text-ink-muted uppercase tracking-wider">How are you feeling right now?</span>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {['😌 Calm', '🔋 Energized', '🌪️ Anxious', '🪫 Drained', '☁️ Numb', '✨ Inspired'].map(emo => (
            <button key={emo} className="px-3 py-1.5 md:px-4 md:py-2 bg-paper text-ink-soft text-xs md:text-sm rounded-xl border border-sage-light/30 hover:border-sage hover:bg-sage-pale hover:text-sage-dark hover:scale-105 active:scale-95 transition-all shadow-sm">
              {emo}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Insights and Entries */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* AI INSIGHT CARD */}
          <div className="bg-gradient-to-br from-sage-pale to-lavender-pale p-5 md:p-6 rounded-2xl border border-white shadow-soft relative overflow-hidden group transition-all duration-500 hover:shadow-card cursor-default">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150"></div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:animate-bounce">✨</span>
                <h3 className="font-serif text-lg md:text-xl text-ink">AI Insight</h3>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
                I noticed your recent journal entries have been focused on project deadlines. Would you like to do a quick reflection to decompress?
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
                <button className="px-4 py-2 bg-white text-sage-dark text-xs md:text-sm font-medium rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all border border-sage-light/30">
                  Chat with MindMate
                </button>
                <button className="px-4 py-2 text-ink-soft text-xs md:text-sm font-medium hover:bg-white/50 rounded-lg transition-colors active:scale-95">
                  Not right now
                </button>
              </div>
            </div>
          </div>

          {/* RECENT ENTRIES (Hollow-Fix Version) */}
          <div className="bg-surface rounded-2xl border border-sage-light/20 shadow-card p-5 md:p-6 transition-all hover:border-sage-light/40 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg text-ink">Recent Entries</h3>
                <Link to="/journal" className="text-xs font-medium text-sage hover:text-sage-dark transition-colors">View All</Link>
              </div>
              
              <div className="relative">
                <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gradient-to-b from-sage-pale via-sage-pale to-transparent"></div>
                
                <div className="flex flex-col gap-6">
                  {[
                    { title: 'Morning Planning', time: 'Today, 8:30 AM', color: 'bg-sage', text: 'Feeling pretty good today. Had a great cup of coffee and the weather is amazing.' },
                    { title: 'Late Night Thoughts', time: 'Yesterday', color: 'bg-lavender', text: 'A bit overwhelmed with the database schema, but I mapped out a solid plan.' }
                  ].map((entry, idx) => (
                    <div key={idx} className="relative pl-8 group cursor-pointer">
                      <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ${entry.color} shadow-sm z-10 group-hover:scale-125 group-hover:ring-4 group-hover:ring-sage-pale transition-all`}></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-ink text-sm group-hover:text-sage-dark transition-colors">{entry.title}</h4>
                        <span className="text-[10px] md:text-xs text-ink-muted whitespace-nowrap ml-2">{entry.time}</span>
                      </div>
                      <p className="text-xs md:text-sm text-ink-soft line-clamp-2 leading-relaxed bg-paper-warm/40 p-4 rounded-xl border border-sage-light/10 group-hover:border-sage-light/40 group-hover:bg-white group-hover:shadow-sm transition-all active:scale-[0.99]">
                        {entry.text}
                      </p>
                    </div>
                  ))}

                  <div className="relative pl-8 pt-2">
                    <div className="absolute left-[3px] top-4 w-1.5 h-1.5 rounded-full bg-sage-light/40"></div>
                    <p className="text-[10px] text-ink-muted italic">The start of a more mindful you...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Focus Anchor (fills horizontal space) */}
            <div className="hidden md:flex w-48 flex-col gap-4 border-l border-sage-light/10 pl-6">
              <span className="text-[10px] font-medium text-ink-muted uppercase tracking-widest">Today's Focus</span>
              <div className="flex flex-col gap-3">
                {['Deep Breathing', 'Hydration', 'No Screen Time'].map(item => (
                  <div key={item} className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-4 h-4 rounded border border-sage-light group-hover:bg-sage-pale transition-colors active:scale-90"></div>
                    <span className="text-xs text-ink-soft group-hover:text-ink transition-colors">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto p-3 bg-lavender-pale/30 rounded-xl border border-lavender/10 group hover:bg-lavender-pale/50 transition-all cursor-default">
                <p className="text-[10px] text-lavender-light leading-snug group-hover:text-lavender transition-colors">AI Tip: Writing for just 5 minutes can lower stress levels.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Consistency and Mood */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-2xl border border-sage-light/20 shadow-card p-5 md:p-6 transition-all hover:border-sage-light/40">
             <h3 className="font-serif text-lg text-ink mb-4">Consistency</h3>
             <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {heatmapData.map((level, index) => (
                  <div 
                    key={index} 
                    className={`w-full aspect-square rounded-[4px] ${getColorClass(level)} hover:scale-125 hover:shadow-sm active:scale-90 transition-all cursor-pointer`}
                  ></div>
                ))}
             </div>
          </div>

          <div className="bg-surface rounded-2xl border border-sage-light/20 shadow-card p-5 md:p-6 flex-1 flex flex-col transition-all hover:border-sage-light/40">
            <h3 className="font-serif text-lg text-ink mb-6">Weekly Mood</h3>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const width = [60, 40, 80, 50, 90, 75, 85][i]; 
                return (
                  <div key={day} className="flex items-center gap-3 group">
                    <span className="text-xs font-medium text-ink-muted w-8 group-hover:text-sage-dark transition-colors">{day}</span>
                    <div className="flex-1 h-2.5 bg-paper-warm rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-sage-light to-sage group-hover:from-sage group-hover:to-sage-dark transition-all duration-700 ease-out" 
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}