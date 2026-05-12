import React, { useState ,useEffect} from 'react';
import { 
  Moon, Sun, Clock, Coffee, Monitor, Brain, 
  Dumbbell, Wine, Pill, Sparkles,Check 
} from 'lucide-react';
import axios from 'axios';

export default function SleepLog() {
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [quality, setQuality] = useState('Good');
  const [factors, setFactors] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const toggleFactor = (factor) => {
    setFactors(prev => prev.includes(factor) 
      ? prev.filter(f => f !== factor) 
      : [...prev, factor]
    );
  };

  const qualityOptions = [
    { label: 'Poor', emoji: '😫' },
    { label: 'Fair', emoji: '🥱' },
    { label: 'Good', emoji: '✨' },
    { label: 'Great', emoji: '☀️' }
  ];

  const factorOptions = [
    { id: 'Caffeine', icon: <Coffee size={16} />, label: 'Caffeine' },
    { id: 'Screens', icon: <Monitor size={16} />, label: 'Screens' },
    { id: 'Stress', icon: <Brain size={16} />, label: 'Stress' },
    { id: 'Exercise', icon: <Dumbbell size={16} />, label: 'Exercise' },
    { id: 'Alcohol', icon: <Wine size={16} />, label: 'Alcohol' },
    { id: 'Meds', icon: <Pill size={16} />, label: 'Meds' },
  ];


const handleSaveLog = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sleep/save', {
        bedTime, wakeTime, quality, factors
      }, { headers: { Authorization: `Bearer ${token}` } });

      // REPLACE THE ALERT WITH THIS:
      setShowToast(true);
      
      // Reset the form
      setFactors([]);
      setQuality('Good');
      fetchAnalytics(); 
      
      // Auto-hide the popup after 4 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

    } catch (err) {
      console.error("Failed to save log:", err);
      // You can leave an alert here for errors, or build an error toast later!
      alert("Failed to save. Please try again."); 
    }
  };

const [analytics, setAnalytics] = useState({
    dailyStats: Array(14).fill(0),
    avgDuration: 0,
    efficiency: 0,
    avgBedtime: '--:--',
    avgWakeTime: '--:--'
  });

  // NEW: Fetch data on load
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/sleep/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);


  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-1000">
      
{/* custom popup---------------- */}
<div 
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          showToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#1A1F1C] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-[#7C9E87]/30 min-w-[280px]">
          <div className="p-2 bg-[#7C9E87]/20 rounded-full text-[#7C9E87]">
            <Check size={18} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white">Session Logged</p>
            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">Your sleep data has been saved.</p>
          </div>
        </div>
      </div>


      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1F1C] italic tracking-tight">Sleep Architecture</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: PREMIUM LOGGING FORM --- */}
        <div className="xl:col-span-7 bg-white rounded-[40px] border border-[#7C9E87]/15 p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-10">
          
         {/* ENHANCED FORM HEADER */}
<div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-2">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#F2F6F3] hidden sm:flex items-center justify-center border border-[#7C9E87]/20 shadow-sm">
      <Moon size={14} className="text-[#4A6B55]" />
    </div>
    <div>
      <h2 className="text-xs font-black text-[#1A1F1C] uppercase tracking-[0.25em]">Log Tonight's Sleep</h2>
      <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">Record your sleep metrics</p>
    </div>
  </div>
  <span className="text-[9px] hidden sm:block font-black uppercase tracking-widest text-[#4A6B55] bg-[#4A6B55]/10 px-3 py-1.5 rounded-full border border-[#4A6B55]/10">
    Daily Entry
  </span>
</div>
          
          {/* 1. SCHEDULE INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Moon size={14} className="text-indigo-400" />
                <label className="text-[10px] font-black uppercase tracking-widest">Bedtime</label>
              </div>
              <div className="relative group">
                <input 
                  type="time" 
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full p-5 rounded-2xl bg-[#F8F9F8] border border-transparent focus:border-[#7C9E87]/30 focus:bg-white focus:ring-4 focus:ring-[#7C9E87]/5 outline-none text-2xl font-serif text-[#1A1F1C] transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center pointer-events-none group-focus-within:text-[#7C9E87] transition-colors">
                  <Clock size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Sun size={14} className="text-amber-500" />
                <label className="text-[10px] font-black uppercase tracking-widest">Wake Time</label>
              </div>
              <div className="relative group">
                <input 
                  type="time" 
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full p-5 rounded-2xl bg-[#F8F9F8] border border-transparent focus:border-[#7C9E87]/30 focus:bg-white focus:ring-4 focus:ring-[#7C9E87]/5 outline-none text-2xl font-serif text-[#1A1F1C] transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center pointer-events-none group-focus-within:text-[#7C9E87] transition-colors">
                  <Clock size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. QUALITY SELECTOR */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sleep Quality</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {qualityOptions.map((opt) => (
                <button 
                  key={opt.label}
                  onClick={() => setQuality(opt.label)}
                  className={`flex items-center justify-center gap-2 py-1 sm:py-3.5 rounded-xl border transition-all duration-300 ${
                    quality === opt.label 
                    ? 'border-[#7C9E87] bg-[#7C9E87]/10 text-[#1A1F1C] shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base">{opt.emoji}</span>
                  <span className="text-[11px] font-bold tracking-wide">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. FACTORS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Influencing Factors</label>
            <div className="flex flex-wrap gap-3">
              {factorOptions.map((f) => (
                <button 
                  key={f.id}
                  onClick={() => toggleFactor(f.id)}
                  className={ `  py-2 px-1 sm:px-5 sm:py-3 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                    factors.includes(f.id) 
                    ? 'bg-[#4A6B55] text-white border-transparent shadow-md' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className={factors.includes(f.id) ? 'text-white' : 'text-gray-400'}>{f.icon}</span> 
                  <span className="text-[11px] font-bold tracking-wide">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* NEW MATTE SUBMIT BUTTON */}
        <button 
  onClick={handleSaveLog} 
  className=" w-fit sm:w-full px-1 sm:px-0 mx-auto sm:mx-none py-2 sm:py-5 bg-[#4A6B55] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[7px] sm:text-[11px] shadow-[0_8px_30px_rgba(74,107,85,0.25)] hover:bg-[#3A5543] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group border border-[#4A6B55]/50"
>
  Save Sleep Log 
  <Sparkles size={14} className="text-white/70 group-hover:rotate-12 transition-transform" />
</button>
        </div>

        {/* --- RIGHT: PROFESSIONAL HISTORY & MATTE STATS --- */}
        <div className="xl:col-span-5 space-y-6">
          
        {/* CHART AREA */}
{/* --- RIGHT: PROFESSIONAL HISTORY & MATTE STATS --- */}
<div className="xl:col-span-5 space-y-6">
  
  {/* 1. CHART CONTAINER (This white box was missing!) */}
  <div className="bg-white rounded-[40px] border rounded-[40px] bg-white/10 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] p-8 ">
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">14-Day Trajectory</h3>
    
    {/* THE FIX: 'h-32' (height) and 'items-end' (align to bottom) are crucial here */}
    <div className="flex items-end justify-between h-32 gap-1.5 px-2 relative">
      
      {/* Subtle background grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="border-t border-dashed border-gray-300 w-full"></div>
        <div className="border-t border-dashed border-gray-300 w-full"></div>
        <div className="border-t border-dashed border-gray-300 w-full"></div>
      </div>

      {/* Dynamic Graph Bars */}
      {analytics?.dailyStats?.map((hoursSlept, i) => {
        // Calculate height based on a 10-hour goal (e.g., 8.3h = 83% height)
        const heightPercent = Math.min((hoursSlept / 10) * 100, 100);
        
        return (
          <div key={i} className="flex-1 group relative h-full flex items-end ">
            <div 
              style={{ height: `${heightPercent}%`, minHeight: hoursSlept > 0 ? '10%' : '0%' }} 
              className={`w-full rounded-t-md transition-all duration-700 cursor-pointer ${
                hoursSlept >= 7 ? 'bg-[#7C9E87]' : hoursSlept > 4 ? 'bg-[#7C9E87]/50' : 'bg-gray-200'
              } hover:bg-[#1A1F1C] hover:scale-x-110`}
            >
              {/* Tooltip */}
              {hoursSlept > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1F1C] text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold tracking-wider whitespace-nowrap">
                  {hoursSlept}h
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    
    <div className="flex justify-between mt-6 px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
      <span>Week 1</span>
      <span>Week 2</span>
    </div>
  </div>

  {/* 2. MATTE BENTO STATS */}
 
</div>

{/* MATTE BENTO STATS AREA */}
{/* OUTER GLASS CONTAINER */}
<div className="relative p-6 sm:p-8 rounded-[40px] bg-white/10 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] overflow-hidden">  
  {/* YOUR ORIGINAL CODE REMAINS THE SAME INSIDE */}
  <div className="grid grid-cols-2 gap-4">
    <div className="p-5 rounded-[15px] bg-[#F5F5F8] border border-[#E8E8ED] text-center hover:shadow-sm transition-all">
      <p className="text-3xl font-serif text-[#1A1F1C]">{analytics.avgDuration}<span className="text-sm font-sans text-[#5C5C77] ml-1">h</span></p>
      <p className="text-[9px] uppercase tracking-widest text-[#5C5C77] font-black mt-2">Avg Duration</p>
    </div>
    
    <div className="p-5 rounded-[15px] bg-[#F2F6F3] border border-[#E1EBE4] text-center hover:shadow-sm transition-all">
      <p className="text-3xl font-serif text-[#1A1F1C]">{analytics.efficiency}<span className="text-sm font-sans text-[#4A6B55] ml-1">%</span></p>
      <p className="text-[9px] uppercase tracking-widest text-[#4A6B55] font-black mt-2">Efficiency</p>
    </div>
    
    <div className="p-5 rounded-[15px] bg-[#FCF7F2] border border-[#F2EAE1] text-center hover:shadow-sm transition-all">
      <p className="text-2xl font-serif text-[#1A1F1C]">{analytics.avgBedtime}</p>
      <p className="text-[9px] uppercase tracking-widest text-[#8B6E52] font-black mt-2">Avg Bedtime</p>
    </div>
    
    <div className="p-5 rounded-[15px] bg-[#FCF5F6] border border-[#F2E5E7] text-center hover:shadow-sm transition-all">
      <p className="text-2xl font-serif text-[#1A1F1C]">{analytics.avgWakeTime}</p>
      <p className="text-[9px] uppercase tracking-widest text-[#8C5A65] font-black mt-2">Avg Wake Time</p>
    </div>
  </div>
</div>
          
        </div>
      </div>
    </div>
  );
}