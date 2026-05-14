import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, AlertTriangle, X } from 'lucide-react'; // Import icons

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  // NEW: Toast State
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  // Helper to show custom popup
  const showPopup = (type, message) => {
    setToast({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds on success
    } else {
      setTimeout(() => setToast({ ...toast, show: false }), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('success', "✨ Account created! Let's get you logged in.");
      } else {
        showPopup('error', data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      showPopup('error', "Backend server not responding. Check your terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-warm px-4 relative overflow-hidden">
      
      {/* --- CUSTOM POPUP (TOAST) --- */}
      <div 
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border min-w-[320px] ${
          toast.type === 'success' 
            ? 'bg-[#1A1F1C] text-white border-sage/30' 
            : 'bg-white text-ink border-rose-100'
        }`}>
          <div className={`p-2 rounded-full ${
            toast.type === 'success' ? 'bg-sage/20 text-sage' : 'bg-rose-50 text-rose-500'
          }`}>
            {toast.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          </div>
          <p className="text-sm font-medium tracking-wide">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-auto opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* --- REGISTRATION FORM --- */}
      <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-ink mb-2">Join MindMate</h1>
          <p className="text-ink-soft italic">Your journey to mindfulness starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all"
              placeholder="Alex Smith"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all"
              placeholder="alex@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-sage text-white py-4 rounded-2xl font-bold hover:bg-sage-dark transition-all active:scale-95 shadow-lg shadow-sage/10 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-ink-soft">
          Already have an account? <Link to="/login" className="text-ink font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}