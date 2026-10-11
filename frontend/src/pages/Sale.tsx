import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Percent, Tag } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';

export const Sale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ isOnSale: 'true', sort: 'discount', limit: 24 }).then(res => {
      if (res.success) setProducts(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">Sale & Offers</span>
      </div>

      {/* Sale Banner */}
      <div className="bg-aura-black text-white p-6 sm:p-10 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-widest uppercase bg-aura-crimson text-white px-2 py-0.5">
            <Percent className="w-3 h-3" />
            <span>SEASONAL CLEARANCE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight">
            Up to 35% Off Selected Drops
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Limited stock items on special promotion. Use coupon <code className="text-aura-accent font-bold">WELCOME10</code> for an extra 10% off your first checkout.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-aura-accent font-bold">
            <Tag className="w-4 h-4" />
            <span>Active Promotion Coupons:</span>
          </div>
          <p className="text-neutral-300">• <span className="font-bold text-white">WELCOME10</span> : 10% Off First Order</p>
          <p className="text-neutral-300">• <span className="font-bold text-white">KOREAN20</span> : 20% Off Streetwear Drop</p>
          <p className="text-neutral-300">• <span className="font-bold text-white">Y2KVIBES</span> : Flat ₹500 Off above ₹2,499</p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs uppercase font-bold tracking-widest text-neutral-400">
          Loading discounted pieces...
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
