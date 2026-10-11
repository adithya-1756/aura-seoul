import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';

export const Trending: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ isTrending: 'true', limit: 20 }).then(res => {
      if (res.success) setProducts(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">Trending</span>
      </div>

      <div className="border-b border-neutral-200 pb-6">
        <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-widest uppercase text-aura-crimson mb-1">
          <Flame className="w-3.5 h-3.5" />
          <span>High Demand Aesthetics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
          Trending Products
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          The pieces dominating street style feeds from Hongdae to Mumbai.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase font-bold tracking-widest text-neutral-400">
          Loading trending items...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
