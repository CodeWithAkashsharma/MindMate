import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        alert("✨ Account created! Now let's log you in.");
        navigate('/login');
      } else {
        // This will alert the specific error from your backend (e.g., "User already exists")
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Backend server not responding. Check your terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-warm px-4">
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
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="new-password"
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