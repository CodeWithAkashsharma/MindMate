
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sparkles, Brain, Lock, ArrowUpRight, Activity, Shield, ArrowLeft, Loader2, Check, AlertTriangle, X } from 'lucide-react';
import logoImg from '../assets/logo_image.png'
 
export default function Landing() {
  const navigate = useNavigate();

  // 🔥 Integrated System States
  const [activeFeature, setActiveFeature] = useState(0);
  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'register'
  
  // Form & Interaction States
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const features = [
    {
      id: 0,
      title: "Mental Sanctuary",
      tagline: "EMPATHETIC COMPANIONSHIP",
      desc: "An advanced, localized AI engine that securely parses structural language patterns to process private weekly logs.",
      color: "rgba(74, 107, 85, 0.28)", // Sage
      accent: "#4A6B55",
      headline: "The sanctuary for your inner pulse.",
      icon: <Brain size={20} className="text-[#4A6B55]" />,
      previewComponent: (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center bg-[#FAFAF8]/90 p-4 border border-[rgba(74,107,85,0.1)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E8C83]">Weekly Pulse Analysis</span>
            <span className="text-[10px] bg-[#4A6B55] text-white px-2 py-0.5 font-bold uppercase">AI Active</span>
          </div>
          <p className="font-serif italic text-sm text-[#5F6E64] leading-relaxed">
            "Your logs indicate a 14% elevation in cognitive rest following your evening breathing sequences. The correlation suggests optimization around minimalist wind-down routines."
          </p>
        </div>
      )
    },
    {
      id: 1,
      title: "Encrypted Solitude",
      tagline: "ZERO-KNOWLEDGE PRIVACY",
      desc: "Isolated data schemas mean your metric updates and journal logs remain strictly anchored to your instance layer.",
      color: "rgba(151, 138, 196, 0.28)", // Lavender
      accent: "#9B8EC4",
      headline: "Absolute isolation. True cryptographic rest.",
      icon: <Lock size={20} className="text-[#9B8EC4]" />,
      previewComponent: (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="p-4 bg-[#1A1F1C] text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono opacity-60">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AES-256 STRUCTURE ENGAGED
            </div>
            <div className="h-2 bg-white/10 w-full overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-[#9B8EC4] w-2/3 animate-[pulse_1.5s_infinite]" />
            </div>
            <p className="text-[11px] font-mono opacity-50 truncate">Hash: 8f9a2c3b4e5f6a7b8c9d0e1f2a3b4c5d</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Biometric Harmony",
      tagline: "VECTORS AND TRENDLINES",
      desc: "Synchronize sleep logs, daily habit checklists, and real productivity actions into a single fluid canvas metric engine.",
      color: "rgba(196, 132, 122, 0.25)", // Rose
      accent: "#C4847A",
      headline: "Align daily mechanics with emotional truth.",
      icon: <Activity size={20} className="text-[#C4847A]" />,
      previewComponent: (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sleep Goal</span>
              <span className="text-xl font-serif text-[#1A1F1C] mt-2">100%</span>
            </div>
            <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Tasks Done</span>
              <span className="text-xl font-serif text-[#C4847A] mt-2">12 / 12</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentAccent = features[activeFeature].accent;

  // -------------------------------------------------------------
  // 🔥 FULLY FUNCTIONAL BACKEND LOGIC
  // -------------------------------------------------------------
  
  const showPopup = (type, message) => {
    setToast({ show: true, type, message });
    if (type === 'success' && authView === 'register') {
      // Auto-switch to login view after successful registration
      setTimeout(() => setAuthView('login'), 2000);
    }
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API }/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
       
        navigate('/dashboard'); // Direct to dashboard upon success
      } else {
        showPopup('error', data.message || "Invalid Credentials. Please check your details.");
      }
    } catch (err) {
      showPopup('error', "Server offline. Please check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API }/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('success', "✨ Account created! Transferring to secure login...");
      } else {
        showPopup('error', data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      showPopup('error', "Server offline. Please check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER INTERFACE
  // -------------------------------------------------------------

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] overflow-hidden selection:bg-[#4A6B55] selection:text-white relative">
      
      {/* GLOBAL TOAST POPUP NOTIFICATION */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] ${toast.type === 'success' ? 'bg-[#1A1F1C] text-white border-sage/30' : 'bg-white text-ink border-rose-100'}`}>
          <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-[#4A6B55]/20 text-[#4A6B55]' : 'bg-red-50 text-red-500'}`}>
            {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          </div>
          <p className="text-sm font-medium tracking-wide">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      </div>

      <style>{`
        @keyframes slowGlow { 0%, 100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.65; transform: scale(1.06); } }
        @keyframes subtleFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes customDrift { 0% { transform: translateY(102vh) scale(0.5); opacity: 0; } 20% { opacity: 0.3; } 80% { opacity: 0.3; } 100% { transform: translateY(-10vh) scale(1.3); opacity: 0; } }
        .animate-slow-glow { animation: slowGlow 8s infinite ease-in-out; }
        .animate-subtle-float { animation: subtleFloat 5s infinite ease-in-out; }
        .telemetry-node { animation: customDrift cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-duration: ${isTyping ? '4s' : '12s'}; transition: animation-duration 0.5s ease; }
      `}</style>

      {/* ================= LEFT COLUMN ================= */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#111412] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] transition-all duration-1000 ease-in-out animate-slow-glow z-0" style={{ backgroundColor: features[activeFeature].color }} />
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full blur-[0.5px] telemetry-node" style={{ backgroundColor: currentAccent, left: (15 + (i * 10)) + '%', width: ((i % 3) + 2) + 'px', height: ((i % 3) + 2) + 'px', animationDelay: '-' + (i * 1.8) + 's' }} />
          ))}
        </div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSg2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />

        <div className="relative z-10 flex items-center gap-2">
          <Sparkles size={14} style={{ color: currentAccent }} className="transition-colors duration-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">System Telemetry Monitor</span>
        </div>

        <div className="relative z-10 my-auto space-y-10 animate-subtle-float">
          <h2 className="font-serif text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight transition-all duration-700">
            {authView === 'register' && formData.name ? (
              <>Your domain is ready, <span className="italic font-normal block mt-1 transition-all duration-500" style={{ color: currentAccent }}>{formData.name.split(' ')[0]}.</span></>
            ) : (
              features[activeFeature].headline.split('.').map((chunk, idx) => (
                <span key={idx} className={idx === 1 ? "italic font-normal block mt-1 transition-all duration-700" : "text-white"} style={{ color: idx === 1 ? currentAccent : '#fff' }}>{chunk}</span>
              ))
            )}
          </h2>

          <div className="bg-white/[0.02] border border-white/10 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl max-w-lg transition-all duration-500">
            {features[activeFeature].previewComponent}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <Shield size={12} style={{ color: currentAccent }} className="transition-colors duration-500" />
              <span>DB_CLUSTER // ATLAS_NODE_RESTRICTED</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <Activity size={12} style={{ color: currentAccent }} className="transition-colors duration-500" />
              <span>METRIC_STREAM // TIME_SERIES_ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500" style={{ backgroundColor: currentAccent }} />
          <span>Next-Gen Core Environment // v1.0 Operational</span>
        </div>
      </div>

      {/* ================= RIGHT COLUMN ================= */}
      <div className="col-span-1 lg:col-span-6 flex flex-col justify-between min-h-screen relative z-10 py-8 px-6 sm:px-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSg3NCwgMTA3LCA4NSwgMC4wMjkpIi8+PC9zdmc+')] opacity-60 pointer-events-none z-0" />

        {/* HEADER */}
        <header className="w-full flex justify-between items-center relative z-50">
          
 <img 
      src={logoImg} 
      alt="logo" 
      className="w-20 h-20 object-cover"
    />         

          {authView === 'landing' ? (
            <button onClick={() => setAuthView('login')} className="group relative flex items-center justify-center overflow-hidden rounded-full bg-white/60 backdrop-blur-md border border-[rgba(74,107,85,0.2)] px-6 py-2.5 shadow-sm transition-all duration-500 hover:shadow-md">
              <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10" />
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1F1C] group-hover:text-white transition-colors duration-500">
                <span>System Login</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          ) : (
            <button onClick={() => setAuthView('landing')} className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest text-[#5F6E64] hover:text-[#1A1F1C] uppercase transition-colors">
              <ArrowLeft size={14} /> Back To Main
            </button>
          )}
        </header>

        {/* VIEWPORT CONTROLLER */}
        <div className="flex-1 flex items-center justify-center relative my-8 w-full">

          {/* VIEW 1: LANDING */}
          {authView === 'landing' && (
            <div className="w-full max-w-xl space-y-10 text-left animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-4">
                <h1 className="font-serif text-5xl sm:text-6xl text-[#1A1F1C] tracking-tight leading-[1.1]">
                  MindMate Sanctuary.
                </h1>
                <p className="text-base text-[#5F6E64] font-medium leading-relaxed">
                  MindMate functions as a secure standalone telemetry ledger for monitoring personal cognitive balance, tracking mood behaviors, and reviewing encrypted analytical summaries.
                </p>
              </div>

              <div className="flex flex-col gap-3.5">
                {features.map((item) => {
                  const isSelected = activeFeature === item.id;
                  return (
                    <div key={item.id} onMouseEnter={() => setActiveFeature(item.id)} onClick={() => setActiveFeature(item.id)} className={`w-full p-5 text-left border transition-all duration-300 flex flex-col gap-2 cursor-pointer bg-white ${isSelected ? 'border-gray-200 shadow-xl translate-x-2' : 'border-transparent opacity-40 hover:opacity-75'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#F7F7F5] flex items-center justify-center border border-gray-100 transition-colors" style={{ borderColor: isSelected ? currentAccent : '#f3f4f6' }}>
                            {item.icon}
                          </div>
                          <h3 className="text-sm font-bold text-[#1A1F1C]">{item.title}</h3>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest transition-colors duration-300" style={{ color: isSelected ? currentAccent : '#A0ADA4' }}>
                          {item.tagline.split(' ')[0]}
                        </span>
                      </div>
                      {isSelected && <p className="text-xs text-[#5F6E64] font-medium leading-relaxed pl-12 animate-in fade-in duration-300">{item.desc}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button onClick={() => setAuthView('register')} className="inline-flex items-center justify-between gap-12 px-10 py-5 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:-translate-y-0.5 rounded-none group" style={{ backgroundColor: '#1A1F1C' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentAccent} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1F1C'}>
                  <span>UNLOCK ACCESS SYSTEM</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: FUNCTIONAL LOGIN */}
          {authView === 'login' && (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[rgba(74,107,85,0.2)] shadow-card w-full max-w-md animate-in fade-in zoom-in-95 duration-500 text-left transition-all duration-500" style={{ boxShadow: `0 30px 70px ${features[activeFeature].color}` }}>
              <div className="text-center mb-10">
                <h1 className="font-serif text-4xl text-[#1A1F1C] mb-2">Welcome Back</h1>
                <p className="text-[#5F6E64] italic text-sm">Continue your mindfulness journey.</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" required disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="px-6 py-4 rounded-2xl bg-[#FAFAF8] border border-[rgba(74,107,85,0.2)] focus:outline-none focus:bg-white transition-all duration-300 text-sm" onFocusCapture={(e) => e.currentTarget.style.borderColor = currentAccent} onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="name@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest ml-1">Password</label>
                  <input type="password" required disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="px-6 py-4 rounded-2xl bg-[#FAFAF8] border border-[rgba(74,107,85,0.2)] focus:outline-none focus:bg-white transition-all duration-300 text-sm" onFocusCapture={(e) => e.currentTarget.style.borderColor = currentAccent} onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" disabled={isLoading} className="mt-4 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg h-[56px] text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#1A1F1C' }} onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = currentAccent)} onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#1A1F1C')}>
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Log In"}
                </button>
              </form>
              <p className="text-center mt-8 text-sm text-[#5F6E64]">
                New to MindMate? <button onClick={() => setAuthView('register')} className="font-bold hover:underline ml-1 transition-colors" style={{ color: currentAccent }}>Create Account</button>
              </p>
            </div>
          )}

          {/* VIEW 3: FUNCTIONAL REGISTER */}
          {authView === 'register' && (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[rgba(74,107,85,0.2)] shadow-card w-full max-w-md animate-in fade-in zoom-in-95 duration-500 text-left transition-all duration-500" style={{ boxShadow: `0 30px 70px ${features[activeFeature].color}` }}>
              <div className="text-center mb-10">
                <h1 className="font-serif text-4xl text-[#1A1F1C] mb-2">Join MindMate</h1>
                <p className="text-[#5F6E64] italic text-sm">Your journey to mindfulness starts here.</p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" required disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="px-6 py-4 rounded-2xl bg-[#FAFAF8] border border-[rgba(74,107,85,0.2)] focus:outline-none focus:bg-white transition-all duration-300 text-sm" onFocusCapture={(e) => e.currentTarget.style.borderColor = currentAccent} onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="Alex Smith" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest ml-1">Email</label>
                  <input type="email" required disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="px-6 py-4 rounded-2xl bg-[#FAFAF8] border border-[rgba(74,107,85,0.2)] focus:outline-none focus:bg-white transition-all duration-300 text-sm" onFocusCapture={(e) => e.currentTarget.style.borderColor = currentAccent} onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="alex@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest ml-1">Password</label>
                  <input type="password" required disabled={isLoading} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} className="px-6 py-4 rounded-2xl bg-[#FAFAF8] border border-[rgba(74,107,85,0.2)] focus:outline-none focus:bg-white transition-all duration-300 text-sm" onFocusCapture={(e) => e.currentTarget.style.borderColor = currentAccent} onBlurCapture={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button type="submit" disabled={isLoading} className="mt-4 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg h-[56px] text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: currentAccent }}>
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Create Account"}
                </button>
              </form>
              <p className="text-center mt-8 text-sm text-[#5F6E64]">
                Already have an account? <button onClick={() => setAuthView('login')} className="text-black font-bold hover:underline ml-1 transition-colors">Log In</button>
              </p>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}