import React, { useState } from 'react';
import { Ruler, Sparkles } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          PERFECT FIT GUARANTEE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Comprehensive Size Guide
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Accurate body measurements and garment dimensions across all our Seoul streetwear cuts and tailored trousers.
        </p>

        {/* Toggle unit */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex border border-neutral-300 p-0.5 text-xs font-bold uppercase">
            <button
              onClick={() => setUnit('inches')}
              className={`px-4 py-1.5 transition-colors ${unit === 'inches' ? 'bg-aura-black text-white' : 'text-neutral-500'}`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 transition-colors ${unit === 'cm' ? 'bg-aura-black text-white' : 'text-neutral-500'}`}
            >
              Centimeters (CM)
            </button>
          </div>
        </div>
      </div>

      {/* Tops and T-Shirts Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black border-b border-neutral-200 pb-2">
          1. Tops, Graphic Tees & Hoodies
        </h2>
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
              <tr>
                <th className="p-3">Size Label</th>
                <th className="p-3">Chest Circumference ({unit})</th>
                <th className="p-3">Body Length ({unit})</th>
                <th className="p-3">Shoulder Width ({unit})</th>
                <th className="p-3">Silhouette Aesthetic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-3 font-bold text-aura-black">XS</td>
                <td className="p-3">{unit === 'inches' ? '36"' : '91 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '26"' : '66 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '18"' : '46 cm'}</td>
                <td className="p-3 text-neutral-500">Slim / Cropped Fit</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">S</td>
                <td className="p-3">{unit === 'inches' ? '38"' : '96 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '27"' : '68 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '19"' : '48 cm'}</td>
                <td className="p-3 text-neutral-500">Slight Drop Shoulder</td>
              </tr>
              <tr className="bg-neutral-50">
                <td className="p-3 font-bold text-aura-black">M</td>
                <td className="p-3">{unit === 'inches' ? '40"' : '101 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '28"' : '71 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '20"' : '51 cm'}</td>
                <td className="p-3 text-neutral-500">Signature Boxy Fit</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">L</td>
                <td className="p-3">{unit === 'inches' ? '42"' : '106 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '29"' : '74 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '21"' : '53 cm'}</td>
                <td className="p-3 text-neutral-500">Seoul Oversized</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">XL</td>
                <td className="p-3">{unit === 'inches' ? '44"' : '112 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '30"' : '76 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '22"' : '56 cm'}</td>
                <td className="p-3 text-neutral-500">Heavy Street Draped</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">XXL</td>
                <td className="p-3">{unit === 'inches' ? '46"' : '117 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '31"' : '79 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '23"' : '58 cm'}</td>
                <td className="p-3 text-neutral-500">Ultra Relaxed Skate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cargos and Bottoms */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-aura-black border-b border-neutral-200 pb-2">
          2. Parachute Cargos, Wide-Leg Trousers & Denim
        </h2>
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase border-b border-neutral-200">
              <tr>
                <th className="p-3">Waist Size</th>
                <th className="p-3">Waist Range ({unit})</th>
                <th className="p-3">Hip Circumference ({unit})</th>
                <th className="p-3">Inseam Length ({unit})</th>
                <th className="p-3">Hem Opening</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-3 font-bold text-aura-black">S (28-30)</td>
                <td className="p-3">{unit === 'inches' ? '29-30"' : '73-76 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '38"' : '96 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '30"' : '76 cm'}</td>
                <td className="p-3 text-neutral-500">Bungee Adjustable</td>
              </tr>
              <tr className="bg-neutral-50">
                <td className="p-3 font-bold text-aura-black">M (32)</td>
                <td className="p-3">{unit === 'inches' ? '31-32"' : '78-81 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '40"' : '101 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '31"' : '79 cm'}</td>
                <td className="p-3 text-neutral-500">Bungee Adjustable</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">L (34)</td>
                <td className="p-3">{unit === 'inches' ? '33-34"' : '84-86 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '42"' : '106 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '31.5"' : '80 cm'}</td>
                <td className="p-3 text-neutral-500">Bungee Adjustable</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-aura-black">XL (36)</td>
                <td className="p-3">{unit === 'inches' ? '35-36"' : '89-91 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '44"' : '112 cm'}</td>
                <td className="p-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                <td className="p-3 text-neutral-500">Bungee Adjustable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
