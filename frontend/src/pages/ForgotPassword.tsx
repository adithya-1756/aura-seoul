import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      showToast(res.message, 'success');
      setSubmitted(true);
    } catch (err: any) {
      showToast(err.message || 'Request failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Forgot Password
        </h1>
        <p className="text-xs text-neutral-500">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-5 text-xs shadow-sm">
        {submitted ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="font-bold text-aura-black text-sm">Reset Link Sent</p>
            <p className="text-neutral-500 text-xs">
              If an account is associated with {email}, you will receive a secure password reset link shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-aura-accent hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-aura-black text-white py-3.5 px-6 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-neutral-500 hover:text-aura-black">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
