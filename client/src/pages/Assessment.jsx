import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Check, ChevronRight, Info, 
  Lock, Calendar, TrendingDown, PhoneCall 
} from 'lucide-react';
import axios from 'axios'; 

export default function Assessment() {
  // --- State ---
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '', desc: '' });

  // --- Dynamic Clinical State ---
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [daysUntilNext, setDaysUntilNext] = useState(0);

  const [isDev, setIsDev] = useState(false); 

  useEffect(() => {
    const fetchHistoryAndProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // We fetch BOTH the history and the user profile live
        const [historyRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/assessment/history', { headers }),
          axios.get('http://localhost:5000/api/users/profile', { headers })
        ]);

        // 1. Check Dev Status DIRECTLY from the backend response
        if (profileRes.data && profileRes.data.isDev === true) {
          setIsDev(true);
        }

        // 2. Handle Assessment History & Lockout
        const responseData = historyRes.data;
        const savedHistory = Array.isArray(responseData) 
          ? responseData 
          : (Array.isArray(responseData?.history) ? responseData.history : []);
          
        setHistory(savedHistory);

        if (savedHistory.length > 0) {
          // Force sort the array to guarantee the NEWEST entry is at index [0]
          const sortedHistory = [...savedHistory].sort((a, b) => {
            const dateA = new Date(a.fullDate || a.createdAt || a.date);
            const dateB = new Date(b.fullDate || b.createdAt || b.date);
            return dateB - dateA; 
          });

          const newestEntry = sortedHistory[0];

          // Safely grab the date regardless of what Mongoose named it
          const dateString = newestEntry.fullDate || newestEntry.createdAt || newestEntry.date;
          
          if (dateString) {
            const lastDate = new Date(dateString);
            lastDate.setHours(0, 0, 0, 0);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 14) {
              setIsLocked(true);
              setDaysUntilNext(14 - diffDays);
            } else {
              setIsLocked(false);
            }
          } else {
            setIsLocked(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch assessment data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryAndProfile();
  }, []);



  // THE TRUE PHQ-9 QUESTIONS (All 9 Items)
  const questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure?",
    "Trouble concentrating on things, such as reading or watching TV?",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
    "Thoughts that you would be better off dead, or of hurting yourself in some way?"
  ];

  const options = [
    { label: 'Not at all', value: 0 },
    { label: 'Several days', value: 1 },
    { label: 'More than half the days', value: 2 },
    { label: 'Nearly every day', value: 3 }
  ];

  const handleSelect = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
    setIsSubmitted(false); 
  };

  const currentScore = isLocked && history.length > 0
    ? history[history.length - 1].score 
    : Object.values(answers).reduce((sum, val) => sum + val, 0);
    
  const isComplete = Object.keys(answers).length === questions.length;

  // CRISIS INTERVENTION LOGIC (Checks Q9, which is index 8)
  const activeAnswers = isLocked && history.length > 0 && history[history.length - 1].answers
    ? history[history.length - 1].answers
    : answers;
  
  // If user selected anything other than "Not at all" for the self-harm question
  const showCrisisAlert = activeAnswers && activeAnswers[8] > 0;

  const showToastMsg = (type, message, desc) => {
    setToast({ show: true, type, message, desc });
    setTimeout(() => setToast({ show: false, type: '', message: '', desc: '' }), 4000);
  };

  const handleCrisisAction = (type) => {
  // Logic to track that help was sought (important for clinical audit logs)
  console.log(`User initiated ${type} to 988 Helpline`);
  
  // Optional: Show a supportive toast while the phone app opens
  showToastMsg('success', 'Connecting...', 'Opening your phone app to reach support.');
};


  // --- 2. SAVE DATA TO BACKEND ---
  const handleSubmit = async () => {
    if (!isComplete) {
      showToastMsg('error', 'Incomplete Assessment', 'Please answer all questions before getting your analysis.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const today = new Date();
      
      const newEntry = {
        score: currentScore,
        fullDate: today.toISOString(),
        displayDate: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        answers: answers 
      };

      const res = await axios.post('http://localhost:5000/api/assessment/save', newEntry, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedHistory = [...history, res.data].slice(-6);
      setHistory(updatedHistory);

      setIsSubmitted(true);
      showToastMsg('success', 'Analysis Complete', 'Your wellness score has been calculated and saved.');
      
      setTimeout(() => {
        setIsLocked(true);
        setDaysUntilNext(14);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setAnswers({});
      }, 2000);

    } catch (err) {
      console.error("Failed to save assessment:", err);
      showToastMsg('error', 'Sync Failed', 'Could not save your assessment to the cloud.');
    }
  };

  // --- SCORE LOGIC & DYNAMIC COLORS ---
  const getScoreDetails = (score) => {
    if (score <= 4) return { 
      label: 'Minimal symptoms', 
      color: 'bg-[#F2F6F3] text-[#4A6B55]', 
      alert: 'Minimal symptoms detected. Keep prioritizing your daily mental well-being.',
      alertBox: 'bg-[#F2F6F3] border-[#DCE8E1]',
      alertText: 'text-[#4A6B55]',
      alertIcon: 'bg-[#4A6B55]'
    };
    if (score <= 9) return { 
      label: 'Mild symptoms', 
      color: 'bg-[#FFF9EA] text-[#B0812B]', 
      alert: 'Mild symptoms. Continue monitoring your feelings and consider self-care practices.',
      alertBox: 'bg-[#FFF9EA] border-[#F2DFAC]',
      alertText: 'text-[#B0812B]',
      alertIcon: 'bg-[#D4A72C]'
    };
    if (score <= 14) return { 
      label: 'Moderate Symptoms', 
      color: 'bg-[#FEF0F0] text-[#C75A5A]', 
      alert: 'Moderate symptoms. We strongly encourage speaking with a mental health professional.',
      alertBox: 'bg-[#FCF5F5] border-[#EAC2C2]',
      alertText: 'text-[#C75A5A]',
      alertIcon: 'bg-[#C75A5A]'
    };
    if (score <= 19) return { 
      label: 'Moderately Severe', 
      color: 'bg-[#FCE8E8] text-[#B93838]', 
      alert: 'Moderately severe symptoms. Please consult with a mental health professional for support.',
      alertBox: 'bg-[#FCE8E8] border-[#EFA6A6]',
      alertText: 'text-[#B93838]',
      alertIcon: 'bg-[#B93838]'
    };
    return { 
      label: 'Severe Symptoms', 
      color: 'bg-[#FCE8E8] text-[#962B2B]', 
      alert: 'Severe symptoms. Please seek immediate help from a mental health professional or doctor.',
      alertBox: 'bg-[#FCE8E8] border-[#962B2B]',
      alertText: 'text-[#962B2B]',
      alertIcon: 'bg-[#962B2B]'
    };
  };

  const scoreData = getScoreDetails(currentScore);
  const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-1000 relative">
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-[#4A6B55] font-semibold tracking-widest text-sm uppercase">Loading Secure Data...</div>
        </div>
      ) : (
        <>
          {/* --- DYNAMIC TOAST POPUP --- */}
          <div 
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${
              toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-[#1A1F1C] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-[#7C9E87]/30 min-w-[300px]">
              <div className={`p-2 rounded-full ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-[#7C9E87]/20 text-[#7C9E87]'}`}>
                {toast.type === 'error' ? <AlertTriangle size={18} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-white">{toast.message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">{toast.desc}</p>
              </div>
            </div>
          </div>

          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1F1C] italic tracking-tight">Wellness Check-in</h1>
              <p className="text-gray-500 text-sm mt-2">Track your mental well-being with clinically validated tools.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* --- LEFT COLUMN: DYNAMIC CONTENT --- */}
            <div className="xl:col-span-8 space-y-8">
              
              {isLocked ? (
                /* --- STATE 1: LOCKED CLINICAL VIEW --- */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
                  <div className="bg-[#F4F6F5] rounded-[40px] border border-[#7C9E87]/20 p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-[#7C9E87]/10 flex items-center justify-center shrink-0">
                      <Lock size={32} className="text-[#4A6B55]" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl font-serif text-[#1A1F1C] mb-2">You're all caught up.</h2>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-lg mb-6">
                        Clinical assessments like the PHQ-9 are designed to measure changes over a 14-day period. Taking it too frequently can skew your results. Your next check-in unlocks soon.
                      </p>
                      
                      <div className="inline-flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-[#7C9E87]/15 shadow-sm">
                        <Calendar size={18} className="text-[#4A6B55]" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Next Assessment In</p>
                          <p className="text-sm font-bold text-[#1A1F1C]">
                            {daysUntilNext} {daysUntilNext === 1 ? 'Day' : 'Days'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-[#7C9E87]/15 p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Symptom Trajectory</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">Your recent assessment scores</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-[#E8F0EA] flex items-center justify-center text-[#4A6B55]">
                        <TrendingDown size={20} />
                      </div>
                    </div>

                    {history.length > 0 ? (
                      <div className="flex items-end justify-start h-48 gap-4 px-2">
                        {history.map((entry, index) => {
                          const heightPercent = (entry.score / 27) * 100;
                          
                          let barColor = 'bg-[#7C9E87] hover:bg-[#6A8B74]'; 
                          if (entry.score >= 5) barColor = 'bg-[#D4A72C] hover:bg-[#B58E23]'; 
                          if (entry.score >= 10) barColor = 'bg-[#C75A5A] hover:bg-[#A84949]'; 
                          if (entry.score >= 15) barColor = 'bg-[#B93838] hover:bg-[#962B2B]'; 

                          return (
                            <div key={index} className="flex-1 h-full max-w-[80px] flex flex-col items-center justify-end gap-3 group">
                              <div className="w-full relative flex items-end h-full">
                                <div 
                                  style={{ height: `${Math.max(heightPercent, 5)}%` }} 
                                  className={`w-full rounded-t-xl transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-y-105 cursor-pointer ${barColor}`}
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1F1C] text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold tracking-wider">
                                    {entry.score}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                {entry.displayDate}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-gray-400 italic text-sm">
                        No history available yet.
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* --- STATE 2: ACTIVE QUESTIONNAIRE VIEW --- */
                <div className="bg-white rounded-[40px] border border-[#7C9E87]/15 p-6 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-8 animate-in fade-in duration-500">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <h2 className="text-xs font-black text-[#1A1F1C] uppercase tracking-[0.2em]">PHQ-9 Mental Health Screening</h2>
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Validated Assessment</span>
                  </div>

                  <div className="bg-[#FFF9EA] border border-[#F2DFAC] p-5 rounded-[20px] flex gap-4 items-start">
                    <AlertTriangle size={20} className="text-[#D4A72C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#8C6D1F] leading-relaxed">
                      <strong>This is a standardized screening tool only.</strong> It does not replace professional diagnosis. If concerned, please consult a mental health professional.
                    </p>
                  </div>

                  <div className="space-y-10">
                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-4">
                        <p className="text-[#1A1F1C] font-medium leading-relaxed">
                          <span className="text-gray-400 font-serif mr-2">{qIndex + 1}.</span>
                          Over the past 2 weeks, how often have you been bothered by: <strong className="font-semibold">{q}</strong>
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {options.map((opt) => {
                            const isSelected = answers[qIndex] === opt.value;
                            // Special styling for Question 9 to subtly warn
                            const isDangerSelect = qIndex === 8 && opt.value > 0 && isSelected;

                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleSelect(qIndex, opt.value)}
                                className={`py-3 px-4 rounded-xl border text-[11px] font-bold tracking-wide transition-all duration-300 ${
                                  isDangerSelect 
                                    ? 'bg-rose-600 text-white border-transparent shadow-md' 
                                  : isSelected 
                                    ? 'bg-[#1A1F1C] text-white border-transparent shadow-md' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#7C9E87]/50 hover:bg-[#F8F9F8]'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <button 
                      onClick={handleSubmit}
                      className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 ${
                        isComplete 
                          ? 'bg-[#4A6B55] text-white shadow-[0_8px_30px_rgba(74,107,85,0.25)] hover:bg-[#3A5543] hover:-translate-y-0.5' 
                          : 'bg-[#F4F6F5] text-gray-400 border border-gray-200'
                      }`}
                    >
                      Get Analysis
                      <ChevronRight size={16} className={isComplete ? "text-white/70" : "text-gray-300"} />
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* --- RIGHT COLUMN: RESULTS & INFO --- */}
            <div className="xl:col-span-4 space-y-6">
              
              <div className="bg-white rounded-[32px] border border-[#7C9E87]/15 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  {isLocked ? "Latest Results" : "Assessment Results"}
                </h3>
                
                {(!isSubmitted && !isLocked) ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-gray-400 font-medium">Complete the assessment to see your results here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className={`py-10 rounded-[24px] text-center ${scoreData.color}`}>
                      <p className="text-[64px] font-serif leading-none tracking-tight">{currentScore}</p>
                      <p className="text-sm font-semibold mt-3">{scoreData.label}</p>
                    </div>

                    {/* --- CRISIS INTERVENTION ALERT --- */}
                    {showCrisisAlert && (
                      <div className="p-5 rounded-[20px] bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-lg animate-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <AlertTriangle size={16} className="text-white" strokeWidth={3} />
                          </div>
                          <h4 className="font-bold tracking-wide text-sm">Crisis Support Available</h4>
                        </div>
                        <p className="text-[13px] text-rose-50 font-medium leading-relaxed mb-4">
                          Help is available right now. You can speak with a trained counselor anonymously.
                        </p>
                        
                        <div className="flex flex-col gap-2">
                          <a 
                            href="tel:988" 
                            onClick={() => handleCrisisAction('call')}
                            className="w-full py-3 bg-white text-rose-600 rounded-xl font-black uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95"
                          >
                            <PhoneCall size={14} /> Call 988
                          </a>
                          
                          <a 
                            href="sms:988" 
                            onClick={() => handleCrisisAction('text')}
                            className="w-full py-3 bg-rose-900/40 text-white rounded-xl font-black uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 hover:bg-rose-900/60 transition-all active:scale-95 border border-white/20"
                          >
                            <Info size={14} /> Text 988
                          </a>
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC ALERT BOX */}
                    {!showCrisisAlert && (
                      <div className={`flex items-center gap-3 p-4 rounded-[16px] border ${scoreData.alertBox}`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white shrink-0 ${scoreData.alertIcon}`}>
                          <Info size={12} strokeWidth={4} />
                        </div>
                        <p className={`text-[13px] font-medium leading-tight ${scoreData.alertText}`}>
                          {scoreData.alert}
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-400 font-bold tracking-wide mt-2">
                      Assessed: {isLocked && history.length > 0 ? history[history.length-1].displayDate : formattedDate}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[32px] border border-[#7C9E87]/15 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Understanding Your Score</h3>
                
                <div className="space-y-3">
                  <div className={`p-4 rounded-[16px] flex justify-between items-center transition-all ${
                    (isSubmitted || isLocked) && currentScore >= 0 && currentScore <= 4 
                      ? 'bg-[#E8F0EA] border border-[#7C9E87]/30 shadow-sm' 
                      : 'bg-[#F2F6F3] border border-transparent'
                  }`}>
                    <span className="text-sm font-serif font-bold text-[#4A6B55]">1–4</span>
                    <span className="text-[12px] font-medium text-[#4A6B55]">Minimal symptoms</span>
                  </div>

                  <div className={`p-4 rounded-[16px] flex justify-between items-center transition-all ${
                    (isSubmitted || isLocked) && currentScore >= 5 && currentScore <= 9 
                      ? 'bg-[#FFF6E5] border border-[#E5C182]/50 shadow-sm' 
                      : 'bg-[#FFF9EA] border border-transparent'
                  }`}>
                    <span className="text-sm font-serif font-bold text-[#B0812B]">5–9</span>
                    <span className="text-[12px] font-medium text-[#B0812B]">Mild symptoms</span>
                  </div>

                  <div className={`p-4 rounded-[16px] flex justify-between items-center transition-all ${
                    (isSubmitted || isLocked) && currentScore >= 10 && currentScore <= 14 
                      ? 'bg-[#FEF0F0] border border-[#EFA6A6]/80 shadow-sm ring-1 ring-[#EFA6A6]/30' 
                      : 'bg-[#FEF0F0] border border-transparent'
                  }`}>
                    <span className="text-sm font-serif font-bold text-[#C75A5A]">10–14</span>
                    <span className="text-[12px] font-medium text-[#C75A5A]">Moderate symptoms</span>
                  </div>

                  <div className={`p-4 rounded-[16px] flex justify-between items-center transition-all ${
                    (isSubmitted || isLocked) && currentScore >= 15 && currentScore <= 19
                      ? 'bg-[#FCE8E8] border border-[#EFA6A6] shadow-sm ring-1 ring-[#EFA6A6]' 
                      : 'bg-[#FCE8E8] border border-transparent'
                  }`}>
                    <span className="text-sm font-serif font-bold text-[#B93838]">15–19</span>
                    <span className="text-[12px] font-medium text-[#B93838]">Moderately severe</span>
                  </div>

                  <div className={`p-4 rounded-[16px] flex justify-between items-center transition-all ${
                    (isSubmitted || isLocked) && currentScore >= 20 
                      ? 'bg-[#FCE8E8] border border-[#962B2B] shadow-sm ring-1 ring-[#962B2B]' 
                      : 'bg-[#FCE8E8] border border-transparent'
                  }`}>
                    <span className="text-sm font-serif font-bold text-[#962B2B]">20–27</span>
                    <span className="text-[12px] font-medium text-[#962B2B]">Severe symptoms</span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {isDev && (
            <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-[#7C9E87]/20 z-[110] flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#4A6B55] uppercase tracking-widest">Developer Access</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Authorized Session</span>
              </div>
              <button 
                onClick={() => {
                  setIsLocked(!isLocked);
                  if (isLocked) setIsSubmitted(false);
                }}
                className="text-[10px] bg-[#1A1F1C] hover:bg-black px-4 py-2 rounded-xl font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-md"
              >
                {isLocked ? "Unlock Form" : "Lock Form"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}