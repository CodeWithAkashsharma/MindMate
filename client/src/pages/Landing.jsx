import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/logo"

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Soft Background Blur Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sage/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lavender/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl text-center">
        <Logo />
        

        <h1 className="font-serif text-5xl md:text-7xl text-ink mb-6 tracking-tight">
          Your mind's <span className="italic text-sage-dark">safe space.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-ink-muted mb-12 max-w-2xl mx-auto leading-relaxed">
          Capture your thoughts, track your moods, and discover the patterns of your inner world with MindMate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/register" 
            className="px-10 py-4 bg-ink text-white rounded-full font-medium text-lg hover:bg-sage-dark transition-all duration-500 shadow-xl shadow-ink/10 hover:scale-105"
          >
            Start Journey
          </Link>
          
          <Link 
            to="/login" 
            className="px-10 py-4 bg-white border border-sage-light text-ink rounded-full font-medium text-lg hover:bg-sage-pale transition-all duration-500 hover:scale-105"
          >
            Welcome Back
          </Link>
        </div>

        {/* Feature Teaser */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🌿</span>
            <span className="text-xs uppercase tracking-widest font-black text-ink-muted">Private</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🔥</span>
            <span className="text-xs uppercase tracking-widest font-black text-ink-muted">Motivating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">✨</span>
            <span className="text-xs uppercase tracking-widest font-black text-ink-muted">AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;