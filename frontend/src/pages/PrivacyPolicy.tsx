import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          LEGAL & DATA PROTECTION
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500">Effective Date: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            1. Information We Collect
          </h2>
          <p>
            When you visit or make a purchase at Aura Seoul, we collect personal information you provide to us, including your full name, email address, telephone number, shipping and billing addresses, and payment preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            2. Payment Security
          </h2>
          <p>
            We prioritize customer financial privacy. We never store or log raw credit card numbers or banking PINs on our servers. All digital transactions are securely routed through PCI-DSS Level 1 certified payment gateways with end-to-end cryptographic encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            3. Use of Personal Information
          </h2>
          <p>
            Your information is used strictly to fulfill orders, process payments, transmit dispatch tracking alerts, provide customer concierge support, and, with your consent, notify you of upcoming seasonal drops and exclusive promotions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            4. Your Rights
          </h2>
          <p>
            You have the right to request access to your stored personal data, edit your saved addresses at any time in your dashboard, or request permanent account deletion by contacting care@auraseoul.com.
          </p>
        </section>
      </div>
    </div>
  );
};
