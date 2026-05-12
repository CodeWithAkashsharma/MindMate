import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  FastForward,
  Bell,
  VolumeX,
  Waves,
  Trees,
  Moon,
  Flower2,
  BarChart3,
  Check
} from 'lucide-react';


import axios from 'axios';

export default function Meditation() {
  // --- State Management ---
  const [timeLeft, setTimeLeft] = useState(600);
  const [totalDuration, setTotalDuration] = useState(600);
  const [isActive, setIsActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState('None');
  const audioRef = useRef(null);
  const [showToast, setShowToast] = useState(false);

  // --- Timer Engine ---
useEffect(() => {

  // STOP SOUND
  if (!isActive || selectedSound === 'None') {

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return;
  }

  // REMOVE OLD AUDIO
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  // CREATE NEW AUDIO
  const audio = new Audio(
    `/sounds/${selectedSound.toLowerCase()}.mp3`
  );

  audio.loop = true;
  audio.volume = 0.5;

  audio.play().catch((e) =>
    console.log("Audio play blocked:", e)
  );

  audioRef.current = audio;

  // CLEANUP
  return () => {
    audio.pause();
    audio.currentTime = 0;
  };

}, [isActive, selectedSound]);

useEffect(() => {

  let interval = null;

  if (isActive && timeLeft > 0) {

    interval = setInterval(() => {

      setTimeLeft(prev => prev - 1);

    }, 1000);

  } else if (timeLeft === 0) {

    handleComplete();

  }

  return () => clearInterval(interval);

}, [isActive, timeLeft]);

  // --- Handlers ---
  

const handleComplete = async () => {
    setIsActive(false); // Stop the visual timer
    
    // Calculate exact seconds practiced
    const secondsPracticed = totalDuration - timeLeft;
    
    // Use Math.ceil so even a 5-second test counts as 1 minute
    const durationEarned = Math.ceil(secondsPracticed / 60);

    // Only save and show toast if they actually let the timer run for > 0 seconds
    if (secondsPracticed > 0) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.post('http://localhost:5000/api/meditation/save', {
          duration: durationEarned,
        }, { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        if (typeof fetchAnalytics === 'function') fetchAnalytics();
        
        // SHOW POPUP
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);

      } catch (err) {
        console.error("Cloud sync failed:", err);
      }
    } else {
      // Optional: Log to console if they click save without starting the timer
      console.log("Timer didn't run, nothing to save.");
    }
    
    setTimeLeft(totalDuration); // Reset the clock
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const [analytics, setAnalytics] = useState({ dailyStats: [], totalTime: 0, avgSession: 0 });

useEffect(() => {
  const fetchAnalytics = async () => {
    const res = await axios.get('http://localhost:5000/api/meditation/analytics', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setAnalytics(res.data);
  };
  fetchAnalytics();
}, []);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

 return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in duration-1000">
    
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
            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">Your meditation has been saved.</p>
          </div>
        </div>
      </div>
    
    
    
    
      <header className="px-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1F1C] italic">Meditation Therapy</h1>
        <p className="text-gray-500 text-sm mt-1">find your flow in the silence.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
        
        {/* --- PROFESSIONAL TIMER BOX --- */}
        <div className="xl:col-span-7 bg-[#FCFCFB] rounded-[32px] sm:rounded-[48px] border border-[#7C9E87]/10 p-6 sm:p-10 shadow-[0_20px_80px_-20px_rgba(74,107,85,0.08)] relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#7C9E87]/10 blur-[90px] rounded-full -z-10"></div>

          {/* HEADER & DURATION SELECTOR */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 sm:mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F8F5] border border-[#7C9E87]/10">
                <div className="w-2 h-2 rounded-full bg-[#7C9E87] animate-pulse"></div>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#7C9E87] font-black">Focus Session</span>
              </div>
            </div>

            <div className="flex bg-[#F4F6F3] p-1.5 rounded-2xl border border-[#7C9E87]/10 w-full md:w-fit overflow-x-auto">
              {[10, 15, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => { setTimeLeft(m * 60); setTotalDuration(m * 60); setIsActive(false); }}
                  className={`flex-1 md:min-w-[72px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all duration-500 ${
                    totalDuration === m * 60 ? 'bg-white text-[#4A6B55] shadow-sm' : 'text-gray-400 hover:text-[#4A6B55]'
                  }`}
                >
                  {m} MIN
                </button>
              ))}
            </div>
          </div>

          {/* TIMER CENTER */}
          <div className="flex flex-col items-center justify-center">
            {/* Responsively sized container */}
            <div className="relative w-64 h-64 sm:w-[340px] sm:h-[340px] flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border border-[#7C9E87]/15 transition-all duration-[4000ms] ease-in-out ${isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-40'}`}></div>

              {/* FIXED SVG Coordinates for Responsiveness */}
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 340 340">
                <circle cx="170" cy="170" r="158" stroke="#EEF1ED" strokeWidth="2" fill="transparent" />
                <circle 
                  cx="170" cy="170" r="158" stroke="#7C9E87" strokeWidth="3" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 158}
                  strokeDashoffset={2 * Math.PI * 158 * (1 - progress / 100)}
                  className="transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>

              <div className="text-center z-10 px-4">
                <div className="font-serif text-6xl sm:text-[96px] text-[#18201B] leading-none tracking-[-0.06em]">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#7C9E87] animate-pulse' : 'bg-gray-300'}`}></div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#97A39D] font-black">
                    {isActive ? 'Flow State' : 'Resting'}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col ml-12 items-center w-full mt-8 sm:mt-12">
              <div className="w-full flex items-center justify-center gap-6 sm:gap-10">
                <button
                  onClick={() => { setTimeLeft(totalDuration); setIsActive(false); }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#7C9E87]/15 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <RotateCcw size={18} className="text-[#8D9892]" />
                </button>

                <div className="relative">
                  <div className={`absolute inset-0 blur-2xl transition-all duration-700 opacity-30 ${isActive ? 'bg-[#121816]' : 'bg-[#7C9E87]'}`}></div>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative z-10 w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                      isActive ? 'bg-[#121816]' : 'bg-[#7C9E87]'
                    }`}
                  >
                    {isActive ? (
                      <div className="flex gap-2"><div className="w-1.5 h-6 bg-white/90 rounded-full"></div><div className="w-1.5 h-6 bg-white/90 rounded-full"></div></div>
                    ) : (
                      <Play fill="white" size={28} className="text-white ml-1" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleComplete}
                  className="min-w-[80px] sm:min-w-[92px] h-11 sm:h-12 px-4 sm:px-6 rounded-2xl bg-white border border-[#7C9E87]/15 flex items-center justify-center text-[10px] uppercase tracking-widest font-black text-[#6A7B72] shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Save
                </button>
              </div>

            </div>
              <div className="mt-8 sm:mt-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F1F3F0] border border-[#7C9E87]/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7C9E87] animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4A6B55]">
                  {isActive ? 'Meditation In Progress' : 'Ready To Begin'}
                </span>
              </div>
          </div>
        </div>
        {/* --- RIGHT COLUMN: SOUNDS & INSIGHTS --- */}
   {/* --- RIGHT COLUMN: SOUNDS & INSIGHTS --- */}
<div className="xl:col-span-5 space-y-6">

  {/* AMBIENT AUDIO BOX */}
  <div className="bg-white rounded-[32px] border border-[#7C9E87]/10 p-4 shadow-[0_10px_40px_rgba(74,107,85,0.05)]">

    {/* HEADER */}
    <div className="flex items-center justify-between mb-7">

      <div>

        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">
          Ambient Sound
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Create your calm environment
        </p>

      </div>

    
    </div>

    {/* SOUND GRID */}
    <div className="grid grid-cols-3 gap-3">

      {[
        {
          name: 'Ocean',
          icon: <Waves size={18} />
        },
        {
          name: 'Forest',
          icon: <Trees size={18} />
        },
        {
          name: 'Bell',
          icon: <Bell size={18} />
        },
        {
          name: 'Zen',
          icon: <Flower2 size={18} />
        },
        {
          name: 'Brown',
          icon: <Moon size={18} />
        },
        {
          name: 'None',
          icon: <VolumeX size={18} />
        }

      ].map((sound) => (

        <button
          key={sound.name}
          onClick={() => setSelectedSound(sound.name)}

className={`group relative overflow-hidden flex flex-col items-center justify-center gap-3 py-5 rounded-[24px] border transition-all duration-500 ${
  
  sound.name === 'Ocean'
    ? 'bg-blue-50 border-blue-100 text-blue-500'
    : sound.name === 'Forest'
    ? 'bg-emerald-50 border-emerald-100 text-emerald-500'
    : sound.name === 'Bell'
    ? 'bg-amber-50 border-amber-100 text-amber-500'
    : sound.name === 'Zen'
    ? 'bg-purple-50 border-purple-100 text-purple-500'
    : sound.name === 'Brown'
    ? 'bg-stone-100 border-stone-200 text-stone-600'
    : 'bg-gray-100 border-gray-200 text-gray-500'

} ${
  
  selectedSound === sound.name

    // CLICK EFFECT
    ? 'scale-[1.05] -translate-y-1 shadow-xl ring-2 ring-white/50'

    // NORMAL HOVER
    : 'hover:-translate-y-1 hover:shadow-xl hover:scale-[1.03]'
}`}
        >

          {/* SOFT SHINE */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-70"></div>

          {/* ACTIVE RING */}
          {selectedSound === sound.name && (
            <div className="absolute inset-0 rounded-[24px] ring-2 ring-white/40"></div>
          )}

          {/* ICON */}
          <div className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">

            {sound.icon}

          </div>

          {/* NAME */}
          <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.16em]">

            {sound.name}

          </span>

        </button>

      ))}

    </div>

  </div>

  {/* INSIGHTS BOX */}
  <div className="bg-white rounded-[32px] border border-[#7C9E87]/10 p-4 shadow-[0_10px_40px_rgba(74,107,85,0.05)]">

    {/* HEADER */}
    <div className="flex items-center justify-between mb-8">

      <div>

        <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
          Insights & Trends
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          Your meditation consistency
        </p>

      </div>

      <div className="w-10 h-10 rounded-2xl bg-[#F4F7F4] flex items-center justify-center text-[#7C9E87]">

        <BarChart3 size={16} />

      </div>

    </div>

    <div className="space-y-10">

      {/* BAR CHART */}
      <div className="flex items-end gap-3 h-36 px-2 relative">

        {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {

          const dayData = analytics.dailyStats?.[dayNum - 1];

          const barHeight = dayData?.totalMinutes
            ? Math.max(dayData.totalMinutes * 6, 18)
            : 8;

          return (

           <div
  key={dayNum}
  className="flex-1 relative flex items-end h-full group"
>

  {/* TOOLTIP */}
  {dayData?.totalMinutes > 0 && (

    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#18201B] text-white text-[9px] px-3 py-1.5 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-20 pointer-events-none">

      {dayData.totalMinutes} mins

    </div>

  )}

  {/* BAR */}
  <div
    style={{
      height: `${barHeight}px`,
      minHeight: barHeight > 0 ? '12px' : '4px'
    }}

    className={`w-full rounded-t-[14px] transition-all duration-500 ease-out shadow-sm relative overflow-hidden cursor-pointer group-hover:scale-y-[1.04] ${
      dayData?.totalMinutes
        ? 'bg-gradient-to-t from-[#7C9E87] to-[#9BB4A1] hover:from-[#6A8B74] hover:to-[#89A892]'
        : 'bg-[#EEF2EE]'
    }`}
  >

    {/* PREMIUM GLOW */}
    {dayData?.totalMinutes > 0 && (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>

        <div className="absolute top-0 left-0 right-0 h-[30%] bg-white/10 blur-sm"></div>
      </>
    )}

  </div>

  {/* DATE */}
  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 font-bold tracking-wide">

    {dayData?.date || ''}

  </span>

</div>

          );

        })}

      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">

        {/* TOTAL */}
        <div className="bg-gradient-to-br from-[#EEF6F0] to-[#F8FBF9] p-5 rounded-[24px] border border-[#7C9E87]/10">

          <p className="text-[10px] text-[#7C9E87] mb-2 font-black uppercase tracking-[0.16em]">
            Total Time
          </p>

          <div className="flex items-end gap-1">

            <p className="text-4xl font-serif text-[#1A1F1C] leading-none">

              {analytics.totalTime}

            </p>

            <span className="text-sm mb-1 italic text-[#4A6B55]">
              mins
            </span>

          </div>

        </div>

        {/* AVG */}
        <div className="bg-gradient-to-br from-[#F5F1FB] to-[#FBFAFE] p-5 rounded-[24px] border border-purple-100">

          <p className="text-[10px] text-purple-400 mb-2 font-black uppercase tracking-[0.16em]">
            Avg Session
          </p>

          <div className="flex items-end gap-1">

            <p className="text-4xl font-serif text-[#1A1F1C] leading-none">

              {analytics.avgSession}

            </p>

            <span className="text-sm mb-1 italic text-purple-500">
              mins
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>
      </div>
    </div>
  );
}