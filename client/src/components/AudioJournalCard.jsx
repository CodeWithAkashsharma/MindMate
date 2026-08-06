import React, { useState, useEffect, useRef, } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Mic,
  Square,
  Play,
  Pause,
  Activity,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function AudioJournalCard() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recentAudio, setRecentAudio] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  const timerRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    fetchRecentNotes();

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  const fetchRecentNotes = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API }/api/voicenotes/recent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecentAudio(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        timerRef.current += 1;
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    setRecordingTime(0);
    timerRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleUpload;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Please allow microphone access in your browser site settings!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);

    const audioBlob = new Blob(audioChunksRef.current, {
      type: 'audio/webm',
    });

    if (audioBlob.size === 0) {
      console.warn('Recording was too short or empty.');
      setIsUploading(false);
      return;
    }

    const finalDuration = formatTime(timerRef.current);

    const formData = new FormData();

    formData.append('audio', audioBlob, 'voicenote.webm');
    formData.append('duration', finalDuration);

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${import.meta.env.VITE_BACKEND_API }/api/voicenotes/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRecentNotes();
    } catch (err) {
      console.error('Upload failed in React:', err);
      alert('Failed to save voice note.');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlay = (id, url) => {
    if (playingId === id) {
      audioPlayerRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      audioPlayerRef.current = new Audio(url);

      audioPlayerRef.current.play();

      setPlayingId(id);

      audioPlayerRef.current.onended = () => {
        setPlayingId(null);
      };
    }
  };
// ... (your existing imports remain the same)

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-white via-[#F8FAF9] to-[#EEF4F0] rounded-[36px] border border-white/40 p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(74,107,85,0.08)] backdrop-blur-xl flex flex-col xl:flex-row gap-6 md:gap-8 items-stretch transition-all duration-500">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#7C9E87]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A72C]/10 blur-3xl rounded-full pointer-events-none" />

      {/* LEFT SECTION */}
      <div className="flex-1 flex flex-col justify-center bg-white/70 backdrop-blur-xl rounded-[30px] p-4 sm:p-6 border border-white/60 relative overflow-hidden shadow-[0_8px_30px_rgba(124,158,135,0.12)]">
        {isRecording && (
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-rose-50/30 to-transparent animate-pulse" />
        )}

        <div className="relative z-10 flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 active:scale-95 shadow-lg ${
              isRecording
                ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white scale-110 animate-pulse'
                : 'bg-white text-[#4A6B55] hover:bg-[#4A6B55] hover:text-white'
            }`}
          >
            {isUploading ? <Loader2 size={24} className="animate-spin" /> : isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={24} strokeWidth={2.2} />}
          </button>

          <div className="text-center sm:text-left flex-1 min-w-0">
            {isUploading ? (
              <h3 className="text-lg sm:text-xl font-serif text-[#1A1F1C]">Saving...</h3>
            ) : isRecording ? (
              <p className="text-4xl sm:text-5xl font-serif text-[#1A1F1C] tabular-nums animate-pulse">{formatTime(recordingTime)}</p>
            ) : (
              <div>
                <h3 className="text-lg sm:text-xl font-serif text-[#1A1F1C] flex items-center justify-center sm:justify-start gap-2 mb-1">
                  Too overwhelmed to type ?<Sparkles size={16} className="text-[#D4A72C]" />
                </h3>
                <p className=" hidden sm:block text-xs sm:text-sm text-gray-500 leading-relaxed truncate px-2 sm:px-0">
                  Tap the mic and let your thoughts flow naturally into your
                  private voice journal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col min-w-0">
      <div className="flex-1 flex justify-between min-w-0">
        
        <h4 className="text-[10px] font-black text-[#6C8A75] uppercase tracking-[0.28em] mb-4 flex items-center justify-center sm:justify-start gap-2">
          <Activity size={12} /> Recent Voice Notes
        </h4>
<Link 
  to="/history"
  state={{ from: 'dashboard' }}
    className="text-[10px] font-bold text-emerald-800 hover:text-emerald-600 uppercase tracking-widest transition-all"
  >
    View Archive →
  </Link>
  </div>
        <div className="space-y-3">
          {recentAudio.length === 0 ? (
            <p className="text-sm text-[#8A9C90] italic text-center py-6 border border-dashed border-[#7C9E87]/20 rounded-2xl">No notes yet.</p>
          ) : (
            recentAudio.map((audio) => (
              <div key={audio._id} className="group flex items-center gap-3 p-3 sm:p-4 rounded-[24px] bg-white/80 border border-white/50 hover:border-[#7C9E87]/30 transition-all cursor-pointer">
                <button
                  onClick={() => togglePlay(audio._id, audio.audioUrl)}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                    playingId === audio._id ? 'bg-[#4A6B55] text-white' : 'bg-[#F4F6F5] text-[#4A6B55]'
                  }`}
                >
                  {playingId === audio._id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1F1C] truncate">{audio.tag || 'Voice Reflection'}</p>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.05em] text-slate-400">
                    {new Date(audio.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    <span className="mx-1.5 opacity-40">|</span>
                    {new Date(audio.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                </div>

                <div className="hidden xs:block pr-2">
                  <Activity size={20} className={playingId === audio._id ? "text-[#4A6B55] animate-bounce" : "text-gray-200"} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}