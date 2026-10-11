import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-aura-black">
          <Compass className="w-8 h-8 text-aura-accent animate-pulse" />
        </div>
        <span className="text-6xl font-black font-display text-aura-black block tracking-widest">
          404
        </span>
        <h1 className="text-xl font-bold font-display uppercase tracking-wider text-aura-black">
          Page Not In The Wardrobe
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          The link you followed may be broken or the garment collection has moved to a new destination in our Seoul archive.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            to="/"
            className="bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/shop"
            className="border border-neutral-300 hover:border-aura-black text-aura-black px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
