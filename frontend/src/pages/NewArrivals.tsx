import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';

export const NewArrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts({ isNewArrival: 'true', sort }).then(res => {
      if (res.success) setProducts(res.data || []);
      setLoading(false);
    });
  }, [sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">New Arrivals</span>
      </div>

      <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold tracking-widest uppercase text-aura-accent mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn / Winter 2026 Drops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
            New Arrivals
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            The freshest pieces direct from our Seoul and Indian design ateliers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sort:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-aura-black outline-none focus:border-aura-black cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-seller">Popularity</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Sparkles className="w-8 h-8 text-aura-accent animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">Loading new drops...</p>
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
