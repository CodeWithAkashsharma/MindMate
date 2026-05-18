import React, { useState } from 'react';
import { 
  Brain, Waves, Leaf, MessageCircle, Library, GraduationCap, 
  X, PlayCircle, BookOpen, Moon, Wind, PenTool, Activity, PhoneOff 
} from 'lucide-react';

export default function Resources() {
  // 1. STATE FOR THE MODAL
  const [selectedResource, setSelectedResource] = useState(null);

  // --- UPGRADED DATA: NOW INCLUDES VIDEOS AND FULL TEXT ---
  const wellnessResources = [
    {
      title: "Cognitive Behavioral Therapy",
      desc: "Evidence-based techniques to reframe negative thought patterns.",
      tag: "CBT",
      icon: <Brain size={20} className="text-pink-500" />,
      iconBg: "bg-pink-100/50",
      tagTheme: "bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]",
      type: "video",
      // Use YouTube Embed URLs!
      mediaUrl: "https://www.youtube.com/embed/9c_Bv_FBE-c", 
      fullText: "CBT is a form of psychological treatment that has been demonstrated to be effective for a range of problems including depression, anxiety disorders, alcohol and drug use problems, marital problems, and severe mental illness. In this introductory video, learn how your thoughts affect your feelings and behaviors."
    },
    {
      title: "Mindfulness-Based Stress Reduction",
      desc: "8-week program combining mindfulness and yoga.",
      tag: "MBSR",
      icon: <Leaf size={20} className="text-green-500" />,
      iconBg: "bg-green-100/50",
      tagTheme: "bg-[#FFF7ED] text-[#9A3412] border-[#FFEDD5]",
      type: "reading",
      mediaUrl: null, // No video, just reading
      fullText: "Developed by Jon Kabat-Zinn, MBSR uses a combination of mindfulness meditation, body awareness, and yoga to help people become more mindful. By practicing being present in the moment, you can drastically reduce your cortisol levels and stop panic attacks before they begin. Try starting with just 5 minutes of focused breathing today."
    },
    {
      title: "Talk Therapy Guide",
      desc: "How to find and work with a licensed therapist effectively.",
      tag: "Guide",
      icon: <MessageCircle size={20} className="text-purple-500" />,
      iconBg: "bg-purple-100/50",
      tagTheme: "bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]",
      type: "video",
     mediaUrl: "https://www.youtube.com/embed/eRe9_cS3luA",
      fullText: "Finding the right therapist is like finding the right pair of shoes—it might take a few tries. In this guide, we walk you through the differences between psychologists, psychiatrists, and counselors, and what questions you should ask in your first consultation."
    },
    {
      title: "Sleep Hygiene Masterclass",
      desc: "Optimize your environment and habits for deep, restorative sleep.",
      tag: "Sleep",
      icon: <Moon size={20} className="text-indigo-500" />,
      iconBg: "bg-indigo-100/50",
      tagTheme: "bg-[#EEF2FF] text-[#3730A3] border-[#E0E7FF]",
      type: "reading",
      mediaUrl: null,
      fullText: "Good sleep hygiene is essential for mental health. Start by keeping your bedroom temperature cool (around 65°F/18°C), blocking out all artificial light, and avoiding screens for at least 60 minutes before bed. Consistency is key: try to go to bed and wake up at the exact same time every day, even on weekends, to regulate your circadian rhythm."
    },
    {
      title: "Box Breathing Technique",
      desc: "A powerful stress-relief technique used by Navy SEALs.",
      tag: "Exercise",
      icon: <Wind size={20} className="text-sky-500" />,
      iconBg: "bg-sky-100/50",
      tagTheme: "bg-[#F0F9FF] text-[#075985] border-[#E0F2FE]",
      type: "video",
      mediaUrl: "https://www.youtube.com/embed/tEmt1Znux58",
      fullText: "Box breathing, also known as four-square breathing, involves exhaling to a count of four, holding your lungs empty for a count of four, inhaling at the same pace, and holding air in your lungs for a count of four before exhaling and beginning the pattern anew. Follow along with this visual guide to instantly lower your heart rate."
    },
    {
      title: "The Power of Journaling",
      desc: "How expressive writing can clear mental fog and process trauma.",
      tag: "Habits",
      icon: <PenTool size={20} className="text-amber-500" />,
      iconBg: "bg-amber-100/50",
      tagTheme: "bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]",
      type: "reading",
      mediaUrl: null,
      fullText: "You don't need to be a writer to benefit from journaling. 'Brain dumping' your anxieties onto a page effectively moves them out of your working memory, reducing cognitive load and anxiety. Try the 'Morning Pages' technique: writing three pages of stream-of-consciousness thought first thing in the morning to clear your mind for the day."
    },
    {
      title: "Understanding Anxiety Triggers",
      desc: "Learn the biology of panic and how to intercept it.",
      tag: "Science",
      icon: <Activity size={20} className="text-rose-500" />,
      iconBg: "bg-rose-100/50",
      tagTheme: "bg-[#FFF1F2] text-[#9F1239] border-[#FFE4E6]",
      type: "video",
      mediaUrl: "https://www.youtube.com/embed/ah4Hnrz3CDg",
      fullText: "Anxiety isn't just 'in your head'—it's a physiological response driven by your amygdala. In this educational video, discover the biological mechanics behind the 'Fight or Flight' response and learn grounded techniques to signal to your nervous system that you are safe."
    },
    {
      title: "Digital Detox Guide",
      desc: "Reclaim your attention span from addictive algorithms.",
      tag: "Focus",
      icon: <PhoneOff size={20} className="text-slate-500" />,
      tagTheme: "bg-[#F8FAFC] text-[#334155] border-[#F1F5F9]",
      type: "reading",
      mediaUrl: null,
      fullText: "Constant notifications keep our brains in a perpetual state of high-alert, spiking cortisol levels. A digital detox doesn't mean throwing your phone away; it means setting boundaries. Start by turning off all non-human notifications (like app alerts) and keeping your phone in a different room while you sleep."
    }
  ];

  const emergencyContacts = [
    { name: "iCall (TISS)", desc: "Mental health counselling", phone: "9152987821" },
    { name: "Vandrevala Foundation", desc: "24/7 helpline", phone: "1860-2662-345" },
    { name: "Sneha India", desc: "Suicide prevention", phone: "044-24640050" },
    { name: "NIMHANS", desc: "National mental health", phone: "080-46110007" }
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700 space-y-8 relative">
      
      {/* --- THE POPUP MODAL (Only shows if a resource is clicked) --- */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Modal Content Box */}
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
           <button 
              onClick={() => setSelectedResource(null)}
              // Switched to solid white, larger size (w-10), and stronger shadow for depth
              className="absolute top-5 right-5 z-20 w-10 h-10 bg-white text-ink rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-sage-pale hover:scale-105 transition-all duration-300 group border border-gray-100"
            >
              {/* Icon is larger and group-hover adds a premium spin animation */}
              <X size={20} strokeWidth={2.5} className="text-[#1A1F1C] transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* Video Player (If it's a video type) */}
            {selectedResource.type === 'video' && selectedResource.mediaUrl ? (
              <div className="w-full aspect-video bg-gray-900">
                <iframe 
                  className="w-full h-full"
                  src={selectedResource.mediaUrl} 
                  title={selectedResource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              /* Hero Image Placeholder for Reading materials */
              <div className="w-full h-48 bg-gradient-to-br from-sage-light/40 to-sage flex items-center justify-center">
                 {selectedResource.icon}
              </div>
            )}

            {/* Content Text Area */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${selectedResource.tagTheme}`}>
                  {selectedResource.tag}
                </span>
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  {selectedResource.type === 'video' ? <><PlayCircle size={12}/> Video Lesson</> : <><BookOpen size={12}/> Reading</>}
                </span>
              </div>
              
              <h2 className="text-2xl font-serif text-[#1A1F1C] mb-4">{selectedResource.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedResource.fullText}
              </p>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedResource(null)}
                className="mt-8 w-full py-3 bg-[#4A6B55] hover:bg-[#3A5543] text-white rounded-xl text-sm font-bold transition-colors"
              >
                Mark as Complete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 1. EDUCATIONAL RESOURCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {wellnessResources.map((resource, idx) => (
          <div 
            key={idx} 
            // 🔥 CLICK HANDLER ADDED HERE
            onClick={() => setSelectedResource(resource)} 
            className="bg-white rounded-[24px] border border-gray-100 p-6 flex items-start gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${resource.iconBg} group-hover:scale-105 transition-transform`}>
              {resource.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#1A1F1C] mb-1 group-hover:text-[#4A6B55] transition-colors">{resource.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{resource.desc}</p>
              
              <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${resource.tagTheme}`}>
                {resource.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CRISIS & EMERGENCY SECTION */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Crisis & Emergency Resources (India)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <a 
              key={idx} 
              // 🔥 CLICKING THIS OPENS THE PHONE DIALER
              href={`tel:${contact.phone.replace(/-/g, '')}`}
              className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 flex items-center justify-between group hover:bg-[#FEE2E2] hover:border-[#FCA5A5] transition-colors cursor-pointer"
            >
              <div>
                <h3 className="text-sm font-bold text-[#1A1F1C]">{contact.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{contact.desc}</p>
              </div>
              <div className="text-[#991B1B] font-mono font-medium tracking-wider text-sm sm:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                {contact.phone}
              </div>
            </a>
          ))}
        </div>
      </div>
      
    </div>
  );
}