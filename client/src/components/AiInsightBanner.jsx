import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AiInsightBanner({ summary, isLoading }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-white border border-[#E1EBE4] shadow-sm mb-6 p-6 md:p-8 flex flex-col md:flex-row items-start gap-5 md:gap-6 transition-all duration-500 hover:shadow-md group">
      
      <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[200%] bg-gradient-to-r from-transparent via-[#4A6B55]/5 to-transparent animate-[spin_10s_linear_infinite] pointer-events-none" />

      <div className="relative z-10 w-12 h-12 min-w-[48px] rounded-2xl bg-gradient-to-br from-[#4A6B55] to-[#2E4234] flex items-center justify-center shadow-md shrink-0">
        <Sparkles size={20} className="text-white" />
      </div>

      <div className="relative z-10 flex-1 w-full pt-1">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-[11px] font-extrabold text-[#7E8C83] uppercase tracking-[0.2em] flex items-center gap-2">
            MindMate AI Synthesis
            {isLoading && <span className="w-1.5 h-1.5 bg-[#4A6B55] rounded-full animate-ping" />}
          </h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 mt-2 animate-pulse">
            <div className="h-3.5 bg-gray-100 rounded-md w-full"></div>
            <div className="h-3.5 bg-gray-100 rounded-md w-5/6"></div>
          </div>
        ) : summary ? (
          <div className="relative mt-2">
            <span className="absolute -left-3 -top-2 text-4xl text-[#4A6B55]/10 font-serif leading-none">"</span>
            <p className="text-[15px] sm:text-base text-[#2C3E35] font-medium leading-[1.8] tracking-wide animate-in fade-in duration-1000 relative z-10">
              {summary}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}