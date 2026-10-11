import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@auraseoul.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 text-white p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-aura-accent">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent block">
            AUTHENTICATED PERSONNEL ONLY
          </span>
          <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-white">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to manage store catalog, inventory stock, customer orders, and seasonal campaigns.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-neutral-950 p-3.5 border border-neutral-800 text-xs space-y-1">
          <p className="font-bold text-aura-accent flex items-center space-x-1">
            <Check className="w-3.5 h-3.5" />
            <span>Pre-filled Development Credentials:</span>
          </p>
          <p className="text-neutral-400">Email: <strong>admin@auraseoul.com</strong></p>
          <p className="text-neutral-400">Password: <strong>admin123</strong></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Administrator Email
            </label>
            <div className="flex items-center border border-neutral-700 bg-neutral-950 px-3 py-2.5 focus-within:border-aura-accent">
              <Mail className="w-4 h-4 text-neutral-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Administrator Password
            </label>
            <div className="flex items-center border border-neutral-700 bg-neutral-950 px-3 py-2.5 focus-within:border-aura-accent">
              <Lock className="w-4 h-4 text-neutral-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-aura-accent hover:bg-aura-accentHover text-black py-3.5 px-6 font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 pt-2"
          >
            <span>{loading ? 'Verifying...' : 'Access Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <Link to="/" className="text-neutral-500 hover:text-white">
              ← Return to public clothing store
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
