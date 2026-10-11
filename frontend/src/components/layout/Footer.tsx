import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Twitter, Youtube, Facebook, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribing(true);
    try {
      const res = await api.subscribeNewsletter(newsletterEmail);
      showToast(res.message || 'Subscribed successfully!', 'success');
      setNewsletterEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed.', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-aura-black text-neutral-300 border-t border-neutral-800">
      {/* Brand Value Pillars */}
      <div className="border-b border-neutral-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Truck className="w-6 h-6 text-aura-accent" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Free Express Shipping</h4>
            <p className="text-xs text-neutral-400">On all orders above ₹999 across India</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <RotateCcw className="w-6 h-6 text-aura-accent" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">7-Day Easy Returns</h4>
            <p className="text-xs text-neutral-400">Hassle-free doorstep pickup & exchange</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <ShieldCheck className="w-6 h-6 text-aura-accent" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">100% Authentic Fabric</h4>
            <p className="text-xs text-neutral-400">Heavyweight custom textiles & precision cuts</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <Clock className="w-6 h-6 text-aura-accent" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Dedicated Support</h4>
            <p className="text-xs text-neutral-400">Mon-Sat 10:00 AM - 7:00 PM IST</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="font-display text-2xl font-black tracking-widest2 text-white uppercase">
                AURA SEOUL
              </span>
              <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
                Contemporary Korean Streetwear & Y2K Aesthetics
              </p>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Born from the raw energy of Seoul’s Hongdae and Seongsu districts. We craft elevated everyday clothing, oversized heavyweight basics, and utilitarian cyber-streetwear for those who define their own aesthetic.
            </p>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleSubscribe} className="space-y-2 max-w-md">
              <label htmlFor="newsletter" className="block text-xs font-bold tracking-widest uppercase text-white">
                Get First Access to Limited Drops
              </label>
              <div className="flex border border-neutral-700 bg-neutral-900 focus-within:border-aura-accent">
                <input
                  id="newsletter"
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-transparent px-4 py-3 text-xs text-white placeholder-neutral-500 w-full outline-none"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-white text-aura-black px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-aura-accent transition-colors flex items-center justify-center flex-shrink-0"
                >
                  {subscribing ? '...' : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-neutral-500">
                By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </form>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white border-b border-neutral-800 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/trending" className="hover:text-white transition-colors">Trending Now</Link></li>
              <li><Link to="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/category/cargo-pants" className="hover:text-white transition-colors">Parachute Cargos</Link></li>
              <li><Link to="/category/t-shirts" className="hover:text-white transition-colors">Acid Wash Graphic Tees</Link></li>
              <li><Link to="/category/hoodies-and-sweatshirts" className="hover:text-white transition-colors">Heavyweight Hoodies</Link></li>
              <li><Link to="/category/dresses" className="hover:text-white transition-colors">Midi Slip Dresses</Link></li>
              <li><Link to="/category/ethnic-wear" className="hover:text-white transition-colors">Indie Ethnic Fusion</Link></li>
              <li><Link to="/sale" className="text-aura-accent hover:underline font-bold">Seasonal Sale (Up to 35% Off)</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Care & Tracking */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white border-b border-neutral-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/order-tracking" className="hover:text-white text-aura-accent font-semibold flex items-center space-x-1"><span>Track Your Order</span></Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size & Fit Guide</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Info</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns, Exchanges & Refunds</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us / Care Atelier</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Manage Saved Addresses</Link></li>
            </ul>
          </div>

          {/* Column 3: The Brand & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white border-b border-neutral-800 pb-2">
              About & Legal
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Brand Story</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/admin/login" className="text-neutral-500 hover:text-aura-accent text-[11px] transition-colors">Staff / Admin Portal</Link></li>
            </ul>
            <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-400">Customer Care Hotline:</p>
              <p>care@auraseoul.com</p>
              <p>+91 80 4920 1800 (10 AM - 7 PM)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="border-t border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} AURA SEOUL STUDIO PVT. LTD. All Rights Reserved.</p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 mr-1">Accepted Payments:</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">UPI / GPay</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">Visa</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">Mastercard</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">RuPay</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">Net Banking</span>
            <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-bold">Cash On Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
