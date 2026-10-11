import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from '../common/SearchModal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Promotional Announcement Bar */}
        <AnnouncementBar />

        {/* Main Navbar */}
        <nav
          className={`w-full bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
            isScrolled ? 'border-neutral-200 py-3 shadow-sm' : 'border-neutral-100 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Left: Mobile Hamburger & Desktop Navigation */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className="lg:hidden p-1 text-aura-black hover:text-aura-accent transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center space-x-6 text-[13px] font-semibold tracking-wider uppercase">
                  <Link
                    to="/"
                    className={`hover:text-aura-accent transition-colors ${
                      location.pathname === '/' ? 'text-aura-accent font-bold' : 'text-aura-black'
                    }`}
                  >
                    Home
                  </Link>

                  {/* Shop All with Mega Menu Dropdown */}
                  <div
                    className="relative group py-2"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                  >
                    <Link
                      to="/shop"
                      className={`flex items-center space-x-1 hover:text-aura-accent transition-colors ${
                        location.pathname.startsWith('/shop') ? 'text-aura-accent font-bold' : 'text-aura-black'
                      }`}
                    >
                      <span>Shop All</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {megaMenuOpen && (
                      <div className="absolute top-full left-0 w-[640px] bg-white shadow-2xl border border-neutral-200 p-6 grid grid-cols-3 gap-6 animate-fadeIn">
                        <div>
                          <h4 className="text-xs font-bold tracking-widest uppercase text-aura-accent mb-3 pb-1 border-b border-neutral-100">
                            Clothing Categories
                          </h4>
                          <ul className="space-y-2 text-xs normal-case font-medium text-neutral-600">
                            <li><Link to="/category/tops" className="hover:text-aura-black block">Tops & Blouses</Link></li>
                            <li><Link to="/category/t-shirts" className="hover:text-aura-black block">T-Shirts & Oversized Tees</Link></li>
                            <li><Link to="/category/shirts" className="hover:text-aura-black block">Relaxed Shirts</Link></li>
                            <li><Link to="/category/crop-tops" className="hover:text-aura-black block">Baby & Crop Tops</Link></li>
                            <li><Link to="/category/hoodies-and-sweatshirts" className="hover:text-aura-black block">Heavyweight Hoodies</Link></li>
                            <li><Link to="/category/jackets" className="hover:text-aura-black block">Bombers & Blazers</Link></li>
                            <li><Link to="/category/co-ord-sets" className="hover:text-aura-black block">Co-ord Sets</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold tracking-widest uppercase text-aura-accent mb-3 pb-1 border-b border-neutral-100">
                            Bottoms & Ethnic
                          </h4>
                          <ul className="space-y-2 text-xs normal-case font-medium text-neutral-600">
                            <li><Link to="/category/cargo-pants" className="hover:text-aura-black block">Parachute Cargo Pants</Link></li>
                            <li><Link to="/category/jeans" className="hover:text-aura-black block">Baggy Skate Jeans</Link></li>
                            <li><Link to="/category/wide-leg-pants" className="hover:text-aura-black block">Wide-Leg Pleated Pants</Link></li>
                            <li><Link to="/category/skirts" className="hover:text-aura-black block">Pleated Mini Skirts</Link></li>
                            <li><Link to="/category/dresses" className="hover:text-aura-black block">Satin Midi Dresses</Link></li>
                            <li><Link to="/category/kurtis" className="hover:text-aura-black block">Contemporary Kurtis</Link></li>
                            <li><Link to="/category/ethnic-wear" className="hover:text-aura-black block">Handwoven Ethnic Wear</Link></li>
                          </ul>
                        </div>

                        <div className="bg-neutral-50 p-4 border border-neutral-100 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-aura-accent">
                              Featured Aesthetic
                            </span>
                            <h5 className="font-display font-bold text-sm text-aura-black mt-1 mb-2">
                              Seoul Cyber Y2K
                            </h5>
                            <p className="text-[11px] normal-case text-neutral-500 leading-relaxed mb-4">
                              Explore vintage washes, metallic accents, and baggy silhouettes inspired by Hongdae streetwear.
                            </p>
                          </div>
                          <Link
                            to="/shop?style=Korean+Streetwear"
                            className="text-xs font-bold tracking-wider uppercase text-aura-black hover:text-aura-accent flex items-center space-x-1"
                          >
                            <span>Explore Drop</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/shop?gender=Women"
                    className="text-aura-black hover:text-aura-accent transition-colors"
                  >
                    Women
                  </Link>

                  <Link
                    to="/shop?gender=Men"
                    className="text-aura-black hover:text-aura-accent transition-colors"
                  >
                    Men
                  </Link>

                  <Link
                    to="/shop?gender=Unisex"
                    className="text-aura-black hover:text-aura-accent transition-colors"
                  >
                    Unisex
                  </Link>

                  <Link
                    to="/new-arrivals"
                    className="text-aura-black hover:text-aura-accent transition-colors flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-aura-accent inline" />
                    <span>New Arrivals</span>
                  </Link>

                  <Link
                    to="/trending"
                    className="text-aura-black hover:text-aura-accent transition-colors"
                  >
                    Trending
                  </Link>

                  <Link
                    to="/sale"
                    className="text-aura-crimson font-bold hover:opacity-80 transition-opacity"
                  >
                    Sale
                  </Link>
                </div>
              </div>

              {/* Center: Brand Logo */}
              <div className="flex-1 text-center lg:flex-initial">
                <Link to="/" className="inline-flex flex-col items-center group">
                  <span className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-widest2 text-aura-black group-hover:text-neutral-800 transition-colors uppercase">
                    AURA SEOUL
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-aura-accent -mt-1">
                    Atelier ✦ 2026
                  </span>
                </Link>
              </div>

              {/* Right: Icons (Search, Account, Wishlist, Bag) */}
              <div className="flex items-center space-x-4 sm:space-x-5">
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search clothing"
                  className="p-1.5 text-aura-black hover:text-aura-accent transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Account Icon with Dropdown */}
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setIsAccountOpen(prev => !prev)}
                    aria-label="User account"
                    className="p-1.5 text-aura-black hover:text-aura-accent transition-colors flex items-center"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white shadow-2xl border border-neutral-200 py-2 z-50 text-xs animate-fadeIn">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/70">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Signed in as</p>
                            <p className="font-bold text-aura-black truncate text-sm">{user.name}</p>
                            <p className="text-neutral-500 truncate text-[11px]">{user.email}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              to="/account"
                              className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-aura-black"
                            >
                              <User className="w-4 h-4 mr-2.5 text-neutral-400" />
                              <span>Account Dashboard</span>
                            </Link>

                            <Link
                              to="/account/orders"
                              className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-aura-black"
                            >
                              <Package className="w-4 h-4 mr-2.5 text-neutral-400" />
                              <span>Order History</span>
                            </Link>

                            <Link
                              to="/account/addresses"
                              className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-aura-black"
                            >
                              <MapPin className="w-4 h-4 mr-2.5 text-neutral-400" />
                              <span>Saved Addresses</span>
                            </Link>

                            <Link
                              to="/order-tracking"
                              className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-aura-black"
                            >
                              <Package className="w-4 h-4 mr-2.5 text-neutral-400" />
                              <span>Track Any Order</span>
                            </Link>

                            {isAdmin && (
                              <Link
                                to="/admin"
                                className="flex items-center px-4 py-2 text-aura-accent font-bold hover:bg-amber-50"
                              >
                                <Settings className="w-4 h-4 mr-2.5 text-aura-accent" />
                                <span>Admin Portal</span>
                              </Link>
                            )}
                          </div>

                          <div className="border-t border-neutral-100 pt-1">
                            <button
                              onClick={() => {
                                logout();
                                setIsAccountOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                            >
                              <LogOut className="w-4 h-4 mr-2.5" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-1">
                          <Link
                            to="/login"
                            className="block px-4 py-2.5 font-bold text-aura-black hover:bg-neutral-100"
                          >
                            Sign In / Login
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2.5 text-neutral-700 hover:bg-neutral-100"
                          >
                            Create New Account
                          </Link>
                          <div className="border-t border-neutral-100 my-1" />
                          <Link
                            to="/order-tracking"
                            className="block px-4 py-2 text-neutral-600 hover:bg-neutral-100"
                          >
                            Track Guest Order
                          </Link>
                          <Link
                            to="/admin/login"
                            className="block px-4 py-2 text-aura-accent font-semibold hover:bg-amber-50"
                          >
                            Admin Access
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist Icon */}
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="p-1.5 text-aura-black hover:text-aura-accent transition-colors relative"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-aura-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Shopping Bag Icon */}
                <Link
                  to="/cart"
                  aria-label="Shopping bag"
                  className="p-1.5 text-aura-black hover:text-aura-accent transition-colors relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-aura-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
                <span className="font-display font-black text-lg tracking-widest text-aura-black">
                  AURA SEOUL
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-aura-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-5 space-y-4 text-sm font-semibold tracking-wider uppercase">
                <Link to="/" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Home
                </Link>

                {/* Categories Accordion */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen(prev => !prev)}
                    className="w-full flex items-center justify-between py-2 border-b border-neutral-100 hover:text-aura-accent"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="pl-4 py-2 space-y-2 text-xs normal-case font-normal text-neutral-600 bg-neutral-50/50">
                      <Link to="/category/tops" className="block py-1">Tops & Blouses</Link>
                      <Link to="/category/t-shirts" className="block py-1">Oversized T-Shirts</Link>
                      <Link to="/category/cargo-pants" className="block py-1">Parachute Cargo Pants</Link>
                      <Link to="/category/jeans" className="block py-1">Baggy Jeans</Link>
                      <Link to="/category/hoodies-and-sweatshirts" className="block py-1">Hoodies & Sweatshirts</Link>
                      <Link to="/category/jackets" className="block py-1">Jackets & Blazers</Link>
                      <Link to="/category/skirts" className="block py-1">Skirts</Link>
                      <Link to="/category/dresses" className="block py-1">Dresses</Link>
                      <Link to="/category/ethnic-wear" className="block py-1">Ethnic & Kurtis</Link>
                      <Link to="/category/co-ord-sets" className="block py-1">Co-ord Sets</Link>
                      <Link to="/category/accessories" className="block py-1">Accessories</Link>
                    </div>
                  )}
                </div>

                <Link to="/shop" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Shop All Collections
                </Link>
                <Link to="/shop?gender=Women" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Women
                </Link>
                <Link to="/shop?gender=Men" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Men
                </Link>
                <Link to="/shop?gender=Unisex" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Unisex
                </Link>
                <Link to="/new-arrivals" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  New Arrivals
                </Link>
                <Link to="/trending" className="block py-2 border-b border-neutral-100 hover:text-aura-accent">
                  Trending
                </Link>
                <Link to="/sale" className="block py-2 border-b border-neutral-100 text-aura-crimson font-bold">
                  Sale & Offers
                </Link>
                <Link to="/order-tracking" className="block py-2 border-b border-neutral-100 text-neutral-600">
                  Track Order
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-neutral-200 bg-neutral-50 text-xs">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-aura-black">{user.name}</p>
                    <Link to="/account" className="text-aura-accent hover:underline">View Account</Link>
                  </div>
                  <button onClick={logout} className="text-red-600 font-semibold">Sign Out</button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="flex-1 bg-aura-black text-white text-center py-2.5 font-bold uppercase tracking-wider text-xs"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 border border-neutral-300 text-aura-black text-center py-2.5 font-bold uppercase tracking-wider text-xs hover:border-aura-black"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
