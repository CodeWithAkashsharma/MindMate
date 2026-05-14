import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuickActionWidget() {
  const [quickActions, setQuickActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's specific actions on load
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Note: Change localhost:5000 to match your backend port if it's different
        const res = await axios.get('http://localhost:5000/api/quick-actions/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setQuickActions(res.data);
      } catch (err) {
        console.error("Failed to fetch quick actions", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, []);

const toggleAction = async (actionId) => {
    // 1. Optimistic UI Update: instantly move the item in the UI
    setQuickActions(prevActions => 
      prevActions.map(action => 
        // IMPORTANT: Use _id to match the database record
        action._id === actionId ? { ...action, done: !action.done } : action
      )
    );

    // 2. Persist the change to MongoDB
    try {
      const token = localStorage.getItem('token');
      // Ensure the URL correctly targets the toggle endpoint
      await axios.put(`http://localhost:5000/api/quick-actions/toggle/${actionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Database sync failed:", err);
      // Optional: Refresh the list if the database update fails
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface p-5 rounded-lg border border-sage-light/20 flex items-center justify-center min-h-[150px]">
        <div className="text-[10px] text-sage font-bold uppercase tracking-widest animate-pulse">
          Loading Actions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-lg border border-sage-light/20 shadow-card hover:border-sage-light/40 transition-all duration-500 relative overflow-hidden">
      
      <div className="absolute -top-16 right-0 w-48 h-48 bg-sage-pale/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#EEF6F1] to-white border border-[#D9E8DF] flex items-center justify-center shadow-[0_4px_12px_rgba(125,161,137,0.12)] overflow-hidden">
            <div className="absolute inset-0 bg-white/40 blur-md"></div>
            <span className="relative z-10 text-[18px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">🫧</span>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-ink leading-none">
              Quick Action
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-[10px] text-ink-muted italic leading-none">
                Mindful resets
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-sage-pale/40 border border-sage-light/20">
          <div className="w-1.5 h-1.5 rounded-sm bg-sage animate-pulse"></div>
          <span className="text-[10px] font-semibold text-sage-dark">
            {quickActions.filter(a => a.done).length}/{quickActions.length}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-start">
        
        {/* TO DO COLUMN */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 ml-1 mb-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-sage-light shadow-sm"></div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink font-semibold">
              To Do
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.filter(action => !action.done).map(action => (
              <button
                key={action._id}
                onClick={() => toggleAction(action._id)}
                className="group relative overflow-hidden h-[72px] rounded-lg bg-paper border border-sage-light/20 flex flex-col items-center justify-center gap-1.5 hover:border-sage/40 hover:bg-sage-pale/40 hover:-translate-y-[2px] hover:shadow-lg active:scale-[0.97] transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full"></div>
                
                <div className="relative z-10 w-9 h-9 rounded-lg bg-sage-pale flex items-center justify-center text-base transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {action.icon}
                </div>
                
                <span className="relative z-10 text-[10px] text-ink font-medium leading-none text-center px-1">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER DIVIDER (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center pt-12">
          <div className="relative flex flex-col items-center">
            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-sage-light/50"></div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sage-pale to-white border border-sage-light/30 shadow-md flex items-center justify-center text-sage-dark text-sm animate-pulse">
              ✦
            </div>
            <div className="w-[1px] h-10 bg-gradient-to-b from-sage-light/50 to-transparent"></div>
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 ml-1 mb-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-sage shadow-sm"></div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink font-semibold">
              Completed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.filter(action => action.done).map(action => (
              <button
                key={action._id}
                onClick={() => toggleAction(action._id)}
                className="group relative overflow-hidden h-[72px] rounded-lg bg-sage-pale/40 border border-sage-light/20 flex flex-col items-center justify-center gap-1.5 opacity-80 hover:opacity-100 hover:bg-sage-pale/60 hover:shadow-md active:scale-[0.97] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-sage text-white flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
                
                <span className="text-[10px] text-sage-dark font-medium leading-none line-through decoration-sage/40 text-center px-1">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}