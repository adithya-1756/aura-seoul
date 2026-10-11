import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Ticket,
  Sliders,
  LogOut,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Products', icon: Shirt, path: '/admin/products' },
    { label: 'Categories', icon: FolderTree, path: '/admin/categories' },
    { label: 'Orders & Fulfillment', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Customers', icon: Users, path: '/admin/customers' },
    { label: 'Inventory & Stock', icon: Boxes, path: '/admin/inventory' },
    { label: 'Coupons & Discounts', icon: Ticket, path: '/admin/coupons' },
    { label: 'Content & Banners', icon: Sliders, path: '/admin/content' },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-950 p-8 border border-neutral-800 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-white">Access Restricted</h2>
          <p className="text-xs text-neutral-400">
            You must be logged in as an authorized administrator to access the Aura Seoul management portal.
          </p>
          <div className="pt-4 flex space-x-3">
            <button
              onClick={() => navigate('/admin/login')}
              className="flex-1 bg-aura-accent hover:bg-aura-accentHover text-black py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Admin Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 border border-neutral-700 hover:border-white py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between flex-shrink-0 min-h-screen">
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-neutral-800">
            <Link to="/admin" className="block">
              <span className="font-display font-black text-lg tracking-widest text-white uppercase">
                AURA SEOUL
              </span>
              <span className="block text-[10px] font-bold tracking-[0.25em] text-aura-accent uppercase">
                ADMIN CONSOLE
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-aura-accent text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-3 bg-neutral-950/60">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-neutral-400 hover:text-aura-accent py-1.5 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Store Admin</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold font-display uppercase tracking-wider text-white">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
              ● API Online
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
