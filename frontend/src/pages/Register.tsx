import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    const success = await register({
      name,
      email,
      phone,
      password,
      confirmPassword
    });
    setLoading(false);
    if (success) {
      navigate('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          JOIN AURA SEOUL
        </span>
        <h1 className="text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Create Account
        </h1>
        <p className="text-xs text-neutral-500">
          Unlock private drop invitations, priority express shipping, and seamless address saving.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 text-xs shadow-sm">
        <div>
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Full Name *
          </label>
          <div className="flex items-center border border-neutral-300 px-3 py-2.5 focus-within:border-aura-black">
            <User className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rohan Sharma"
              className="w-full text-xs outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Email Address *
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
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Phone Number (Optional)
          </label>
          <div className="flex items-center border border-neutral-300 px-3 py-2.5 focus-within:border-aura-black">
            <Phone className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full text-xs outline-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Password (Min 6 chars) *
          </label>
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

        <div>
          <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Confirm Password *
          </label>
          <div className="flex items-center border border-neutral-300 px-3 py-2.5 focus-within:border-aura-black">
            <Lock className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-aura-black text-white py-3.5 px-6 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 pt-2"
        >
          <span>{loading ? 'Creating Account...' : 'Register'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-neutral-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-aura-black hover:underline">
            Sign In Here
          </Link>
        </div>
      </form>
    </div>
  );
};
