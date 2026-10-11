import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product, Category } from '../types';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<string>('recommended');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategoryBySlug(slug),
          api.getProducts({ category: slug, sort })
        ]);

        if (catRes.success) setCategory(catRes.data);
        if (prodRes.success) setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-aura-black">Shop All</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">{category?.name || slug}</span>
      </div>

      {/* Category Editorial Banner */}
      <div className="relative overflow-hidden aspect-[21/6] bg-aura-black flex items-center border border-neutral-200">
        <img
          src={category?.image || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80'}
          alt={category?.name || 'Category'}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-105"
        />
        <div className="relative z-10 p-6 sm:p-12 text-white space-y-2 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent">
            CATEGORY CATALOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight">
            {category?.name || slug}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            {category?.description || 'Discover elevated designs crafted for modern individuality.'}
          </p>
        </div>
      </div>

      {/* Control Row: Item Count and Sort */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          Showing {products.length} Products
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sort:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-aura-black outline-none focus:border-aura-black cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-seller">Best Selling</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Sparkles className="w-8 h-8 text-aura-accent animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">Loading category...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300 p-8 space-y-4">
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black">
            New items dropping soon in {category?.name || slug}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Our atelier is actively tailoring fresh designs for this collection. Explore our other streetwear categories in the meantime!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-aura-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Explore Other Collections
          </Link>
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
