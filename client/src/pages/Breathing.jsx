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

export default function Breathing() {
  // --- State Management ---
  const [phase, setPhase] = useState('Ready');
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [restCount, setRestCount] = useState(2);
  const [cycles, setCycles] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [history, setHistory] = useState([]);
  
  // Custom Toast State
  const [showToast, setShowToast] = useState(false);
  
  const tips = [
    'Relax your shoulders during exhale.',
    'Breathe softly instead of deeply forcing air.',
    'Focus on slow and controlled rhythm.',
    'Allow your jaw and face muscles to relax.',
    'Try breathing from your diaphragm.'
  ];
  const [tip, setTip] = useState(tips[0]);

  // Tip Rotation
  useEffect(() => {
    const rotateTips = setInterval(() => {
      setTip(prev => tips[(tips.indexOf(prev) + 1) % tips.length]);
    }, 7000);
    return () => clearInterval(rotateTips);
  }, []);

  // 1. Fetch History on Load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/breathing/history',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // ALWAYS force array
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching history:', err);
        // prevent crash
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  // 2. Updated stopSession to save to Database AND show popup
  const stopSession = async () => {
    if (cycles > 0 || sessionSeconds > 0) {
      const sessionData = {
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
        cycles,
        duration: `${Math.floor(sessionSeconds / 60)}m ${sessionSeconds % 60}s`
      };

      try {
        const savedSession = await axios.post(
          'http://localhost:5000/api/breathing/save',
          sessionData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        // ADD NEW SESSION TO TOP
        setHistory(prev => [savedSession.data, ...prev].slice(0, 10));

        // --- SHOW SUCCESS POPUP ---
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        // --------------------------

      } catch (err) {
        console.error("Cloud save failed", err);
      }
    }
    
    // Reset States
    setIsActive(false);
    setIsResting(false);
    setSeconds(0);
    setCycles(0);
    setSessionSeconds(0);
    setPhase('Ready');
  };

  useEffect(() => {
    let timer;
    if (isActive && !isResting) {
      timer = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          
          // Pattern: 4s Inhale -> 4s Hold -> 6s Exhale
          if (next <= 4) setPhase('Inhale');
          else if (next <= 8) setPhase('Hold');
          else if (next <= 14) setPhase('Exhale');

          if (next >= 14) {
            setIsResting(prevIsResting => {
              // Increment ONLY once
              if (!prevIsResting) {
                setCycles(c => c + 1);
                return true;
              }
              return prevIsResting;
            });
            setRestCount(2);
            setPhase('Rest');
            return 0;
          }
          return next;
        });
        setSessionSeconds(s => s + 1);
      }, 1000);
    } else if (isActive && isResting) {
      timer = setInterval(() => {
        setRestCount(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setPhase('Inhale');
            return 2; 
          }
          return prev - 1;
        });
        setSessionSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, isResting]);

  return (
    <div className="max-w-7xl p-8 mx-auto animate-in fade-in duration-700 relative">
      
      {/* --- CUSTOM SUCCESS TOAST POPUP --- */}
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
            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">Your breathing session has been saved.</p>
          </div>
        </div>
      </div>
      {/* --------------------------------- */}

      <style>{`
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }

        .animate-heart-beat {
          animation: heart-beat 0.5s infinite ease-in-out;
        }

        .perfect-circle {
          border-radius: 9999px;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        @keyframes inhale-expand {
          from { transform: scale(1); }
          to { transform: scale(1.55); }
        }

        @keyframes exhale-shrink {
          from { transform: scale(1.55); }
          to { transform: scale(1); }
        }
      `}</style>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 items-start">
        <div className="xl:col-span-7 bg-white rounded-[32px] border border-[rgba(74,107,85,0.1)] p-4 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="text-center mb-8 ">
            <h2 className="font-serif italic text-[32px] leading-none sm:text-[48px] text-[#17201B] tracking-tight">
              Breath Therapy
            </h2>
            <p className="mt-3 text-[11px] sm:text-[12px] text-[#8A9A92] tracking-[0.18em] uppercase font-semibold">
              Relax • Reset • Restore
            </p>
          </div>

          {/* VISUALIZER CORE */}
          <div className="relative h-[320px] sm:h-[400px] flex items-center justify-center overflow-hidden">
            {/* HOLD WAVE */}
            {phase === 'Hold' && !isResting && isActive && (
              <div className="absolute w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-full border-[3px] border-[#7C9E87]/30 animate-heart-beat"></div>
            )}

            {/* MAIN CIRCLE */}
            <div
              onClick={() => {
                if (!isActive) {
                  setIsActive(true);
                  setPhase('Inhale');
                  setSeconds(1);
                  setIsResting(false);
                }
              }}
              className="relative z-10 flex items-center justify-center perfect-circle shadow-2xl overflow-hidden cursor-pointer"
              style={{
                width: window.innerWidth < 550 ? '110px' : '180px',
                height: window.innerWidth < 550 ? '110px' : '180px',
                background: phase === 'Inhale' || phase === 'Hold' ? 'rgba(124,158,135,0.40)' : 'rgba(255,255,255,1)',
                transition: phase === 'Exhale' ? 'background 6s linear' : 'background 4s linear',
                border: phase === 'Inhale' || phase === 'Hold' ? '2px solid rgba(124,158,135,0.3)' : '1px solid rgba(124,158,135,0.2)',
                animationName: phase === 'Inhale' ? 'inhale-expand' : phase === 'Exhale' ? 'exhale-shrink' : 'none',
                animationDuration: phase === 'Inhale' ? '4s' : '6s',
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
                animationPlayState: isActive ? 'running' : 'paused',
                transform: phase === 'Hold' ? 'scale(1.55)' : undefined
              }}
            >
              <div className="text-center">
                {/* TEXT */}
                <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.4em] text-[#4A6B55] font-black mb-1 sm:mb-2">
                  {!isActive ? 'READY' : isResting ? 'REST' : phase}
                </p>

                {/* COUNT */}
                <p className="font-serif text-5xl sm:text-7xl text-[#1A1F1C] select-none">
                  {(!isActive || phase === 'Ready') ? '' : isResting ? restCount : (
                    phase === 'Inhale'
                      ? (seconds === 0 ? 1 : seconds)
                      : phase === 'Hold'
                      ? (seconds - 4)
                      : (13 - seconds > 4 ? 4 : 13 - seconds)
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 font-sans">
            <div className="rounded-2xl bg-[#FAFAF8] border border-[rgba(124,158,135,0.06)] p-2 sm:p-4 text-center">
              <p className="font-serif text-lg sm:text-2xl text-[#1A1F1C] leading-none">{cycles}</p>
              <p className="mt-2 text-[9px] uppercase tracking-widest text-[#95A29A] font-bold">Cycles</p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF8] border border-[rgba(124,158,135,0.06)] p-2 sm:p-4 text-center">
              <p className="font-serif text-lg sm:text-2xl text-[#1A1F1C] leading-none">
                {Math.floor(sessionSeconds / 60)}:{String(sessionSeconds % 60).padStart(2, '0')}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-widest text-[#95A29A] font-bold">Time</p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF8] border border-[rgba(124,158,135,0.06)] p-2 sm:p-4 text-center">
              <p className="font-serif text-lg sm:text-2xl text-[#1A1F1C] leading-none">0{restCount}s</p>
              <p className="mt-2 text-[9px] uppercase tracking-widest text-[#95A29A] font-bold">Rest</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 font-sans w-full sm:w-auto sm:justify-center">
            <button
              onClick={() => setIsActive(prev => !prev)}
              className={`w-full sm:w-[220px] h-[60px] sm:h-[54px] rounded-2xl text-[12px] font-semibold tracking-[0.18em] transition-all duration-300 shadow-sm active:scale-[0.98] ${
                isActive ? 'bg-[#1A1F1C] text-white' : 'bg-[#7C9E87] text-white hover:bg-[#6A8874]'
              }`}
            >
              {isActive ? 'Pause' : (sessionSeconds > 0 ? 'Continue' : 'Start Session')}
            </button>

            <button
              onClick={stopSession}
              className="w-full sm:w-[220px] h-[60px] sm:h-[54px] rounded-2xl border border-[rgba(124,158,135,0.15)] bg-white text-[#4A6B55] text-[12px] font-semibold tracking-[0.18em] hover:bg-[#FAFAF8] transition-all"
            >
              End & Save
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="xl:col-span-5 space-y-6 min-w-0">
          
          {/* TIP CARD */}
          <div className="bg-white rounded-[32px] border border-sage-light/20 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <h3 className="text-[10px] font-black text-ink-muted uppercase tracking-widest">
                Breathing Tip
              </h3>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">{tip}</p>
          </div>

          {/* BENEFITS */}
          <div className="bg-white rounded-[32px] border border-sage-light/20 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-ink-muted uppercase tracking-widest mb-5">
              Benefits of Therapy
            </h3>
            <div className="space-y-4">
              {[
                'Regulates your nervous system naturally',
                'Helps lower stress and anxious thoughts',
                'Optimizes heart rate variability for resilience',
                'Enhances focus and breathing rhythm'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sage-pale flex items-center justify-center text-sage-dark text-[10px] mt-0.5 shrink-0">✓</div>
                  <p className="text-sm text-ink-soft leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SESSION HISTORY */}
          <div className="bg-white rounded-[32px] border border-sage-light/20 p-6 shadow-sm min-h-[240px] font-sans">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-ink-muted uppercase tracking-[0.2em] font-sans">
                Session History
              </h3>
              <span className="text-[10px] bg-sage-pale text-sage-dark px-3 py-1 rounded-full font-black uppercase tracking-tight font-sans">
                {history.length} Sessions
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar transition-all">
              {Array.isArray(history) && history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-sage-light/10 bg-paper animate-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-ink font-serif italic">{item.date}</p>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-sage-dark font-black font-sans">{item.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-ink-soft font-medium font-sans">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-sage"></span>
                        {item.cycles} Cycles
                      </span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[180px] flex items-center justify-center text-center">
                  <p className="text-sm text-ink-muted italic leading-relaxed max-w-[220px] font-sans">
                    Your completed breathing sessions will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}