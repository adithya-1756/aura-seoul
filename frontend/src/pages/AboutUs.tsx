import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Feather } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          THE ATELIER STORY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-aura-black leading-tight">
          Where Seoul Subculture Meets Indian Craftsmanship
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Founded in 2026, AURA SEOUL is a contemporary fashion house born at the intersection of Korean underground streetwear and mindful artisanal tailoring.
        </p>
      </div>

      {/* Editorial Split Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="aspect-[4/5] bg-neutral-100 overflow-hidden border border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
            alt="Aura Seoul Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-aura-black">
            Our Philosophy: Uncompromising Silhouettes
          </h2>
          <p>
            Fast fashion has commoditized clothing into disposable fabric. At Aura Seoul, we take the opposite path. We build garments around silhouette first: generous boxy chest proportions, dropped shoulders that drape naturally, articulated knees on parachute poplin, and heavyweight 260-420 GSM pure cottons.
          </p>
          <p>
            Every piece is designed to stack effortlessly over thick sneakers, hold its structured shape across countless washes, and make an immediate aesthetic statement without screaming for attention.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-aura-black text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              <span>Explore The Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-neutral-200">
        <div className="space-y-2 p-6 bg-neutral-50 border border-neutral-200">
          <Feather className="w-6 h-6 text-aura-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black">Heavyweight Textiles</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            From 420 GSM loopback French terry to 14oz non-stretch denim, our fabrics feel substantial in your hands and drape cleanly on the body.
          </p>
        </div>

        <div className="space-y-2 p-6 bg-neutral-50 border border-neutral-200">
          <Sparkles className="w-6 h-6 text-aura-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black">Seoul x Indie Fusion</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We bridge Y2K metallic cyber aesthetics and Korean streetwear with authentic handblock Chanderi techniques for truly original drops.
          </p>
        </div>

        <div className="space-y-2 p-6 bg-neutral-50 border border-neutral-200">
          <ShieldCheck className="w-6 h-6 text-aura-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black">Conscious Drops</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We produce in intentional, limited runs to prevent overproduction and preserve rarity. When a volume sells out, it rarely returns.
          </p>
        </div>
      </div>
    </div>
  );
};
