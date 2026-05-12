import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Store the token in LocalStorage
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userInfo', JSON.stringify(data.user)); // Optional: Store user name/email
        navigate('/dashboard');
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-warm px-4">
      <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-sage-light/20 shadow-card w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-ink mb-2">Welcome Back</h1>
          <p className="text-ink-soft italic">Continue your mindfulness journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              className="px-6 py-4 rounded-2xl bg-paper-warm/30 border border-sage-light/20 focus:outline-none focus:border-sage transition-all"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="mt-4 bg-ink text-paper py-4 rounded-2xl font-bold hover:bg-ink-mid transition-all active:scale-95 shadow-lg shadow-ink/10">
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-ink-soft">
          New to MindMate? <Link to="/register" className="text-sage font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}