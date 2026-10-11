import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [tab, setTab] = useState<'tops' | 'bottoms' | 'dresses'>('tops');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-aura-accent" />
            <h3 className="text-base font-bold tracking-wider uppercase font-display text-aura-black">
              Size & Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-aura-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector & Category Tabs */}
        <div className="px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-1 border border-neutral-200 p-0.5">
            <button
              onClick={() => setTab('tops')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === 'tops' ? 'bg-aura-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Tops & Hoodies
            </button>
            <button
              onClick={() => setTab('bottoms')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === 'bottoms' ? 'bg-aura-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Cargos & Jeans
            </button>
            <button
              onClick={() => setTab('dresses')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === 'dresses' ? 'bg-aura-black text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Dresses & Skirts
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-neutral-100 p-0.5 text-xs">
            <button
              onClick={() => setUnit('inches')}
              className={`px-2.5 py-1 font-semibold uppercase transition-colors ${
                unit === 'inches' ? 'bg-white shadow text-aura-black' : 'text-neutral-500'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 font-semibold uppercase transition-colors ${
                unit === 'cm' ? 'bg-white shadow text-aura-black' : 'text-neutral-500'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="p-6 overflow-x-auto">
          {tab === 'tops' && (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest ({unit})</th>
                  <th className="py-2.5 px-3">Length ({unit})</th>
                  <th className="py-2.5 px-3">Shoulder ({unit})</th>
                  <th className="py-2.5 px-3">Standard Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">XS</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '36"' : '91 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '26"' : '66 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '18"' : '46 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Slim Petite</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">S</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '38"' : '96 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '27"' : '68 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '19"' : '48 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Regular S</td>
                </tr>
                <tr className="bg-neutral-50/70">
                  <td className="py-3 px-3 font-bold text-aura-black">M</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '40"' : '101 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '28"' : '71 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '20"' : '51 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Relaxed Fit</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">L</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '42"' : '106 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '29"' : '74 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '21"' : '53 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Street Oversized</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">XL</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '44"' : '112 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '30"' : '76 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '22"' : '56 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Boxy Drop</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">XXL</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '46"' : '117 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '31"' : '79 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '23"' : '58 cm'}</td>
                  <td className="py-3 px-3 text-neutral-500">Ultra Baggy</td>
                </tr>
              </tbody>
            </table>
          )}

          {tab === 'bottoms' && (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Waist ({unit})</th>
                  <th className="py-2.5 px-3">Hip ({unit})</th>
                  <th className="py-2.5 px-3">Inseam ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">S (28-30)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '29-30"' : '73-76 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '38"' : '96 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '30"' : '76 cm'}</td>
                </tr>
                <tr className="bg-neutral-50/70">
                  <td className="py-3 px-3 font-bold text-aura-black">M (32)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '31-32"' : '78-81 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '40"' : '101 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '31"' : '79 cm'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">L (34)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '33-34"' : '84-86 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '42"' : '106 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '31.5"' : '80 cm'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">XL (36)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '35-36"' : '89-91 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '44"' : '112 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {tab === 'dresses' && (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust ({unit})</th>
                  <th className="py-2.5 px-3">Waist ({unit})</th>
                  <th className="py-2.5 px-3">Hips ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">XS (UK 6)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '25"' : '63 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '35"' : '89 cm'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">S (UK 8)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '34"' : '86 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '27"' : '68 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '37"' : '94 cm'}</td>
                </tr>
                <tr className="bg-neutral-50/70">
                  <td className="py-3 px-3 font-bold text-aura-black">M (UK 10)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '36"' : '91 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '29"' : '73 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '39"' : '99 cm'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-aura-black">L (UK 12)</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '38"' : '96 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '31"' : '78 cm'}</td>
                  <td className="py-3 px-3">{unit === 'inches' ? '41"' : '104 cm'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Measuring Tips */}
          <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-600 space-y-1">
            <p className="font-bold uppercase tracking-wider text-aura-black">💡 How to find your perfect fit:</p>
            <p>• <strong>Korean Streetwear Silhouettes:</strong> Our oversized graphic tees and hoodies are intentionally cut with drop shoulders and wider chests. If you prefer a regular tailored fit, order one size down.</p>
            <p>• <strong>Parachute Cargos:</strong> Built with adjustable elastic bungee toggles at the waist and cuffs to let you customize the stack over shoes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
