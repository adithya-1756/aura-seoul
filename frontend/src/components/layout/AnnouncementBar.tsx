import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultAnnouncements = [
  '✨ FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹999 ACROSS INDIA',
  '🇰🇷 NEW AUTUMN/WINTER SEOUL STREETWEAR DROP VOL. 04 NOW LIVE',
  '🎁 USE CODE "WELCOME10" FOR 10% OFF YOUR FIRST ORDER | CODE "KOREAN20" ON STREETWEAR'
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % defaultAnnouncements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + defaultAnnouncements.length) % defaultAnnouncements.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % defaultAnnouncements.length);
  };

  return (
    <div className="bg-aura-black text-aura-offwhite py-2 px-4 text-xs font-medium tracking-widest uppercase border-b border-aura-charcoal/50 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-neutral-400 hover:text-aura-accent transition-colors p-1 hidden sm:block"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center truncate flex items-center justify-center space-x-2">
          <Sparkles className="w-3 h-3 text-aura-accent flex-shrink-0 animate-pulse hidden xs:inline" />
          <Link to="/sale" className="hover:text-aura-accent transition-colors truncate">
            {defaultAnnouncements[currentIndex]}
          </Link>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-neutral-400 hover:text-aura-accent transition-colors p-1 hidden sm:block"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
