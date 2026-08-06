import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, Smile, BookOpen, Brain, 
  BarChart2, Activity, RefreshCw, Moon, Zap
} from 'lucide-react';
import AiInsightBanner from '../components/AiInsightBanner';

export default function Insights() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [insightData, setInsightData] = useState({
    kpis: { avgMood: 0, journalConsistency: 0, meditationDays: 0 },
    moodTrend: [],
    wellnessBreakdown: [],
    habitImpacts: [],
    aiSummary: ""
  });

  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Fetch your main dashboard metrics
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API }/api/insights/weekly`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 2. Extract the unique User ID (Make sure your backend sends this!)
        const currentUserId = res.data.userId || "guest"; 
        
        // 3. Create completely user-specific key names
        const summaryKey = `cachedAiSummary_${currentUserId}`;
        const timeKey = `lastAiGeneration_${currentUserId}`;
        
        // 4. Read this specific user's saved data
        const savedSummary = localStorage.getItem(summaryKey);
        const lastGenTime = localStorage.getItem(timeKey);
        
        setInsightData({
          ...res.data,
          aiSummary: savedSummary || ""
        });
        setLoading(false);

        const timeSinceLastGen = lastGenTime ? (Date.now() - parseInt(lastGenTime)) : Infinity;
        
        // 5. Pass the custom keys down to the generator function
        if (timeSinceLastGen >= TWENTY_FOUR_HOURS_MS || !savedSummary) {
          autoGenerateSummary(res.data, token, summaryKey, timeKey);
        }

      } catch (err) {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

const autoGenerateSummary = async (freshData, token, summaryKey, timeKey) => {
    setIsGenerating(true);
    try {
      const productivity = freshData.wellnessBreakdown.find(b => b.label === "Productivity")?.score || 0;
      const sleep = freshData.wellnessBreakdown.find(b => b.label === "Sleep")?.score || 0;
      const mindfulness = freshData.wellnessBreakdown.find(b => b.label === "Mindfulness")?.score || 0;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_API }/api/insights/generate-ai`, {
        avgMood: freshData.kpis.avgMood,
        productivityScore: productivity,
        sleepScore: sleep,
        mindfulnessScore: mindfulness,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 👉 LOCKS IT TO THIS SPECIFIC USER ID
      localStorage.setItem(summaryKey, res.data.aiSummary);
      localStorage.setItem(timeKey, Date.now().toString()); 
      
      setInsightData(prev => ({ ...prev, aiSummary: res.data.aiSummary }));
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  const getMoodColor = (score) => {
    if (score === 0) return 'bg-gray-100'; 
    if (score >= 7) return 'bg-[#7A9D84]'; 
    if (score >= 5) return 'bg-[#9F94CA]'; 
    return 'bg-[#D28B8B]';                 
  };

  const getHabitIcon = (type) => {
    switch(type) {
      case 'sleep': return <Moon size={16} />;
      case 'exercise': return <Activity size={16} />;
      case 'journal': return <BookOpen size={16} />;
      case 'spark': return <Zap size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <RefreshCw className="animate-spin text-[#4A6B55]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700 space-y-6 relative min-h-screen pb-24">
      
      <div className="bg-gradient-to-r from-[#F0F5F2] to-[#F8FAFC] border border-[#E1EBE4] rounded-2xl p-4 flex items-center gap-3">
        <BarChart2 size={18} className="text-[#4A6B55]" />
        <p className="text-xs font-medium text-gray-600">
          AI-generated insights based on your 7-day activity data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-orange-100 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Smile size={20} className="text-orange-500" />
          </div>
          <h3 className="text-4xl font-serif text-[#1A1F1C] mb-1">{insightData.kpis.avgMood}</h3>
          <p className="text-xs text-gray-500 mb-0 transition-colors group-hover:text-gray-700">Avg Mood Score</p>
        </div>

        <div className="bg-white rounded-[24px] border border-gray-100 p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-blue-100 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
            <BookOpen size={20} className="text-blue-500" />
          </div>
          <h3 className="text-4xl font-serif text-[#1A1F1C] mb-1">{insightData.kpis.journalConsistency}%</h3>
          <p className="text-xs text-gray-500 mb-0 transition-colors group-hover:text-gray-700">Journal Consistency</p>
        </div>

        <div className="bg-white rounded-[24px] border border-gray-100 p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-amber-100 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Brain size={20} className="text-amber-500" />
          </div>
          <h3 className="text-4xl font-serif text-[#1A1F1C] mb-1">{insightData.kpis.meditationDays}<span className="text-2xl text-gray-400">/7</span></h3>
          <p className="text-xs text-gray-500 mb-0 transition-colors group-hover:text-gray-700">Meditation Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Mood Trend</h3>
          <div className="flex-1 flex items-end justify-between gap-2 h-40 pt-6">
            {insightData.moodTrend?.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-3 h-full group relative">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-10 flex flex-col items-center">
                  <div className="bg-[#1A1F1C] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    Score: {item.score}
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#1A1F1C]"></div>
                </div>
                <div 
                  className={`w-full rounded-md transition-all duration-300 group-hover:brightness-110 cursor-pointer ${getMoodColor(item.score)}`}
                  style={{ height: `${Math.max((item.score / 10) * 100, 5)}%` }}
                ></div>
                <span className="text-[10px] font-bold text-gray-400 shrink-0 group-hover:text-[#1A1F1C] transition-colors">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Wellness Score Breakdown</h3>
          <div className="space-y-4">
            {insightData.wellnessBreakdown?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-20 text-xs text-gray-500 font-medium group-hover:text-[#1A1F1C] transition-colors">{item.label}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.score >= 80 ? 'bg-[#7A9D84]' : 'bg-[#9F94CA]'} group-hover:brightness-110`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-xs font-bold text-[#1A1F1C] group-hover:scale-110 origin-right transition-transform">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <Activity size={14} className="text-[#4A6B55]" /> Key Habit Correlations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insightData.habitImpacts?.map((habit, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex gap-4 items-start hover:bg-white hover:border-[#7A9D84]/30 transition-colors">
              <div className="mt-1 p-2 bg-white rounded-lg shadow-sm text-[#4A6B55]">
                {getHabitIcon(habit.type)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1F1C] mb-1">{habit.title}</h4>
                <div className="text-sm font-black text-[#4A6B55] mb-1">{habit.impact}</div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{habit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AiInsightBanner 
         isLoading={isGenerating} 
         summary={insightData?.aiSummary} 
      />

    </div>
  );
}