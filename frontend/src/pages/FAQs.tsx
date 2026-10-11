import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQs: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'How does Aura Seoul sizing work? Should I size up or down?',
      a: 'Our graphic tees, hoodies, and cargo pants are tailored with modern Korean oversized proportions (wide chests, boxy drop shoulders). If you want that signature streetwear silhouette, take your regular size. If you prefer a traditional fitted look, we recommend sizing down one size.'
    },
    {
      q: 'How fast is delivery across India?',
      a: 'Orders are dispatched within 24 hours from our fulfillment hub in Bengaluru. Standard Express Delivery takes 2-4 business days for metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) and 3-5 days for other locations. Priority Air Shipping takes 1-2 business days.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, we provide Cash on Delivery across 19,000+ PIN codes in India. You can pay via cash or scan a dynamic UPI QR code on the delivery agent\'s terminal upon delivery.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 7-day hassle-free return and size exchange window from the date of delivery. Items must be unworn with original tags attached. We arrange free doorstep pickup directly from your address.'
    },
    {
      q: 'How do I track my active order?',
      a: 'Once your order is handed over to our logistics partner (Delhivery or BlueDart), you will receive a tracking AWB number. You can also visit our Track Order page anytime and enter your Order Number and phone number to see real-time milestone updates.'
    },
    {
      q: 'Are your fabrics 100% genuine and durable?',
      a: 'Absolutely. We custom mill our own textiles: 260 GSM combed cotton for t-shirts, 420 GSM loopback French terry for zip hoodies, and 14oz non-stretch denim. We do not use polyester blends in our core streetwear lines unless specified for technical outerwear.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          KNOWLEDGE BASE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Everything you need to know about our garment fits, shipping times, returns, and ordering process.
        </p>
      </div>

      <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
        {faqItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-5">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-sm sm:text-base font-bold text-aura-black hover:text-aura-accent transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-aura-black' : ''}`} />
              </button>
              {isOpen && (
                <div className="pt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
