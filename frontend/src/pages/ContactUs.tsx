import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactUs: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    showToast('Your message has been received! Our atelier care team will reply within 24 hours.', 'success');
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          CONCIERGE & CARE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Contact Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Need sizing counsel, assistance with an ongoing order, or wholesale inquiries? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Left (5 cols) */}
        <div className="md:col-span-5 bg-neutral-50 p-6 sm:p-8 border border-neutral-200 space-y-6 text-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-aura-black border-b border-neutral-200 pb-3">
            Contact Information
          </h2>

          <div className="space-y-4 text-neutral-700">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-aura-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-aura-black">Customer Care Email</strong>
                <p>care@auraseoul.com</p>
                <p className="text-neutral-400 text-[11px]">Response time: Under 4 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-aura-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-aura-black">Direct Phone Hotline</strong>
                <p>+91 80 4920 1800</p>
                <p className="text-neutral-400 text-[11px]">Mon-Sat, 10:00 AM - 7:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-aura-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-aura-black">Design Studio & Headquarters</strong>
                <p>Aura Seoul Atelier, 100ft Road,</p>
                <p>Indiranagar, Bengaluru 560038, Karnataka, India</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-aura-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-aura-black">Order Dispatch Hours</strong>
                <p>Orders placed before 2:00 PM IST are dispatched on the same business day.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form Right (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-aura-black border-b border-neutral-100 pb-3">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-aura-black text-sm">Message Received</p>
              <p className="text-xs text-neutral-500">Thank you for contacting us. A member of our concierge team will respond shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-block mt-2 text-xs font-bold uppercase tracking-wider text-aura-accent hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ananya Mehra"
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Subject / Order ID</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Size exchange for Order #AURA-2603-9182"
                  className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can our stylists or logistics team assist you?"
                  className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-aura-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
