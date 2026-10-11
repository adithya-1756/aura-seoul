import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, X } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getProducts({ search: query, limit: 30 }).then(res => {
      if (res.success) setProducts(res.data || []);
      setLoading(false);
    });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">Search Results</span>
      </div>

      {/* Search Header Form */}
      <div className="border-b border-neutral-200 pb-6 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Search Results {query && `for "${query}"`}
        </h1>

        <form onSubmit={handleSearchSubmit} className="max-w-xl flex border border-neutral-300 focus-within:border-aura-black">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products by style, fabric, aesthetic..."
            className="flex-1 px-4 py-3 text-xs text-aura-black outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              className="p-3 text-neutral-400 hover:text-aura-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Search
          </button>
        </form>

        <p className="text-xs text-neutral-500">
          Showing {products.length} matching pieces
        </p>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs uppercase font-bold tracking-widest text-neutral-400">
          Searching catalogue...
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300 p-8 space-y-4">
          <p className="text-base text-neutral-700">No items matched your search query "{query}".</p>
          <p className="text-xs text-neutral-400">Try searching for keywords like "Hoodie", "Cargo", "Acid Wash", or "Midi Dress".</p>
          <Link
            to="/shop"
            className="inline-block bg-aura-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Explore All Collections
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
