import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          LEGAL AGREEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-neutral-500">Effective Date: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or purchasing from the website of AURA SEOUL STUDIO PVT. LTD., you acknowledge and agree to be bound by these Terms and Conditions. If you do not agree, you may discontinue use of our site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            2. Product Descriptions & Color Accuracy
          </h2>
          <p>
            We take extreme care in photography to reproduce the accurate texture, silhouette, and hue of our garments. However, actual colors may slightly vary depending on individual monitor calibrations, device display profiles, and lighting conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            3. Pricing & Currency
          </h2>
          <p>
            All listed prices are displayed in Indian National Rupees (INR ₹) and are inclusive of applicable goods and service taxes (GST). Shipping charges and eligible coupon deductions are calculated and displayed prior to final order payment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            4. Intellectual Property
          </h2>
          <p>
            All graphics, logos, typography, visual layouts, editorial photography, and textile prints appearing on Aura Seoul are the proprietary intellectual property of Aura Seoul Studio Pvt. Ltd. and may not be reproduced without written authorization.
          </p>
        </section>
      </div>
    </div>
  );
};
