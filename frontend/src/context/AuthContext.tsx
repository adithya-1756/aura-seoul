import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (details: any) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refreshUser = async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('aura_token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('aura_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      const res = await api.login(credentials);
      if (res.success && res.token) {
        localStorage.setItem('aura_token', res.token);
        setUser(res.user);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
      return false;
    }
  };

  const register = async (details: any): Promise<boolean> => {
    try {
      const res = await api.register(details);
      if (res.success && res.token) {
        localStorage.setItem('aura_token', res.token);
        setUser(res.user);
        showToast(res.message || 'Welcome to Aura Seoul!', 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
