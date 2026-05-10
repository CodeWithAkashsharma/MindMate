import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function History() {
  const location = useLocation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- EDIT MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ content: '', gratitude: '', emotions: '' });
  const [selectedId, setSelectedId] = useState(null);

  // --- DELETE POPUP STATES ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/journals', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setEntries(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [location.pathname]);

  // --- DELETE LOGIC ---
  const confirmDelete = (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/journals/${idToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setEntries(entries.filter(entry => entry._id !== idToDelete));
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // --- EDIT LOGIC ---
  const openEditModal = (entry) => {
    setSelectedId(entry._id);
    setEditForm({
      content: entry.content,
      gratitude: entry.gratitude?.[0] || '',
      emotions: entry.emotions?.[0] || ''
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/journals/${selectedId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          content: editForm.content,
          gratitude: [editForm.gratitude],
          emotions: [editForm.emotions]
        })
      });
      if (response.ok) {
        const updatedData = await response.json();
        setEntries(entries.map(ent => ent._id === selectedId ? updatedData : ent));
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-paper-warm/30 p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div className="flex flex-col gap-4">
            <Link to="/journal" className="group flex items-center gap-2 text-[10px] font-black text-sage-dark uppercase tracking-[0.2em] hover:text-sage transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Journal
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-tight">The Archive</h1>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <div className="text-[10px] font-black text-ink-muted/40 uppercase tracking-[0.3em]">Vault</div>
            <div className="text-sm font-serif italic text-sage-dark">{entries.length} Memories Cataloged</div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {entries.length > 0 ? (
            entries.map((item) => (
              <div key={item._id} className="group relative flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <span className="text-[10px] font-black text-sage-dark uppercase tracking-[0.2em]">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="h-[1px] flex-1 bg-sage-light/20"></div>
                  <span className="text-[9px] font-bold text-ink-muted/40 uppercase tracking-widest">{new Date(item.createdAt).getFullYear()}</span>
                </div>

                <div className="relative bg-surface border border-sage-light/20 p-6 md:p-10 rounded-[2.5rem] transition-all duration-700 ease-out hover:scale-[1.02] hover:border-sage/50 hover:shadow-soft hover:bg-white/90 flex flex-col h-full min-h-[380px] overflow-hidden group/card">
                  
                  {/* WATERMARK */}
                  <div className="absolute -bottom-6 -right-6 text-sage-light/10 text-9xl font-serif select-none pointer-events-none transform group-hover/card:-translate-x-4 group-hover/card:-translate-y-4 group-hover/card:rotate-12 transition-all duration-1000">
                    {item.emotions?.[0]?.split(' ')[0] || '✨'}
                  </div>

                  <div className="relative z-10">
                    <div className="mb-8 flex justify-between items-start">
                      <div className="px-4 py-1.5 bg-sage-pale group-hover/card:bg-sage/20 rounded-full border border-sage-light/10 text-sage-dark text-[10px] font-bold uppercase tracking-tight transition-colors duration-500">
                        {item.emotions?.[0] || 'Neutral'}
                      </div>
                      
                      {/* ACTION BUTTONS */}
                      <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        <button onClick={() => openEditModal(item)} className="p-2 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => confirmDelete(item._id)} className="p-2 text-red-700 hover:text-red-400 hover:bg-red-50 rounded-full transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <span className="text-[9px] font-black text-ink-muted/30 uppercase tracking-[0.2em] block mb-3 group-hover/card:text-sage transition-colors">Gratitude Focus</span>
                      <p className="font-serif text-2xl md:text-3xl italic text-ink leading-snug group-hover/card:text-sage-dark transition-colors duration-500">
                        "{item.gratitude?.[0] || 'Untitled'}"
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-sage-light/10 pt-8 mt-auto group-hover/card:border-sage/20 transition-colors">
                    <span className="text-[9px] font-black text-ink-muted/30 uppercase tracking-[0.2em] block mb-4">Detailed Reflection</span>
                    <p className="text-sm md:text-base text-ink-soft leading-relaxed whitespace-pre-wrap font-sans opacity-80 group-hover/card:opacity-100 transition-opacity duration-500">{item.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <div className="col-span-full text-center py-32 border-2 border-dashed border-sage-light/20 rounded-[3rem]">Archive empty.</div>
          )}
        </div>
        {loading && <div className="flex justify-center py-20 text-ink-muted italic">Cataloging memories...</div>}
      </div>

      {/* --- MODAL 1: EDIT FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-lg rounded-[3rem] p-8 md:p-12 shadow-2xl border border-sage-light/20 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-serif text-2xl text-ink">Refine Memory</h2>
                <p className="text-[10px] text-sage-dark font-black uppercase tracking-widest mt-1">Update your reflection</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-sage-pale rounded-full text-ink-muted">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-black text-sage-dark uppercase tracking-widest block mb-3">Update Mood</label>
                <div className="flex flex-wrap gap-2">
                  {['😊 Happy', '😌 Peaceful', '🤩 Excited', '😫 Overwhelmed', '😴 Tired', '🌪️ Anxious'].map((mood) => (
                    <button key={mood} type="button" onClick={() => setEditForm({ ...editForm, emotions: mood })} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${editForm.emotions === mood ? 'bg-sage text-white border-sage shadow-md' : 'bg-paper-warm/50 text-ink-soft border-sage-light/20 hover:border-sage/50'}`}>{mood}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-sage-dark uppercase tracking-widest block mb-2">Gratitude</label>
                <input type="text" value={editForm.gratitude} onChange={(e) => setEditForm({...editForm, gratitude: e.target.value})} className="w-full bg-paper-warm/30 border-b-2 border-sage-light/30 py-3 text-lg font-serif italic text-ink focus:outline-none focus:border-sage transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-sage-dark uppercase tracking-widest block mb-2">Reflection</label>
                <textarea rows="5" value={editForm.content} onChange={(e) => setEditForm({...editForm, content: e.target.value})} className="w-full bg-paper-warm/30 border border-sage-light/10 rounded-2xl px-5 py-4 text-sm leading-relaxed text-ink-soft focus:outline-none focus:border-sage/50 transition-all resize-none" />
              </div>
              <button type="submit" className="w-full bg-sage text-white font-bold py-4 rounded-xl hover:bg-sage-dark transition-all shadow-lg active:scale-[0.98]">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CUSTOM DELETE POPUP --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl border border-red-100 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl shadow-inner">⚠️</div>
            <h3 className="font-serif text-2xl text-ink mb-3">Delete Memory?</h3>
            <p className="text-ink-muted text-[11px] leading-relaxed mb-8 px-2">This reflection will be permanently removed from your archive. This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200">Yes, Delete Forever</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-paper-warm text-ink-soft rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95">No, Keep It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}