import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          LOGISTICS & FULFILLMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            1. Free Shipping Threshold
          </h2>
          <p>
            We offer <strong>Free Standard Express Shipping</strong> on all prepaid and Cash on Delivery orders totaling <strong>₹999 or more</strong> across all deliverable PIN codes in India.
          </p>
          <p>
            For orders below ₹999, a nominal flat shipping fee of ₹99 is applied at checkout to cover courier freight and protective eco-packaging.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            2. Processing & Dispatch Timelines
          </h2>
          <p>
            All garments are quality-checked, steam-pressed, and packed into our signature dust bags at our central fulfillment warehouse in Bengaluru, Karnataka.
          </p>
          <p>
            • Orders placed before 2:00 PM IST on business days (Mon-Sat) are processed and dispatched on the same day.
            <br />
            • Orders placed after 2:00 PM IST or on Sundays/national holidays are dispatched on the next working business day.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            3. Estimated Transit Times
          </h2>
          <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-1 text-xs">
            <p>• <strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 3 Business Days.</p>
            <p>• <strong>Tier 2 & Tier 3 Cities / Rest of India:</strong> 3 to 5 Business Days.</p>
            <p>• <strong>Priority Air Express:</strong> 1 to 2 Business Days across major airport hubs (optional upgrade ₹199).</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            4. Live Tracking & Courier Partners
          </h2>
          <p>
            We partner with trusted premier air courier networks including <strong>Delhivery Express</strong>, <strong>BlueDart</strong>, and <strong>XpressBees</strong>.
          </p>
          <p>
            As soon as your package is dispatched, you will receive an SMS and email notification with an active AWB tracking link. You can also view live milestone updates at any time on our website via the <strong>Track Order</strong> portal.
          </p>
        </section>
      </div>
    </div>
  );
};
