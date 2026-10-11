import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) {
      navigate(redirectPath);
    }
  };

  const handleDemoFill = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setEmail('customer@auraseoul.com');
      setPassword('customer123');
    } else {
      setEmail('admin@auraseoul.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          CUSTOMER ACCESS
        </span>
        <h1 className="text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Sign In
        </h1>
        <p className="text-xs text-neutral-500">
          Access your personal wardrobe dashboard, saved addresses, and order history.
        </p>
      </div>

      {/* Demo Credentials Helper Box */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 text-xs space-y-2">
        <p className="font-bold uppercase tracking-wider text-aura-black flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-aura-accent" />
          <span>Quick Demo Sign-In Credentials</span>
        </p>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleDemoFill('customer')}
            className="flex-1 bg-white border border-neutral-300 py-1.5 px-2 text-[11px] font-semibold text-aura-black hover:border-aura-black transition-colors"
          >
            Fill Demo Customer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin')}
            className="flex-1 bg-white border border-neutral-300 py-1.5 px-2 text-[11px] font-semibold text-aura-accent hover:border-aura-black transition-colors"
          >
            Fill Demo Admin
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-5 text-xs shadow-sm">
        <div>
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Email Address
          </label>
          <div className="flex items-center border border-neutral-300 px-3 py-2.5 focus-within:border-aura-black">
            <Mail className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-xs outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold uppercase tracking-wider text-neutral-600">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] text-aura-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center border border-neutral-300 px-3 py-2.5 focus-within:border-aura-black">
            <Lock className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs outline-none bg-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-aura-black ml-2"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-aura-black text-white py-3.5 px-6 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-neutral-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-aura-black hover:underline">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};
