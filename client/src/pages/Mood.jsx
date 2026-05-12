import React, { useState, useEffect } from 'react';

export default function Mood() {
  const [score, setScore] = useState(8);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const emotionsList = [
    { name: 'Joy', emoji: '😊' },
    { name: 'Sadness', emoji: '😔' },
    { name: 'Fear', emoji: '😨' },
    { name: 'Anger', emoji: '😤' },
    { name: 'Disgust', emoji: '🤢' },
    { name: 'Surprise', emoji: '😲' },
    { name: 'Calm', emoji: '😌' },
    { name: 'Hope', emoji: '✨' }
  ];

  const average =
  history.length > 0
    ? (
        history.reduce((acc, item) => acc + item.score, 0) /
        history.length
      ).toFixed(1)
    : 0;

const bestDay =
  history.length > 0
    ? (
        (
          Math.max(...history.map((m) => m.score)) +
          history.reduce((acc, item) => acc + item.score, 0) /
            history.length
        ) / 2
      ).toFixed(1)
    : 0;

const lowest =
  history.length > 0
    ? (
        (
          Math.min(...history.map((m) => m.score)) +
          history.reduce((acc, item) => acc + item.score, 0) /
            history.length
        ) / 2
      ).toFixed(1)
    : 0;

const consistency =
  history.length > 1
    ? `${Math.round(
        (
          history.reduce((acc, item) => acc + item.score, 0) /
          (history.length * 10)
        ) * 100
      )}%`
    : "0%";

const insights = [
  { label: 'Average', val: average, max: 10 },
  { label: 'Best Day', val: bestDay, max: 10 },
  { label: 'Lowest', val: lowest, max: 10 },
  {
    label: 'Consistency',
    val: consistency,
    max: 100
  }
];

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/moods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();


      if (response.ok) {

        let moodsArray = [];

        if (Array.isArray(data)) {
          moodsArray = data;
        } else if (Array.isArray(data.moods)) {
          moodsArray = data.moods;
        } else if (Array.isArray(data.data)) {
          moodsArray = data.data;
        } else if (Array.isArray(data.history)) {
          moodsArray = data.history;
        }

        setHistory(moodsArray.slice(-14));
      }

    } catch (err) {
      console.error("Error fetching mood history:", err);
    }
  };

const handleSaveMood = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:5000/api/moods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score, emotions: selectedEmotions, notes })
    });

    if (response.ok) {
      setNotes('');
      setSelectedEmotions([]);
      fetchMoodHistory();
      
      // Trigger the Success Popup
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    }
  } catch (err) {
    console.error("Failed to save mood:", err);
  } finally {
    setLoading(false);
  }
};
  const handleEmotionToggle = (name) => {
    setSelectedEmotions((prev) =>
      prev.includes(name)
        ? prev.filter((e) => e !== name)
        : [...prev, name]
    );
  };

  const generatePath = () => {
    if (!history || history.length < 2) {
      return '';
    }

    const width = 300;
    const height = 120;

    let path = '';

    history.forEach((m, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((m.score || 0) / 10) * height;

      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });

    return path;
  };

 return (
  <div className="min-h-screen bg-[#FAFAF8] p-2 sm:p-4 md:p-6 lg:p-8">
    
    <div className="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 items-start">

      {/* LEFT SECTION */}
      <div className="min-w-0 xl:col-span-7 bg-white rounded-[28px] border border-[rgba(74,107,85,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 md:p-7">

        <div className="space-y-8">

          {/* HEADER */}
          <div className="space-y-6">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF5F0] border border-[#DCE5DF] mb-2">

                <span className="text-sm">💭</span>

                <h3 className="text-[10px] font-semibold text-[#7E8C83] uppercase tracking-[2px]">
                  Log Today's Mood
                </h3>
              </div>

              <p className="text-[14px] text-[#5F6E64] font-medium">
                Overall mood (1–10)
              </p>
            </div>

            {/* SLIDER */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">

              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-[#EDF4EF] rounded-full appearance-none cursor-pointer accent-[#7C9E87]"
              />

              <span className="text-4xl sm:text-5xl font-serif text-[#1A1F1C] leading-none">
                {score}
              </span>
            </div>

            {/* MOOD STATES */}
            <div className="flex justify-between gap-1 sm:gap-2">

              {[
                { label: 'V.Low', emo: '😫', val: 1 },
                { label: 'Low', emo: '😕', val: 3 },
                { label: 'Mod.', emo: '😐', val: 5 },
                { label: 'Good', emo: '😊', val: 8 },
                { label: 'Excl.', emo: '🤩', val: 10 },
              ].map((m, index, arr) => {

                const nextVal =
                  arr[index + 1]
                    ? arr[index + 1].val
                    : 11;

                const isActive =
                  score >= m.val &&
                  score < nextVal;

                return (
                  <div
                    key={m.val}
                    className="flex flex-col items-center gap-1 flex-1"
                  >
                    <span
                      className={`text-lg sm:text-xl transition-all duration-300 ${
                        isActive
                          ? 'scale-[1.5] sm:scale-[1.8] -translate-y-1 opacity-100'
                          : 'opacity-30 grayscale-[0.5]'
                      }`}
                    >
                      {m.emo}
                    </span>

                    <span
                      className={`text-[8px] sm:text-[9px] font-bold uppercase ${
                        isActive
                          ? 'text-[#4A6B55]'
                          : 'text-[#A0ADA4]'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EMOTIONS */}
          <div className="space-y-4">

            <h3 className="text-[13px] text-[#6B7A70] font-medium">
              Emotions present
            </h3>

            <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 gap-2.5">

              {emotionsList.map((emo) => {

                const isSelected =
                  selectedEmotions.includes(emo.name);

                return (
                  <button
                    key={emo.name}
                    onClick={() => handleEmotionToggle(emo.name)}
                    className={`flex items-center justify-center gap-2 py-3 px-2 rounded-[14px] border transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#EDF4EF] border-[#7C9E87] text-[#4A6B55] font-bold shadow-sm'
                        : 'bg-white border-[rgba(74,107,85,0.12)] text-[#6B7A70]'
                    }`}
                  >
                    <span
                      className={`transition-transform duration-300 ${
                        isSelected ? 'scale-125' : ''
                      }`}
                    >
                      {emo.emoji}
                    </span>

                    <span className="text-[11px] sm:text-[12px]">
                      {emo.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NOTES */}
          <div className="space-y-3">

            <div className="flex items-center gap-2">

              <span className="w-7 h-7 rounded-full bg-[#EEF5F0] border border-[#DCE5DF] flex items-center justify-center text-sm">
                ✍️
              </span>

              <h3 className="text-[13px] font-medium text-[#5F6E64]">
                Any notes?
              </h3>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What influenced your mood today?"
              className="w-full h-28 sm:h-32 p-4 bg-[#FCFCFB] border border-[rgba(74,107,85,0.10)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B7CBBE]/40 text-[14px] text-[#1A1F1C] resize-none transition-all shadow-sm placeholder:text-[#9AA69E]"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSaveMood}
            disabled={loading}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#7C9E87] to-[#6D8F79] text-white font-semibold text-[14px] sm:text-[15px] shadow-md hover:shadow-xl active:scale-[0.98] transition-all duration-300"
          >
            {loading ? 'Logging...' : 'Log Mood ✨'}
          </button>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="min-w-0 xl:col-span-5 flex flex-col gap-4 sm:gap-6">

        {/* GRAPH CARD */}
        <div className="min-w-0 bg-white rounded-[28px] border border-[rgba(74,107,85,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 md:p-6 overflow-hidden">

          <div className="relative mb-6">

  {/* LEGEND TOP RIGHT */}
  <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-[#7E8C83]">

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#9B8EC4]"></span>
      <span>Excellent</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#7C9E87]"></span>
      <span>Good</span>
    </div>

    <div className="flex items-center gap-1">
      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C4847A]"></span>
      <span>Low</span>
    </div>
  </div>

  {/* TITLE */}
  <div className="flex flex-col gap-1">

    <h3 className="text-[10px] font-semibold text-[#A0ADA4] uppercase tracking-[1.5px]">
      History
    </h3>

    <span className="text-[13px] font-bold text-[#4A6B55]">
      Emotional Pulse Flow
    </span>
  </div>
</div>

          <div className="relative h-40 sm:h-48 md:h-56 w-full">

            {/* GRID */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-30">

              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[1px] border-t border-dashed border-[#A0ADA4]"
                />
              ))}
            </div>

            {/* SVG */}
            <svg
              viewBox="0 0 300 120"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >

              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#7C9E87" />
                  <stop offset="50%" stopColor="#9B8EC4" />
                  <stop offset="100%" stopColor="#7C9E87" />
                </linearGradient>
              </defs>

              {history.length > 1 && (
                <path
                  d={generatePath()}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {/* POINTS */}
            <div className="absolute inset-0 flex items-end justify-between">

              {history.map((m, i) => (

                <div
                  key={i}
                  className="flex-1 flex flex-col items-center h-full justify-end"
                >
                  <div
                    style={{
                      marginBottom: `calc(${(m.score / 10) * 100}% - 8px)`
                    }}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md ${
                      m.score > 7
                        ? 'bg-[#9B8EC4]'
                        : m.score > 5
                        ? 'bg-[#7C9E87]'
                        : 'bg-[#C4847A]'
                    }`}
                  />

                  <span className="text-[8px] sm:text-[9px] font-bold text-[#A0ADA4] mt-2 uppercase">
                    {new Date(m.createdAt).toLocaleDateString(
                      'en-IN',
                      { weekday: 'narrow' }
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="min-w-0 bg-white rounded-[28px] border border-[rgba(74,107,85,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 md:p-6 space-y-4">

          <h3 className="text-[11px] font-semibold text-[#A0ADA4] uppercase tracking-[1.5px]">
           Mood Insights
          </h3>

          <div className="flex flex-col gap-4">

            {insights.map((stat) => (

              <div
                key={stat.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-[11px] text-[#6B7A70] w-16 sm:w-20">
                  {stat.label}
                </span>

                <div className="flex-1 h-1.5 bg-[#EDF4EF] rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#9B8EC4] rounded-full transition-all duration-1000"
                    style={{
                      width: `${(parseFloat(stat.val) / stat.max) * 100}%`
                    }}
                  />
                </div>

                <span className="text-[11px] font-semibold text-[#4A6B55] min-w-[32px] text-right">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    {/* Confirmation Popup */}
{showSuccess && (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
    <div className="bg-[#1A1F1C] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
      <div className="w-6 h-6 rounded-full bg-[#7C9E87] flex items-center justify-center text-[10px]">
        ✓
      </div>
      <span className="text-[13px] font-medium tracking-wide">
        Mood energy captured successfully
      </span>
    </div>
  </div>
)}
    </div>
  </div>
);
}