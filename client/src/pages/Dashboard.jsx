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
  const [moods, setMoods] = useState([]);



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
    switch (level) {
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
          // Inside journals.length > 0 block
          const last28Days = [...Array(28)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (27 - i)); // Go back 27 days to today
            return d.toDateString();
          });

          const heatData = last28Days.map(dateStr => {
            const count = journals.filter(j => new Date(j.createdAt).toDateString() === dateStr).length;
            // Level 0: 0 entries, Level 1: 1 entry, Level 2: 2 entries, Level 3: 3+ entries
            return Math.min(count, 3);
          });

          setStats(prev => ({ ...prev, heatmap: heatData }));
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }


const moodResponse = await fetch('http://localhost:5000/api/moods', {
  headers: { Authorization: `Bearer ${token}` }
});

const moodData = await moodResponse.json();

const moodsArray = Array.isArray(moodData)
  ? moodData
  : moodData.moods || moodData.data || [];

setMoods(moodsArray);

    };

    fetchDashboardData();

  }, [location.pathname]);


const weeklyMoodData = [...Array(7)].map((_, i) => {

  const date = new Date();

  date.setDate(date.getDate() - (6 - i));

  const dateString = date.toDateString();

  const matchingMoods = moods.filter(
    (item) =>
      new Date(item.createdAt).toDateString() === dateString
  );

  const avg =
    matchingMoods.length > 0
      ? matchingMoods.reduce(
          (acc, item) => acc + item.score,
          0
        ) / matchingMoods.length
      : null;

  return {
    label: date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    value: avg,
  };
});


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
          { label: 'Rhythm', val: loading ? '...' : `${stats.rhythm}%`, icon: '⏳', color: 'text-amber', tooltip: "Rhythm increases when you reflect at consistent times. Expressing your feelings with depth and staying true to your routine determines your score." },
          {
            label: 'Average Mood', val: loading ? '...' : stats.averageMood?.label || 'Calm',
            icon: loading ? '🌿' : stats.averageMood?.emoji || '🌿', color: 'text-lavender'
          }
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-4 md:p-5 rounded-2xl border border-sage-light/20 shadow-card flex flex-col gap-1 transition-all duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-soft group cursor-default relative">

            {/* TOOLTIP LOGIC: Only shows if 'tooltip' exists in the object */}
            {stat.tooltip && (
              <div className="absolute top-3 right-3">
                <div className="group/tip relative flex items-center">
                  <span className="cursor-pointer w-4 h-4 rounded-full border border-sage-dark/30 text-sage-dark flex items-center justify-center text-[8px] font-bold hover:bg-sage hover:text-white transition-all">i</span>
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
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/40 shadow-soft p-4 min-[400px]:p-6 md:p-8 transition-all hover:shadow-card-hover group/container">

            {/* HEADER SECTION */}
            <div className="flex flex-col min-[450px]:flex-row min-[450px]:items-center justify-between mb-6 gap-2">
              <div className="flex flex-col">
                <h3 className="font-serif text-xl text-ink">Consistency</h3>
              </div>

              <div className="flex items-center gap-1.5 bg-paper-warm/50 px-3 py-1 rounded-full border border-sage-light/10 self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse"></div>
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-tighter">Last 4 Weeks</span>
              </div>
            </div>

            {/* HEATMAP GRID: Optimized for 300px+ */}
            <div className="grid grid-cols-7 gap-1.5 min-[400px]:gap-2 md:gap-3">
              {(stats.heatmap || Array(28).fill(0)).map((level, index) => {
                // Calculate day for tooltip
                const date = new Date();
                date.setDate(date.getDate() - (27 - index));
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                return (
                  <div key={index} className="group relative">
                    <div
                      style={{ transitionDelay: `${index * 15}ms` }}
                      className={`w-full aspect-square rounded-[4px] min-[400px]:rounded-md md:rounded-lg cursor-pointer transition-all duration-500 animate-in fade-in zoom-in
              ${level === 0 ? 'bg-paper-warm/50 border border-sage-light/5 hover:bg-paper-warm/80' :
                          level === 1 ? 'bg-sage-pale border border-sage-light/20' :
                            level === 2 ? 'bg-sage-light border border-sage/20' :
                              'bg-sage-dark shadow-lg shadow-sage/30 scale-[1.05]'}
              hover:scale-125 hover:z-20 hover:shadow-xl
            `}
                    ></div>

                    {/* ENHANCED TOOLTIP */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                      <div className="bg-ink text-white px-2 py-1.5 rounded-lg shadow-2xl flex flex-col items-center gap-0.5 min-w-[80px]">
                        <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest">{dayLabel}</span>
                        <span className="text-[10px] font-medium whitespace-nowrap">
                          {level === 0 ? 'Quiet Day' : `${level} Reflection${level > 1 ? 's' : ''}`}
                        </span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER LEGEND */}
            <div className="mt-8 flex items-center justify-between border-t border-sage-light/10 pt-4">
              <div className="hidden min-[500px]:block">
                <p className="text-[10px] text-ink-muted italic">
                  {stats.totalEntries > 0 ? "Tracking your growth daily" : "Start your first entry today"}
                </p>    </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[8px] font-black text-ink-muted uppercase tracking-tighter mr-1">Intensity</span>
                {[0, 1, 2, 3].map(lvl => (
                  <div
                    key={lvl}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-[2px] 
            ${lvl === 0 ? 'bg-paper-warm/50' : lvl === 1 ? 'bg-sage-pale' : lvl === 2 ? 'bg-sage-light' : 'bg-sage-dark'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
         <div className="bg-surface rounded-2xl border border-sage-light/20 shadow-card p-5 md:p-6 flex-1 flex flex-col transition-all hover:border-sage-light/40">

  <div className="flex items-center justify-between mb-6">

    <div>
   <h3 className="font-serif text-lg text-ink">
Mood Activity
</h3>

<p className="text-[11px] text-ink-muted mt-1">
  Tracking your emotional flow daily
</p>
    </div>

    <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">

      <span className="w-2.5 h-2.5 rounded-full bg-sage"></span>

      <span>Mood Score</span>
    </div>
  </div>

  <div className="flex-1 flex flex-col justify-center gap-5">

    {weeklyMoodData.map((item) => (

      <div
        key={item.label}
        className="flex items-center gap-3 group"
      >

        <span className="text-xs font-medium text-ink-muted w-8 group-hover:text-sage-dark transition-colors">
          {item.label}
        </span>

        <div className="flex-1 h-2.5 bg-paper-warm rounded-full overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
  item.value
    ? 'bg-gradient-to-r from-sage-light to-sage group-hover:from-sage group-hover:to-sage-dark'
    : 'bg-paper border border-dashed border-sage-light/30'
}`}
          ></div>
        </div>

        <span className="text-[11px] font-semibold text-sage-dark w-8 text-right">
          {item.value > 0
            ? item.value.toFixed(1)
            : "--"}
        </span>
      </div>
    ))}
  </div>
</div>
        </div>

      </div>
    </div>
  );
}