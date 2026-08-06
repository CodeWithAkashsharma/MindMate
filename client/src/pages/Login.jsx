import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Activity, Shield } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API }/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userInfo', JSON.stringify(data.user)); 
        navigate('/dashboard');
      } else {
        setError(data.message || "Invalid Credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] overflow-hidden selection:bg-[#4A6B55] selection:text-white">
      
      {/* 1. KINETIC ANIMATIONS FOR THE COGNITIVE SPLIT CANVAS */}
      <style>{`
        @keyframes slowPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        @keyframes floatNode {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-glow-pulse { animation: slowPulse 7s infinite ease-in-out; }
        .animate-float-asset { animation: floatNode 6s infinite ease-in-out; }
      `}</style>

      {/* ================= LEFT COLUMN: THE ARTISTIC TELEMETRY PANEL ================= */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#111412] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        
        {/* Shifting Brand Ambient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-[#4A6B55]/25 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#9B8EC4]/20 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2.5s' }} />
        
        {/* Fine Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDUxLCA4NSwgMC4wMTUpIi9zdmc+')] opacity-40 pointer-events-none" />

        {/* Top Branding Accent */}
        <div className="relative z-10 flex items-center gap-2">
          <Sparkles size={14} className="text-[#7C9E87]" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">SECURE ACCESS CORE</span>
        </div>

        {/* Center Floating Display Block */}
        <div className="relative z-10 space-y-6 my-auto animate-float-asset">
          <h2 className="font-serif text-4xl xl:text-5xl text-white leading-tight font-light">
            Your space is <br />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C9E87]">
              ready for you.
            </span>
          </h2>
          <p className="text-xs text-[#7E8C83] max-w-sm leading-relaxed tracking-wide font-medium">
            System instance logs are isolated. Bypassing global cloud queues to map directly to your local database schemas.
          </p>

         {/* Micro Telemetry Tags */}
          <div className="pt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <Shield size={12} className="text-[#4A6B55]" />
             <span>NODE_ENV // PRODUCTION_HANDSHAKE_OK</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              <Activity size={12} className="text-[#9B8EC4]" />
              <span>METRIC_STREAM // TIME_SERIES_ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Node */}
        <div className="relative z-10 text-[9px] font-mono text-gray-600 tracking-widest uppercase">
          MINDMATE SECURITY 
        </div>
      </div>

      {/* ================= RIGHT COLUMN: YOUR ORIGINAL FORM ================= */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center px-4 relative z-10 py-12">
        
        {/* Subtle decorative color bloom behind form for mobile layouts */}
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#7C9E87]/5 rounded-full blur-[80px] lg:hidden pointer-events-none" />

        {/* YOUR ORIGINAL WARM CARD AXIS */}
        <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md bg-white">
          
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-ink mb-2">Welcome Back</h1>
            <p className="text-ink-soft italic">Continue your mindfulness journey.</p>
          </div>

          {/* Dynamic Error Messaging Box */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 text-center animate-in fade-in zoom-in-95 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                disabled={isLoading}
                className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all disabled:opacity-50"
                placeholder="name@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                required
                disabled={isLoading}
                className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all disabled:opacity-50"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 bg-ink text-paper py-4 rounded-2xl font-bold hover:bg-ink-mid transition-all active:scale-95 shadow-lg shadow-ink/10 flex justify-center items-center h-[56px] text-white bg-black disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-ink-soft">
            New to MindMate? <Link to="/register" className="text-sage font-bold hover:underline text-[#4A6B55]">Create Account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}