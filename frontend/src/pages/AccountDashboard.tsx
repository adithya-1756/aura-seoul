import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  Lock,
  LogOut,
  ShieldCheck,
  Settings,
  ChevronRight,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const AccountDashboard: React.FC = () => {
  const { user, logout, refreshUser, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Edit Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold font-display uppercase text-aura-black">Please Sign In</h2>
        <p className="text-xs text-neutral-500">You must be logged in to access your account dashboard.</p>
        <Link to="/login" className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
          Sign In
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await api.updateProfile({ name, phone });
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        refreshUser();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Both passwords are required.', 'error');
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast('Password updated successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      showToast(err.message || 'Password update failed.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
            WARDROBE DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-aura-accent hover:bg-aura-accentHover text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="border border-neutral-300 hover:border-aura-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-aura-black transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/account/orders"
          className="bg-white p-6 border border-neutral-200 hover:border-aura-black transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neutral-100 group-hover:bg-aura-black group-hover:text-white rounded-none flex items-center justify-center transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-aura-black">Order History</p>
              <p className="text-xs text-neutral-500">Track shipments & invoices</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-aura-black" />
        </Link>

        <Link
          to="/account/addresses"
          className="bg-white p-6 border border-neutral-200 hover:border-aura-black transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neutral-100 group-hover:bg-aura-black group-hover:text-white rounded-none flex items-center justify-center transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-aura-black">Saved Addresses</p>
              <p className="text-xs text-neutral-500">Manage delivery locations</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-aura-black" />
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-6 border border-neutral-200 hover:border-aura-black transition-all group flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neutral-100 group-hover:bg-aura-black group-hover:text-white rounded-none flex items-center justify-center transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-aura-black">My Wishlist</p>
              <p className="text-xs text-neutral-500">Saved favorite drops</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-aura-black" />
        </Link>
      </div>

      {/* Profile & Security Management Tabs */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-aura-black text-aura-black bg-white'
                : 'border-transparent text-neutral-500 hover:text-aura-black'
            }`}
          >
            Edit Profile Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-aura-black text-aura-black bg-white'
                : 'border-transparent text-neutral-500 hover:text-aura-black'
            }`}
          >
            Password & Security
          </button>
        </div>

        <div className="p-6 sm:p-8 max-w-xl">
          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Email Address (Immutable)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-neutral-200 bg-neutral-100 p-3 text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                {updatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  New Password (Min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                {updatingPassword ? 'Updating Password...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
