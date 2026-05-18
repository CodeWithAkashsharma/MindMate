// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Logo from "../assets/logo"; 
// import { Sparkles, Brain, Lock, Eye, ArrowUpRight, Activity, Moon } from 'lucide-react';

// export default function Landing() {
//   // 🔥 Interactive Core State
//   const [activeFeature, setActiveFeature] = useState(0);

//   const features = [
//     {
//       id: 0,
//       title: "Mental Sanctuary",
//       tagline: "EMPATHETIC COMPANIONSHIP",
//       desc: "An advanced, localized AI engine that securely parses structural language patterns to process private weekly logs and reflect your emotional progression.",
//       color: "rgba(74, 107, 85, 0.25)", // Brand Sage Green
//       accent: "#4A6B55",
//       icon: <Brain size={20} className="text-[#4A6B55]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="flex justify-between items-center bg-[#FAFAF8]/80 p-4 border border-[rgba(74,107,85,0.1)]">
//             <span className="text-xs font-bold uppercase tracking-wider text-[#7E8C83]">Weekly Pulse Analysis</span>
//             <span className="text-[10px] bg-[#4A6B55] text-white px-2 py-0.5 font-bold uppercase">AI Active</span>
//           </div>
//           <p className="font-serif italic text-sm text-[#5F6E64] leading-relaxed">
//             "Your logs indicate a 14% elevation in cognitive rest following your evening breathing sequences. The correlation suggests optimization around minimalist wind-down routines."
//           </p>
//         </div>
//       )
//     },
//     {
//       id: 1,
//       title: "Encrypted Solitude",
//       tagline: "ZERO-KNOWLEDGE PRIVACY",
//       desc: "Isolated data schemas mean your metric updates, deep reflection blocks, and journal logs remain strictly anchored to your authenticated instance layer.",
//       color: "rgba(151, 138, 196, 0.25)", // Brand Lavender
//       accent: "#9B8EC4",
//       icon: <Lock size={20} className="text-[#9B8EC4]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="p-4 bg-[#1A1F1C] text-white space-y-3">
//             <div className="flex items-center gap-2 text-xs font-mono opacity-60">
//               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//               AES-256 STRUCTURE ENGAGED
//             </div>
//             <div className="h-2 bg-white/10 w-full overflow-hidden relative">
//               <div className="absolute top-0 bottom-0 left-0 bg-[#9B8EC4] w-2/3 animate-[pulse_1.5s_infinite]" />
//             </div>
//             <p className="text-[11px] font-mono opacity-50 truncate">Hash: 8f9a2c3b4e5f6a7b8c9d0e1f2a3b4c5d</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 2,
//       title: "Biometric Harmony",
//       tagline: "VECTORS AND TRENDLINES",
//       desc: "Synchronize sleep logs, daily habit checklists, and real productivity actions into a single fluid canvas metric engine that bypasses cluttered third-party tooling.",
//       color: "rgba(196, 132, 122, 0.22)", // Brand Terracotta/Rose
//       accent: "#C4847A",
//       icon: <Activity size={20} className="text-[#C4847A]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sleep Goal</span>
//               <span className="text-xl font-serif text-[#1A1F1C] mt-2">100%</span>
//             </div>
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Tasks Done</span>
//               <span className="text-xl font-serif text-[#C4847A] mt-2">12 / 12</span>
//             </div>
//           </div>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="relative min-h-screen bg-[#F7F7F5] flex flex-col overflow-hidden selection:bg-[#4A6B55] selection:text-white">
      
//       {/* ADVANCED EMBEDDED STYLES FOR CINEMATIC BACKDROP EFFECT */}
//       <style>{`
//         @keyframes fluidBackground {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.15); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .fluid-orb {
//           animation: fluidBackground 14s infinite alternate ease-in-out;
//         }
//       `}</style>

//       {/* 1. DYNAMIC RESPONSIVE CANVAS BACKGROUND */}
//       <div 
//         className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ease-in-out fluid-orb z-0"
//         style={{ backgroundColor: features[activeFeature].color }}
//       />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#A0ADA4]/10 rounded-full blur-[120px] pointer-events-none z-0" />
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSg3NCwgMTA3LCA4NSwgMC4wNikiLz48L3N2Zz4=')] opacity-80 pointer-events-none z-0" />

//       {/* 2. TOP STRIP NAVIGATION (UPGRADED) */}
//       <header className="relative  items-center z-30 w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 flex justify-between items-center">
        
//         {/* Strictly anchored left logo */}
//         <div className="flex justify-center relative xl:top-4">
//           <Logo />
//         </div>
        
//         {/* Premium Animated Login Pill */}
//         <Link 
//           to="/login" 
//           className="group relative flex  overflow-hidden rounded-full bg-white/40 backdrop-blur-md border border-[rgba(74,107,85,0.2)] px-6 py-2.5 shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#4A6B55]"
//         >
//           {/* Animated Background Fill */}
//           <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10" />
          
//           <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1F1C] group-hover:text-white transition-colors duration-500">
//             <span>System Login</span>
//             <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//           </div>
//         </Link>
//       </header>

//       {/* 3. ASYMMETRICAL MULTI-LAYER WORKSPACE */}
//       <main className="relative z-20 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center px-6 sm:px-12 flex-1 my-6 pb-12">
        
//         {/* LEFT CANVAS COLUMN: CINEMATIC WORDING */}
//         <div className="lg:col-span-6 space-y-8 text-left max-w-2xl ">
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[rgba(74,107,85,0.12)] shadow-sm rounded-none">
//             <Sparkles size={12} className="text-[#4A6B55]" />
//             <span className="text-[9px] font-bold text-[#6B7A70] uppercase tracking-[0.25em]">Next-Gen Telemetry Engine</span>
//           </div>

//           <h1 className="font-serif text-5xl sm:text-7xl xl:text-[5.4rem] text-[#1A1F1C] tracking-tight leading-[1.05]">
//             The sanctuary for your <span className="italic font-normal text-[#4A6B55] block sm:inline">inner pulse.</span>
//           </h1>

//           <p className="text-base sm:text-lg text-[#5F6E64] font-medium leading-relaxed max-w-xl">
//             MindMate functions as a secure standalone telemetry ledger for monitoring personal cognitive balance, tracking mood behaviors, and reviewing encrypted analytical summaries.
//           </p>

//           <div className="pt-4">
//             <Link 
//               to="/register"
//               className="inline-flex items-center justify-between gap-8 px-8 py-5 bg-[#1A1F1C] hover:bg-[#4A6B55] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:-translate-y-0.5 rounded-none group"
//             >
//               <span>UNLOCK ACCESS</span>
//               <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
//             </Link>
//           </div>
//         </div>

//         {/* RIGHT CANVAS COLUMN: PLAYGROUND REAL-TIME EXPERIMENTAL ENGINE */}
//         <div className="lg:col-span-6 w-full flex flex-col justify-center items-center">
//           <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl border border-white p-6 sm:p-8 shadow-[0_24px_70px_rgba(74,107,85,0.06)] rounded-4xl space-y-8">
            
//             {/* Header of Interactive Module */}
//             <div className="flex justify-between items-center border-b border-gray-100/80 pb-4">
//               <span className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest">Interactive Engine Preview</span>
            
//             </div>

//             {/* Dynamic Rendering Element Box */}
//             <div className="bg-white border border-gray-100/60 p-6 shadow-sm min-h-[140px] flex flex-col justify-center">
//               {features[activeFeature].previewComponent}
//             </div>

//             {/* Selector Interactive Track */}
//             <div className="flex flex-col gap-3">
//               {features.map((item) => {
//                 const isSelected = activeFeature === item.id;
//                 return (
//                   <button
//                     key={item.id}
//                     onMouseEnter={() => setActiveFeature(item.id)}
//                     onClick={() => setActiveFeature(item.id)}
//                     className={`w-full p-4 text-left border transition-all duration-300 flex items-center justify-between rounded-none ${
//                       isSelected 
//                         ? 'bg-white border-gray-200 shadow-md translate-x-1' 
//                         : 'bg-transparent border-transparent opacity-50 hover:opacity-80'
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-8 h-8 bg-[#F7F7F5] flex items-center justify-center border border-gray-100">
//                         {item.icon}
//                       </div>
//                       <div>
//                         <span className="block text-[9px] font-extrabold text-[#A0ADA4] tracking-widest uppercase leading-none mb-1">
//                           {item.tagline}
//                         </span>
//                         <h3 className="text-xs font-bold text-[#1A1F1C]">
//                           {item.title}
//                         </h3>
//                       </div>
//                     </div>
//                     <span 
//                       className="text-[10px] font-bold transition-all duration-300"
//                       style={{ color: isSelected ? item.accent : 'transparent' }}
//                     >
//                       {isSelected ? 'ACTIVE VIEW' : ''}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>

//           </div>
//         </div>
//       </main>

//       {/* FOOTER HAS BEEN COMPLETELY REMOVED FOR A CLEANER CANVAS */}
      
//     </div>
//   );
// }































































// grid landing page ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\\


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Logo from "../assets/logo"; 
// import { Sparkles, Brain, Lock, ArrowUpRight, Activity, Shield } from 'lucide-react';

// export default function Landing() {
//   // 🔥 Interactive Core State
//   const [activeFeature, setActiveFeature] = useState(0);

//   const features = [
//     {
//       id: 0,
//       title: "Mental Sanctuary",
//       tagline: "EMPATHETIC COMPANIONSHIP",
//       desc: "An advanced, localized AI engine that securely parses structural language patterns to process private weekly logs and reflect your emotional progression.",
//       color: "rgba(74, 107, 85, 0.25)", // Brand Sage Green
//       accent: "#4A6B55",
//       icon: <Brain size={20} className="text-[#4A6B55]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="flex justify-between items-center bg-[#FAFAF8]/80 p-4 border border-[rgba(74,107,85,0.1)]">
//             <span className="text-xs font-bold uppercase tracking-wider text-[#7E8C83]">Weekly Pulse Analysis</span>
//             <span className="text-[10px] bg-[#4A6B55] text-white px-2 py-0.5 font-bold uppercase">AI Active</span>
//           </div>
//           <p className="font-serif italic text-sm text-[#5F6E64] leading-relaxed">
//             "Your logs indicate a 14% elevation in cognitive rest following your evening breathing sequences. The correlation suggests optimization around minimalist wind-down routines."
//           </p>
//         </div>
//       )
//     },
//     {
//       id: 1,
//       title: "Encrypted Solitude",
//       tagline: "ZERO-KNOWLEDGE PRIVACY",
//       desc: "Isolated data schemas mean your metric updates, deep reflection blocks, and journal logs remain strictly anchored to your authenticated instance layer.",
//       color: "rgba(151, 138, 196, 0.25)", // Brand Lavender
//       accent: "#9B8EC4",
//       icon: <Lock size={20} className="text-[#9B8EC4]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="p-4 bg-[#1A1F1C] text-white space-y-3">
//             <div className="flex items-center gap-2 text-xs font-mono opacity-60">
//               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//               AES-256 STRUCTURE ENGAGED
//             </div>
//             <div className="h-2 bg-white/10 w-full overflow-hidden relative">
//               <div className="absolute top-0 bottom-0 left-0 bg-[#9B8EC4] w-2/3 animate-[pulse_1.5s_infinite]" />
//             </div>
//             <p className="text-[11px] font-mono opacity-50 truncate">Hash: 8f9a2c3b4e5f6a7b8c9d0e1f2a3b4c5d</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 2,
//       title: "Biometric Harmony",
//       tagline: "VECTORS AND TRENDLINES",
//       desc: "Synchronize sleep logs, daily habit checklists, and real productivity actions into a single fluid canvas metric engine that bypasses cluttered third-party tooling.",
//       color: "rgba(196, 132, 122, 0.22)", // Brand Terracotta/Rose
//       accent: "#C4847A",
//       icon: <Activity size={20} className="text-[#C4847A]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sleep Goal</span>
//               <span className="text-xl font-serif text-[#1A1F1C] mt-2">100%</span>
//             </div>
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Tasks Done</span>
//               <span className="text-xl font-serif text-[#C4847A] mt-2">12 / 12</span>
//             </div>
//           </div>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] overflow-hidden selection:bg-[#4A6B55] selection:text-white">
      
//       {/* 1. KEYFRAME ANIMATIONS FOR CORE BACKDROP BLEND */}
//       <style>{`
//         @keyframes slowPulse {
//           0%, 100% { opacity: 0.25; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.06); }
//         }
//         @keyframes floatNode {
//           0% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-12px) rotate(1.5deg); }
//           100% { transform: translateY(0px) rotate(0deg); }
//         }
//         .animate-glow-pulse { animation: slowPulse 8s infinite ease-in-out; }
//         .animate-float-asset { animation: floatNode 6s infinite ease-in-out; }
//       `}</style>

//       {/* ================= LEFT COLUMN: THE CRYPTO ENGINE BLOCKED PANEL ================= */}
//       <div className="hidden lg:flex lg:col-span-5 bg-[#111412] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        
//         {/* Shifting Brand Ambient Orbs (Tied into global active state color rules) */}
//         <div 
//           className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[110px] transition-all duration-1000 ease-in-out animate-glow-pulse" 
//           style={{ backgroundColor: features[activeFeature].color }}
//         />
//         <div className="absolute bottom-[-10%] left-[-10%] w-[25vw] h-[25vw] bg-[#A0ADA4]/5 rounded-full blur-[90px] pointer-events-none" />
        
//         {/* Grid Overlay Asset */}
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSg2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxNSkiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

//         {/* Top Header Identity Brand */}
//         <div className="relative z-10 flex items-center gap-2">
//           <Sparkles size={14} className="text-[#7C9E87]" />
//           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">SYSTEM METRICS TERMINAL</span>
//         </div>

//         {/* Dynamic Descriptive Block */}
//         <div className="relative z-10 space-y-6 my-auto animate-float-asset">
//           <h2 className="font-serif text-4xl xl:text-5xl text-white leading-tight font-light">
//             Engineered for <br />
//             <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C9E87]">
//               deep perspective.
//             </span>
//           </h2>
//           <p className="text-xs text-[#7E8C83] max-w-sm leading-relaxed tracking-wide font-medium">
//             Review live client-side telemetry profiles. Hover down through the control vectors below to inspect active instance modules instantly.
//           </p>

//           {/* Active Structural Real-time Handshakes */}
//           <div className="pt-4 flex flex-col gap-2.5">
//             <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
//               <Shield size={12} className="text-[#4A6B55]" />
//               <span>DB_CLUSTER // ATLAS_NODE_RESTRICTED</span>
//             </div>
//             <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
//               <Activity size={12} className="text-[#9B8EC4]" />
//               <span>METRIC_STREAM // TIME_SERIES_ACTIVE</span>
//             </div>
//           </div>
//         </div>

//         {/* Static Footer Accent */}
//         <div className="relative z-10 text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center gap-2">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B55] animate-pulse" />
//           <span>ENVIRONMENT // PROD_INSTANCE_V1.0</span>
//         </div>
//       </div>

//       {/* ================= RIGHT COLUMN: COMPLETE BRAND WORKSPACE INTERFACE ================= */}
//       <div className="col-span-1 lg:col-span-7 flex flex-col justify-between min-h-screen relative z-10">
        
//         {/* Subtle decorative canvas layout background vectors for mobile tiers */}
//         <div className="absolute top-[10%] right-[5%] w-[50vw] h-[50vw] bg-[#A0ADA4]/5 rounded-full blur-[100px] lg:hidden pointer-events-none" />
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSg3NCwgMTA3LCA4NSwgMC4wNCkiLz48L3N2Zz4=')] opacity-70 pointer-events-none" />

//         {/* A. NAV STRIP HEADER (Vertically Centered & Strictly Anchored) */}
//         <header className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8 flex justify-between items-center relative z-30">
//           <div className="flex items-center justify-start self-center h-full py-2">
//             <Logo />
//           </div>
          
//           {/* Liquified Sliding Fill Premium Login Pill */}
//           <Link 
//             to="/login" 
//             className="group relative flex items-center justify-center overflow-hidden rounded-full bg-white/50 backdrop-blur-md border border-[rgba(74,107,85,0.2)] px-6 py-2.5 shadow-sm transition-all duration-500 hover:shadow-md hover:border-[#4A6B55]"
//           >
//             <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10" />
//             <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1F1C] group-hover:text-white transition-colors duration-500">
//               <span>System Login</span>
//               <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//             </div>
//           </Link>
//         </header>

//         {/* B. MIDDLE LAYOUT GRID: ASYMMETRICAL WRITTEN WORKSPACE */}
//         <main className="w-full max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-6 items-center px-6 sm:px-12 flex-1 py-6">
          
//           {/* TEXT DESCRIPTION HALF */}
//           <div className="xl:col-span-6 space-y-8 text-left max-w-xl">
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[rgba(74,107,85,0.12)] shadow-sm rounded-none">
//               <Sparkles size={12} className="text-[#4A6B55]" />
//               <span className="text-[9px] font-bold text-[#6B7A70] uppercase tracking-[0.25em]">Next-Gen Telemetry Engine</span>
//             </div>

//             <h1 className="font-serif text-5xl sm:text-6xl xl:text-[4.8rem] text-[#1A1F1C] tracking-tight leading-[1.08]">
//               The sanctuary for your <span className="italic font-normal text-[#4A6B55] block sm:inline">inner pulse.</span>
//             </h1>

//             <p className="text-base text-[#5F6E64] font-medium leading-relaxed">
//               MindMate functions as a secure standalone telemetry ledger for monitoring personal cognitive balance, tracking mood behaviors, and reviewing encrypted analytical summaries.
//             </p>

//             <div className="pt-4">
//               <Link 
//                 to="/register"
//                 className="inline-flex items-center justify-between gap-8 px-8 py-5 bg-[#1A1F1C] hover:bg-[#4A6B55] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:-translate-y-0.5 rounded-none group"
//               >
//                 <span>UNLOCK ACCESS</span>
//                 <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
//               </Link>
//             </div>
//           </div>

//           {/* DYNAMIC REAL-TIME ENGINE PLAYGROUND HALF */}
//           <div className="xl:col-span-6 w-full flex flex-col justify-center items-center">
//             <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl border border-white p-6 sm:p-8 shadow-[0_24px_70px_rgba(74,107,85,0.06)] rounded-4xl space-y-8">
              
//               <div className="flex justify-between items-center border-b border-gray-100/80 pb-4">
//                 <span className="text-[10px] font-bold text-[#A0ADA4] uppercase tracking-widest">Interactive Engine Preview</span>
//                 <div className="flex gap-1.5">
//                   <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
//                   <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
//                   <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
//                 </div>
//               </div>

//               {/* Dynamic Rendering Output Screen */}
//               <div className="bg-white border border-gray-100/60 p-6 shadow-sm min-h-[150px] flex flex-col justify-center">
//                 {features[activeFeature].previewComponent}
//               </div>

//               {/* Selector Track Layer */}
//               <div className="flex flex-col gap-3">
//                 {features.map((item) => {
//                   const isSelected = activeFeature === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       onMouseEnter={() => setActiveFeature(item.id)}
//                       onClick={() => setActiveFeature(item.id)}
//                       className={`w-full p-4 text-left border transition-all duration-300 flex items-center justify-between rounded-none ${
//                         isSelected 
//                           ? 'bg-white border-gray-200 shadow-md translate-x-1' 
//                           : 'bg-transparent border-transparent opacity-50 hover:opacity-80'
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-8 h-8 bg-[#F7F7F5] flex items-center justify-center border border-gray-100">
//                           {item.icon}
//                         </div>
//                         <div>
//                           <span className="block text-[9px] font-extrabold text-[#A0ADA4] tracking-widest uppercase leading-none mb-1">
//                             {item.tagline}
//                           </span>
//                           <h3 className="text-xs font-bold text-[#1A1F1C]">
//                             {item.title}
//                           </h3>
//                         </div>
//                       </div>
//                       <span 
//                         className="text-[10px] font-bold transition-all duration-300"
//                         style={{ color: isSelected ? item.accent : 'transparent' }}
//                       >
//                         {isSelected ? 'ACTIVE VIEW' : ''}
//                     </span>
//                     </button>
//                   );
//                 })}
//               </div>

//             </div>
//           </div>
//         </main>

//         {/* Empty layout bottom pad placeholder keeping height equations uniform with zero footer clutter */}
//         <div className="py-4 invisible" />
//       </div>

//     </div>
//   );
// }




// 3rd option---------------------------------------------------------------------------------------


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Logo from "../assets/logo"; 
// import { Sparkles, Brain, Lock, ArrowUpRight, Activity, Shield, UserCircle, ArrowLeft } from 'lucide-react';

// export default function Landing() {
//   // 🔥 Interactive Core Screen Triggers
//   const [activeFeature, setActiveFeature] = useState(0);
//   const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'register'
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);

//   const features = [
//     {
//       id: 0,
//       title: "Mental Sanctuary",
//       tagline: "EMPATHETIC COMPANIONSHIP",
//       desc: "An advanced, localized AI engine that securely parses structural language patterns to process private weekly logs.",
//       color: "rgba(74, 107, 85, 0.25)", // Sage Green
//       accent: "#4A6B55",
//       headline: "The sanctuary for your inner pulse.",
//       icon: <Brain size={20} className="text-[#4A6B55]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="flex justify-between items-center bg-[#FAFAF8]/90 p-4 border border-[rgba(74,107,85,0.1)]">
//             <span className="text-xs font-bold uppercase tracking-wider text-[#7E8C83]">Weekly Pulse Analysis</span>
//             <span className="text-[10px] bg-[#4A6B55] text-white px-2 py-0.5 font-bold uppercase">AI Active</span>
//           </div>
//           <p className="font-serif italic text-sm text-[#5F6E64] leading-relaxed">
//             "Your logs indicate a 14% elevation in cognitive rest following your evening breathing sequences. The correlation suggests optimization around minimalist wind-down routines."
//           </p>
//         </div>
//       )
//     },
//     {
//       id: 1,
//       title: "Encrypted Solitude",
//       tagline: "ZERO-KNOWLEDGE PRIVACY",
//       desc: "Isolated data schemas mean your metric updates and journal logs remain strictly anchored to your instance layer.",
//       color: "rgba(151, 138, 196, 0.25)", // Lavender
//       accent: "#9B8EC4",
//       headline: "Absolute isolation. True cryptographic rest.",
//       icon: <Lock size={20} className="text-[#9B8EC4]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="p-4 bg-[#1A1F1C] text-white space-y-3">
//             <div className="flex items-center gap-2 text-xs font-mono opacity-60">
//               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
//               AES-256 STRUCTURE ENGAGED
//             </div>
//             <div className="h-2 bg-white/10 w-full overflow-hidden relative">
//               <div className="absolute top-0 bottom-0 left-0 bg-[#9B8EC4] w-2/3 animate-[pulse_1.5s_infinite]" />
//             </div>
//             <p className="text-[11px] font-mono opacity-50 truncate">Hash: 8f9a2c3b4e5f6a7b8c9d0e1f2a3b4c5d</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 2,
//       title: "Biometric Harmony",
//       tagline: "VECTORS AND TRENDLINES",
//       desc: "Synchronize sleep logs, daily habit checklists, and real productivity actions into a single fluid canvas metric engine.",
//       color: "rgba(196, 132, 122, 0.22)", // Rose
//       accent: "#C4847A",
//       headline: "Align daily mechanics with emotional truth.",
//       icon: <Activity size={20} className="text-[#C4847A]" />,
//       previewComponent: (
//         <div className="space-y-4 animate-in fade-in duration-500">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sleep Goal</span>
//               <span className="text-xl font-serif text-[#1A1F1C] mt-2">100%</span>
//             </div>
//             <div className="bg-white border border-gray-100 p-3 flex flex-col justify-between">
//               <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Tasks Done</span>
//               <span className="text-xl font-serif text-[#C4847A] mt-2">12 / 12</span>
//             </div>
//           </div>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F7F5] overflow-hidden selection:bg-[#4A6B55] selection:text-white relative">
      
//       {/* 1. CINEMATIC HORIZON STYLE SCRIPTS */}
//       <style>{`
//         @keyframes slowGlow {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 0.6; transform: scale(1.08); }
//         }
//         @keyframes subtleFloat {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-slow-glow { animation: slowGlow 8s infinite ease-in-out; }
//         .animate-subtle-float { animation: subtleFloat 6s infinite ease-in-out; }
//       `}</style>

//       {/* ================= LEFT HALF: THE DYNAMIC LIVE HORIZON CANVAS ================= */}
//       <div className="hidden lg:flex lg:col-span-6 bg-[#111412] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        
//         {/* Intuitively shifting color orbs pinned directly to feature selection */}
//         <div 
//           className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] transition-all duration-1000 ease-in-out animate-slow-glow z-0" 
//           style={{ backgroundColor: features[activeFeature].color }}
//         />
//         <div className="absolute bottom-[-15%] left-[-10%] w-[30vw] h-[30vw] bg-[#A0ADA4]/5 rounded-full blur-[100px] pointer-events-none z-0" />
        
//         {/* High-End Grid Blueprint Mapping */}
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSg2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxNSkiLz48L3N2Zz4=')] opacity-25 pointer-events-none z-0" />

//         {/* System ID Header Tag */}
//         <div className="relative z-10 flex items-center gap-2">
//           <Sparkles size={14} className="text-[#7C9E87]" />
//           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">System Telemetry Monitor</span>
//         </div>

//         {/* Morphing Kinetic Display Node */}
//         <div className="relative z-10 my-auto space-y-10 animate-subtle-float">
          
//           {/* Headline matches the hovered feature card instantly */}
//           <h2 className="font-serif text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight transition-all duration-700">
//             {features[activeFeature].headline.split('.').map((chunk, idx) => (
//               <span key={idx} className={idx === 1 ? "italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C9E87] block mt-1" : "text-white"}>
//                 {chunk}
//               </span>
//             ))}
//           </h2>

//           {/* Centered Embedded Mini Sandbox Display Frame */}
//           <div className="bg-white/[0.02] border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl max-w-lg">
//             {features[activeFeature].previewComponent}
//           </div>

//           {/* Active Framework Mapping Codes */}
//           <div className="flex flex-col gap-2.5 pt-2">
//             <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
//               <Shield size={12} className="text-[#4A6B55]" />
//               <span>DB_CLUSTER // ATLAS_NODE_RESTRICTED</span>
//             </div>
//             <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
//               <Activity size={12} className="text-[#9B8EC4]" />
//               <span>METRIC_STREAM // TIME_SERIES_ACTIVE</span>
//             </div>
//           </div>
//         </div>

//         {/* System Status Footer Stamp */}
//         <div className="relative z-10 text-[9px] font-mono text-gray-500 tracking-widest uppercase flex items-center gap-2">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B55] animate-pulse" />
//           <span>Next-Gen Core Environment // v1.0 Operational</span>
//         </div>
//       </div>

//       {/* ================= RIGHT HALF: FLUID INTERACTION INTERFACE ================= */}
//       <div className="col-span-1 lg:col-span-6 flex flex-col justify-between min-h-screen relative z-10 py-8 px-6 sm:px-12">
        
//         {/* Subtle dot-matrix overlay background structure */}
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSg3NCwgMTA3LCA4NSwgMC4wMjkpIi8+PC9zdmc+')] opacity-60 pointer-events-none z-0" />

//         {/* A. NAV STRIP HEADER */}
//         <header className="w-full flex justify-between items-center relative z-50">
//           <div className="flex items-center justify-start self-center h-full py-2">
//             <Logo />
//           </div>

//           {authView === 'landing' ? (
//             <button 
//               onClick={() => setAuthView('login')}
//               className="group relative flex items-center justify-center overflow-hidden rounded-full bg-white/60 backdrop-blur-md border border-[rgba(74,107,85,0.2)] px-6 py-2.5 shadow-sm transition-all duration-500 hover:shadow-md"
//             >
//               <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10" />
//               <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1F1C] group-hover:text-white transition-colors duration-500">
//                 <span>System Login</span>
//                 <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//               </div>
//             </button>
//           ) : (
//             <button 
//               onClick={() => setAuthView('landing')}
//               className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest text-[#5F6E64] hover:text-[#1A1F1C] uppercase transition-colors"
//             >
//               <ArrowLeft size={14} /> Back To Main
//             </button>
//           )}
//         </header>

//         {/* B. CENTRAL ACTION VIEWPORT TRACKER */}
//         <div className="flex-1 flex items-center justify-center relative my-8 w-full">

//           {/* VIEW 1: DYNAMIC LANDING PLATFORM */}
//           {authView === 'landing' && (
//             <div className="w-full max-w-xl space-y-10 text-left animate-in fade-in slide-in-from-right-8 duration-500">
//               <div className="space-y-4">
//                 <h1 className="font-serif text-5xl sm:text-6xl text-[#1A1F1C] tracking-tight leading-[1.1]">
//                   MindMate Sanctuary.
//                 </h1>
//                 <p className="text-base text-[#5F6E64] font-medium leading-relaxed">
//                   MindMate functions as a secure standalone telemetry ledger for monitoring personal cognitive balance, tracking mood behaviors, and reviewing encrypted analytical summaries.
//                 </p>
//               </div>

//               {/* Dynamic Selector Track Area */}
//               <div className="flex flex-col gap-3.5">
//                 {features.map((item) => {
//                   const isSelected = activeFeature === item.id;
//                   return (
//                     <div
//                       key={item.id}
//                       onMouseEnter={() => setActiveFeature(item.id)}
//                       onClick={() => setActiveFeature(item.id)}
//                       className={`w-full p-5 text-left border transition-all duration-300 flex flex-col gap-2 cursor-pointer bg-white ${
//                         isSelected 
//                           ? 'border-gray-200 shadow-xl translate-x-2' 
//                           : 'border-transparent opacity-40 hover:opacity-75'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 bg-[#F7F7F5] flex items-center justify-center border border-gray-100">
//                             {item.icon}
//                           </div>
//                           <h3 className="text-sm font-bold text-[#1A1F1C]">{item.title}</h3>
//                         </div>
//                         <span className="text-[9px] font-black uppercase tracking-widest text-[#A0ADA4]">
//                           {item.tagline.split(' ')[0]}
//                         </span>
//                       </div>
//                       {isSelected && (
//                         <p className="text-xs text-[#5F6E64] font-medium leading-relaxed pl-12 animate-in fade-in duration-300">
//                           {item.desc}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Central Trigger Action CTA */}
//               <div className="pt-2">
//                 <button 
//                   onClick={() => setAuthView('register')}
//                   className="inline-flex items-center justify-between gap-12 px-10 py-5 bg-[#1A1F1C] hover:bg-[#4A6B55] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:-translate-y-0.5 rounded-none group"
//                 >
//                   <span>UNLOCK ACCESS SYSTEM</span>
//                   <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* VIEW 2: ORIGINAL WARM LOGIN CARD (Untouched Custom Styles) */}
//           {authView === 'login' && (
//             <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md animate-in fade-in zoom-in-95 duration-500 text-left">
//               <div className="text-center mb-10">
//                 <h1 className="font-serif text-4xl text-ink mb-2">Welcome Back</h1>
//                 <p className="text-ink-soft italic">Continue your mindfulness journey.</p>
//               </div>
//               <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col gap-6">
//                 <div className="flex flex-col gap-2">
//                   <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email Address</label>
//                   <input type="email" required className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all" placeholder="name@example.com" />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
//                   <input type="password" required className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all" placeholder="••••••••" />
//                 </div>
//                 <button type="submit" className="mt-4 bg-black text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg h-[56px] text-xs uppercase tracking-widest">Sign In</button>
//               </form>
//               <p className="text-center mt-8 text-sm text-ink-soft">
//                 New to MindMate? <button onClick={() => setAuthView('register')} className="text-[#4A6B55] font-bold hover:underline ml-1">Create Account</button>
//               </p>
//             </div>
//           )}

//           {/* VIEW 3: ORIGINAL WARM REGISTER CARD (Untouched Custom Styles) */}
//           {authView === 'register' && (
//             <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md animate-in fade-in zoom-in-95 duration-500 text-left">
//               <div className="text-center mb-10">
//                 <h1 className="font-serif text-4xl text-ink mb-2">Join MindMate</h1>
//                 <p className="text-ink-soft italic">Your journey to mindfulness starts here.</p>
//               </div>
//               <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col gap-5">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Full Name</label>
//                   <input type="text" required className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all" placeholder="Alex Smith" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email</label>
//                   <input type="email" required className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all" placeholder="alex@example.com" />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
//                   <input type="password" required className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all" placeholder="••••••••" />
//                 </div>
//                 <button type="submit" className="mt-4 bg-[#4A6B55] text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg h-[56px] text-xs uppercase tracking-widest">Create Account</button>
//               </form>
//               <p className="text-center mt-8 text-sm text-ink-soft">
//                 Already have an account? <button onClick={() => setAuthView('login')} className="text-black font-bold hover:underline ml-1">Log In</button>
//               </p>
//             </div>
//           )}

//         </div>

//         {/* C. FOOTER COMPLIANCE LINK MARKER */}
//         <footer className="text-center text-[9px] font-mono text-gray-400 tracking-[0.2em] uppercase border-t border-gray-100/50 pt-4 w-full">
//           Core Engine Interface // Unified Workspace Framework
//         </footer>

//       </div>
//     </div>
//   );
// }


// 4th ---------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/logo"; 
import { Sparkles, Brain, Lock, ArrowUpRight, Activity, Shield, ArrowLeft, Loader2, Check, AlertTriangle, X } from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
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
          <div className="flex items-center justify-start self-center h-full py-2 cursor-pointer" onClick={() => setAuthView('landing')}>
            <Logo />
          </div>

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

        <footer className="text-center text-[9px] font-mono text-gray-400 tracking-[0.2em] uppercase border-t border-gray-100/50 pt-4 w-full">
          Core Engine Interface // Unified Workspace Framework
        </footer>
      </div>
    </div>
  );
}