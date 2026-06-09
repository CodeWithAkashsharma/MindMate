import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Play,
  Pause,
  Mic,
  BookOpen,
  LayoutGrid,
  PencilLine,
  Trash2,
  Search,
} from 'lucide-react';

export default function History() {
  const location = useLocation();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [playingId, setPlayingId] = useState(null);
  const audioPlayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    content: '',
    gratitude: '',
    emotions: '',
  });

  const [selectedId, setSelectedId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');

      try {
        const [journalResponse, voiceResponse] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_BACKEND_API}/api/journals`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(
              `${import.meta.env.VITE_BACKEND_API}/api/voicenotes/all`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        let journalsData = [];
        let voicesData = [];

        if (journalResponse.ok)
          journalsData = await journalResponse.json();

        if (voiceResponse.ok)
          voicesData = await voiceResponse.json();

        const combinedData = [
          ...journalsData,
          ...voicesData,
        ].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setEntries(combinedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [location.pathname]);

const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

const togglePlay = (id, url) => {

  if (playingId === id) {

    audioPlayerRef.current.pause();
    setPlayingId(null);

  } else {

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(url);

    audioPlayerRef.current = audio;

    audio.play();

    setPlayingId(id);

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setPlayingId(null);
      setCurrentTime(0);
    };
  }
};

  const confirmDelete = (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

 const handleDelete = async () => {

  try {

    const token = localStorage.getItem('token');

    const itemToDelete = entries.find(
      (e) => e._id === idToDelete
    );

    if (!itemToDelete) return;

    // =========================
    // VOICE NOTE DELETE
    // =========================

    if (itemToDelete.audioUrl) {

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/voicenotes/${idToDelete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to delete voice note'
        );
      }

    } else {

      // =========================
      // JOURNAL DELETE
      // =========================

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/journals/${idToDelete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to delete journal'
        );
      }
    }

    // =========================
// STOP AUDIO IF PLAYING
// =========================

if (
  playingId === idToDelete &&
  audioPlayerRef.current
) {

  audioPlayerRef.current.pause();

  audioPlayerRef.current.currentTime = 0;

  setPlayingId(null);

  setCurrentTime(0);
}

// =========================
// REMOVE FROM UI
// =========================

setEntries((prev) =>
  prev.filter(
    (entry) => entry._id !== idToDelete
  )
);

    // =========================
    // CLOSE MODAL
    // =========================

    setIsDeleteModalOpen(false);

    setIdToDelete(null);

  } catch (err) {

    console.error(err);

  }
};

  const openEditModal = (entry) => {
    setSelectedId(entry._id);

    setEditForm({
      content: entry.content,
      gratitude: entry.gratitude?.[0] || '',
      emotions: entry.emotions?.[0] || '',
    });

    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/journals/${selectedId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editForm.content,
            gratitude: [editForm.gratitude],
            emotions: [editForm.emotions],
          }),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();

        setEntries(
          entries.map((ent) =>
            ent._id === selectedId
              ? updatedData
              : ent
          )
        );

        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEntries = entries.filter((item) => {
    const isVoice = !!item.audioUrl;

    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'voice'
        ? isVoice
        : !isVoice;

    const searchableText = `
      ${item.content || ''}
      ${item.gratitude?.join(' ') || ''}
      ${item.emotions?.join(' ') || ''}
      ${item.tag || ''}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(
      searchTerm.toLowerCase()
    );

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F8FAF8] via-[#FDFBF7] to-[#F5F8F6] px-2 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 animate-in fade-in duration-700">

      {/* BACKGROUND */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage/10 blur-3xl rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-lavender/10 blur-3xl rounded-full pointer-events-none" />

      {/* MAIN */}
      <div className="max-w-[1750px] mx-auto relative z-10">

     {/* HEADER */}
<div className="bg-white/88 backdrop-blur-2xl border border-white/60 rounded-[2.4rem] px-5 sm:px-7 lg:px-8 py-5 shadow-[0_12px_40px_rgba(74,107,85,0.05)] mb-5 sticky top-3 z-30 overflow-hidden">

  {/* SOFT LIGHT */}
  <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-sage/5 blur-3xl rounded-full pointer-events-none"></div>

  <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

    {/* LEFT SIDE */}
    <div className="min-w-0 flex-1">

      {/* TOP ROW */}
      <div className="flex items-center gap-3 mb-4">

       <Link
  to={
    location.state?.from === 'dashboard'
      ? '/dashboard'
      : '/journal'
  }
  className="group flex items-center gap-2 text-[12px] font-semibold text-sage-dark/75 hover:text-sage transition-all"
>
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>

          Back
        </Link>

        <div className="h-4 w-px bg-sage-dark/10"></div>

        <span className="text-[10px] uppercase tracking-[0.22em] text-sage-dark/30 font-bold">
          Memory Archive
        </span>
      </div>

      {/* MAIN TITLE ROW */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">

        {/* TITLE */}
        <h1 className="font-serif text-[2rem] sm:text-[4.2rem] leading-[0.9] tracking-[-0.045em] text-[#1D1D1D] whitespace-nowrap">
          Your Journey
        </h1>

        {/* MEMORY COUNT */}
        <div className="mb-2 flex items-center gap-3 flex-wrap">

          <div className=" items-center hidden sm:inline-flex   gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sage-dark to-sage shadow-lg shadow-sage/15">

            <div className="w-2 h-2  rounded-full bg-white/80 animate-pulse "></div>

            <span className="text-[7px]  sm:text-[9px] font-black uppercase tracking-[0.18em] text-white">
              {entries.length} Memories
            </span>
          </div>

        </div>
      </div>
          <p className="text-[15px] text-[#7D857F] leading-relaxed hidden sm:block">
            Reflections, emotions & voice memories.
          </p>
    </div>

    {/* RIGHT SIDE */}
    <div className="w-full xl:w-auto flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

      {/* SEARCH */}
      <div className="relative w-full lg:w-[360px]">

        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full h-[54px] bg-white/95 border border-sage/10 rounded-2xl px-5 pl-12 text-sm text-ink placeholder:text-slate-400 shadow-[0_8px_24px_rgba(74,107,85,0.06)] focus:outline-none focus:border-sage/30 focus:ring-4 focus:ring-sage/10 transition-all"
        />

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark/35"
        />
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">

        {[
          {
            id: 'all',
            label: 'All',
            icon: LayoutGrid,
          },
          {
            id: 'journal',
            label: 'Journals',
            icon: BookOpen,
          },
          {
            id: 'voice',
            label: 'Voice Notes',
            icon: Mic,
          },
        ].map((filter) => {
          const Icon = filter.icon;

          return (
            <button
              key={filter.id}
              onClick={() =>
                setActiveFilter(filter.id)
              }
              className={` h-[30px]  sm:h-[54px] shrink-0 px-2 sm:px-5 rounded-lg sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.97] flex items-center gap-2

              ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-sage-dark to-sage text-white shadow-lg shadow-sage/15'
                  : 'bg-white text-sage-dark border border-sage-light/20 hover:bg-sage-pale shadow-sm'
              }`}
            >
              <Icon size={14} />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
</div>

        {/* FEED */}
        <div className="columns-1 2xl:columns-2 gap-5 space-y-5">

          {filteredEntries.map((item, index) => {

            const isVoiceNote = !!item.audioUrl;

            return (
              <div
                key={item._id}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
                className="break-inside-avoid animate-in fade-in slide-in-from-bottom-3 duration-700"
              >

                {/* CARD */}
                <div
                  className={`group relative backdrop-blur-md border rounded-[2rem] p-5 sm:p-6 shadow-[0_8px_30px_rgba(74,107,85,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(74,107,85,0.12)] overflow-hidden before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-br before:from-sage/5 before:via-transparent before:to-lavender/5 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-700

                  ${
                    isVoiceNote
                      ? 'bg-gradient-to-br from-[#F8FBF9] via-white to-[#EEF5F1] border-lavender/20'
                      : 'bg-gradient-to-br from-[#FFFDFC] via-white to-[#F5F9F6] border-sage-light/15'
                  }`}
                >

                  {/* TOP */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-5">

                    <div className="flex flex-col gap-2">

                      <div className="flex items-center gap-2 flex-wrap">

                        <div className="px-3 py-1.5 rounded-full bg-sage-pale text-[9px] font-black uppercase tracking-[0.15em] text-sage-dark border border-sage-light/10">
                          {isVoiceNote
                            ? 'Voice Reflection'
                            : item.emotions?.[0] ||
                              'Reflection'}
                        </div>

                      </div>
                      <div className='flex gap-3'>

                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-ink-muted/40">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.12em]">
                        {new Date(
                          item.createdAt
                        ).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">

                      {!isVoiceNote && (
                        <button
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition-all active:scale-95"
                        >
                          <PencilLine
                            size={16}
                            strokeWidth={2.2}
                          />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          confirmDelete(item._id)
                        }
                        className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all active:scale-95"
                      >
                        <Trash2
                          size={16}
                          strokeWidth={2.2}
                        />
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  {isVoiceNote ? (
<div className="relative z-10 flex items-center gap-4 rounded-[1.5rem] bg-gradient-to-r from-[#F7FAF8] to-[#EEF5F1] border border-sage-light/10 p-4">

  {/* PLAYER BUTTON */}
  <button
    onClick={() =>
      togglePlay(
        item._id,
        item.audioUrl
      )
    }
    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 shrink-0

    ${
      playingId === item._id
        ? 'bg-gradient-to-br from-sage-dark to-sage text-white'
        : 'bg-white text-sage-dark hover:bg-sage hover:text-white'
    }`}
  >
    {playingId === item._id ? (
      <Pause
        size={20}
        fill="currentColor"
      />
    ) : (
      <Play
        size={20}
        fill="currentColor"
        className="ml-0.5"
      />
    )}
  </button>

  {/* CONTENT */}
  <div className="flex-1 min-w-0">

    {/* TITLE */}
    <div className="flex items-start justify-between gap-3">

      <div className="min-w-0">

        <p className="font-serif text-xl text-ink truncate">
          {item.tag || 'Voice Reflection'}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">

          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
            Voice Note
          </span>

          {playingId === item._id && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>

              <span className="text-[10px] font-semibold text-sage-dark animate-pulse">
                Playing...
              </span>
            </>
          )}
        </div>
      </div>

      
    </div>

    {/* AUDIO BAR */}
    <div className="mt-4">

      <div className="w-full h-2 rounded-full bg-sage-light/20 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-sage-dark to-sage transition-all duration-200"
          style={{
            width:
              playingId === item._id && duration
                ? `${
                    (currentTime / duration) *
                    100
                  }%`
                : '0%',
          }}
        />
      </div>

      {/* TIME */}
      <div className="flex items-center justify-between mt-2">

        <span className="text-[11px] text-slate-400 font-medium">
          {playingId === item._id
            ? `${Math.floor(
                currentTime / 60
              )}:${String(
                Math.floor(currentTime % 60)
              ).padStart(2, '0')}`
            : '0:00'}
        </span>

        <span className="text-[11px] text-slate-400 font-medium">
          {item.duration}
        </span>
      </div>
    </div>
  </div>
</div>
                  ) : (

                    <div className="relative z-10 flex flex-col gap-5">

                      {/* GRATITUDE */}
                      <div>

                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-ink-muted/30 mb-3">
                          Gratitude Focus
                        </div>

                        <p className="font-serif text-2xl sm:text-3xl italic text-ink leading-snug">
                          "
                          {item.gratitude?.[0] ||
                            'Untitled Reflection'}
                          "
                        </p>
                      </div>

                      {/* CONTENT */}
                      <div className="border-t border-sage-light/10 pt-5">

                        <p className="text-sm sm:text-[15px] leading-relaxed text-ink-soft whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {!loading &&
          filteredEntries.length === 0 && (
            <div className="bg-white/70 backdrop-blur-xl border border-dashed border-sage-light/20 rounded-[2rem] py-20 px-6 text-center mt-6">

              <div className="text-6xl mb-6">
                🌱
              </div>

              <h3 className="font-serif text-3xl text-ink mb-4">
                No matching memories.
              </h3>

              <p className="text-ink-muted max-w-md mx-auto leading-relaxed">
                Try searching with different keywords
                or change your filters.
              </p>
            </div>
          )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-24">

            <div className="flex items-center gap-3 text-sage-dark">

              <div className="w-3 h-3 rounded-full bg-sage animate-bounce"></div>

              <div className="w-3 h-3 rounded-full bg-sage animate-bounce delay-100"></div>

              <div className="w-3 h-3 rounded-full bg-sage animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-gradient-to-br from-white via-[#FCFDFB] to-[#F5F9F6] w-full max-w-lg rounded-[2.5rem] p-8 shadow-[0_20px_80px_rgba(74,107,85,0.15)] border border-sage-light/20 overflow-hidden">

            <div className="absolute top-0 right-0 w-40 h-40 bg-sage/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">

              <div className="flex justify-between items-center mb-8">

                <div>
                  <h2 className="font-serif text-3xl text-ink">
                    Refine Memory
                  </h2>

                  <p className="text-sm text-ink-muted mt-1">
                    Update your reflection gently.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="w-10 h-10 rounded-full hover:bg-paper-warm flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleUpdate}
                className="flex flex-col gap-5"
              >

                <div className="flex flex-col gap-2">

                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-sage-dark">
                    Gratitude
                  </label>

                  <input
                    type="text"
                    value={editForm.gratitude}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        gratitude: e.target.value,
                      })
                    }
                    className="w-full bg-white/80 shadow-inner border border-sage-light/20 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-sage/20"
                  />
                </div>

                <div className="flex flex-col gap-2">

                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-sage-dark">
                    Reflection
                  </label>

                  <textarea
                    rows="6"
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        content: e.target.value,
                      })
                    }
                    className="w-full bg-white/80 shadow-inner border border-sage-light/20 rounded-2xl px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-sage/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sage-dark to-sage text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-sage/20 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() =>
              setIsDeleteModalOpen(false)
            }
          />

          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-red-100 text-center overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-100/40 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">

              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Trash2 size={28} />
              </div>

              <h3 className="font-serif text-3xl text-ink mb-3">
                Delete Memory?
              </h3>

              <p className="text-ink-muted text-sm leading-relaxed mb-8">
                This reflection will be permanently
                removed from your archive.
              </p>

              <div className="flex flex-col gap-3">

                <button
                  onClick={handleDelete}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95"
                >
                  Delete Forever
                </button>

                <button
                  onClick={() =>
                    setIsDeleteModalOpen(false)
                  }
                  className="w-full py-4 bg-paper-warm text-ink-soft rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}