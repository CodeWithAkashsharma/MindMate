import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, AlertTriangle, X, Sparkles, Shield, Activity } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  const showPopup = (type, message) => {
    setToast({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setTimeout(() => setToast({ ...toast, show: false }), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API }/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('success', "✨ Account created! Let's get you logged in.");
      } else {
        showPopup('error', data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      showPopup('error', "Backend server not responding. Check your terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] overflow-hidden selection:bg-[#4A6B55] selection:text-white relative">
      
      {/* 1. KINETIC ANIMATIONS */}
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

      {/* --- CUSTOM POPUP (TOAST) --- */}
      <div 
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] ${
          toast.type === 'success' 
            ? 'bg-[#1A1F1C] text-white border-sage/30' 
            : 'bg-white text-ink border-rose-100'
        }`}>
          <div className={`p-2 rounded-full ${
            toast.type === 'success' ? 'bg-sage/20 text-sage' : 'bg-rose-50 text-rose-500'
          }`}>
            {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          </div>
          <p className="text-sm font-medium tracking-wide">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ================= LEFT COLUMN: THE ARTISTIC TELEMETRY PANEL ================= */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#111412] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        
        {/* Shifting Brand Ambient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] bg-[#4A6B55]/25 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#9B8EC4]/20 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2.5s' }} />
        
        {/* Fine Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAyIiBoZWlnaHQ9IjYwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNIDYwMCAwIEwgMCAwIDAgNjAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMTUpIi8+PC9zdmc+')] opacity-40 pointer-events-none" />

        {/* Top Branding Accent */}
        <div className="relative z-10 flex items-center gap-2">
          <Sparkles size={14} className="text-[#7C9E87]" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">SECURE INSTANCE LAYER</span>
        </div>

        {/* Center Floating Display Block */}
        <div className="relative z-10 space-y-6 my-auto animate-float-asset">
          <h2 className="font-serif text-4xl xl:text-5xl text-white leading-tight font-light">
            Begin your <br />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C9E87]">
              mindful sync.
            </span>
          </h2>
          <p className="text-xs text-[#7E8C83] max-w-sm leading-relaxed tracking-wide font-medium">
            Initialize an isolated cryptographic ledger instance. Allocate a local data node to chart behavior trendlines safely.
          </p>

          {/* Micro Telemetry Tags */}
          <div className="pt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              {/* FIXED: Removed the invalid hyphen from text-[#4A6B55] */}
              <Shield size={12} className="text-[#4A6B55]" />
              <span>DATA SCHEMA: ISOLATED MONGODB NODE</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
              {/* FIXED: Removed the invalid hyphen from text-[#9B8EC4] */}
              <Activity size={12} className="text-[#9B8EC4]" />
              <span>METRICS SYNC: LIVE BEHAVIOR LEDGER</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Node */}
        <div className="relative z-10 text-[9px] font-mono text-gray-600 tracking-widest uppercase">
          MINDMATE DEPLOYMENT ACTIVE_INSTANCE_V1.0
        </div>
      </div>

      {/* ================= RIGHT COLUMN: YOUR ORIGINAL FORM ================= */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center px-4 relative z-10 py-12">
        
        {/* Subtle decorative color bloom behind form for mobile layouts */}
        <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#7C9E87]/5 rounded-full blur-[80px] lg:hidden pointer-events-none" />

        {/* ORIGINAL REGISTER CARD ASSIGNED EXACT DIMS */}
        <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md bg-white animate-in fade-in zoom-in duration-500">
          
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-ink mb-2">Join MindMate</h1>
            <p className="text-ink-soft italic">Your journey to mindfulness starts here.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                disabled={loading}
                className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all disabled:opacity-50"
                placeholder="Alex Smith"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" 
                required
                disabled={loading}
                className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all disabled:opacity-50"
                placeholder="alex@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                required
                disabled={loading}
                className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all disabled:opacity-50"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-sage text-white py-4 rounded-2xl font-bold hover:bg-sage-dark transition-all active:scale-95 shadow-lg shadow-sage/10 bg-[#4A6B55] flex justify-center items-center h-[56px] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-ink-soft">
            Already have an account? <Link to="/login" className="text-ink font-bold hover:underline text-[#1A1F1C]">Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}