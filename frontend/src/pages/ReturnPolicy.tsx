import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          WORRY-FREE GUARANTEE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Returns, Exchanges & Refund Policy
        </h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            1. 7-Day Doorstep Return & Size Exchange Window
          </h2>
          <p>
            We want you to love how your garments look and feel. If you are not satisfied with your purchase or require an alternative size, you may request a return or exchange within <strong>7 days</strong> from the recorded delivery date.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            2. Return Eligibility Conditions
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600">
            <li>The garment must be unworn, unwashed, and undamaged.</li>
            <li>All original Aura Seoul designer tags, branded barcodes, and dust bags must be attached and intact.</li>
            <li>Footwear (if any) and jewelry/accessories must be returned in their original undamaged presentation boxes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            3. Reverse Pickup Process
          </h2>
          <p>
            Once you submit a return or exchange request via your <Link to="/account/orders" className="text-aura-accent font-bold hover:underline">Order History page</Link>, our courier partner will arrive at your address within 24 to 48 hours for complimentary reverse pickup.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            4. Refund Timelines
          </h2>
          <p>
            • <strong>Prepaid Orders (UPI, Netbanking, Cards):</strong> Refund is credited directly back to the original source bank account within 3 to 5 business days after our quality inspection at the warehouse.
            <br />
            • <strong>Cash on Delivery (COD):</strong> Refund is credited via instant IMPS bank transfer or UPI ID provided during return initiation.
          </p>
        </section>
      </div>
    </div>
  );
};
