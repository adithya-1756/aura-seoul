import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, TrendingUp, History } from 'lucide-react';
import { api } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('aura_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getSearchSuggestions(query);
        if (res.success) {
          setResults({
            products: res.products || [],
            categories: res.categories || []
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('aura_recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="bg-white w-full max-w-3xl rounded-none shadow-2xl border border-neutral-200 overflow-hidden animate-fadeIn">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-6 py-4 border-b border-neutral-200">
          <Search className="w-6 h-6 text-neutral-400 mr-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clothes, streetwear, categories, styles (e.g. Parachute Cargo, Graphic Tee)..."
            className="w-full text-lg tracking-wide text-aura-black placeholder-neutral-400 outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-neutral-400 hover:text-aura-black"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-aura-black px-2 py-1"
          >
            ESC
          </button>
        </form>

        {/* Content Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {!query.trim() ? (
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                    <History className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-aura-black hover:text-white text-xs text-neutral-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                  <TrendingUp className="w-4 h-4 text-aura-accent" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Parachute Cargo', 'Acid Wash Graphic Tee', 'Zip Hoodie', 'Pleated Trousers', 'Baby Tee', 'Slip Dress', 'Co-ord Sets'].map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectRecent(term)}
                      className="px-3 py-1.5 border border-neutral-200 hover:border-aura-black hover:bg-neutral-50 text-xs text-neutral-800 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {loading && (
                <div className="py-8 text-center text-xs tracking-widest uppercase text-neutral-400">
                  Searching catalog...
                </div>
              )}

              {!loading && results.products.length === 0 && results.categories.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-base text-neutral-600 mb-2">No results found for "{query}"</p>
                  <p className="text-xs text-neutral-400">Try searching for styles like "Streetwear", "Y2K", "Hoodie", or "Jeans"</p>
                </div>
              )}

              {/* Matching Categories */}
              {results.categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          navigate(`/category/${c.slug}`);
                        }}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-aura-black hover:text-white text-xs font-medium transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Products */}
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400">
                      Products ({results.products.length})
                    </h4>
                    <button
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-aura-accent hover:underline flex items-center space-x-1"
                    >
                      <span>View All Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          saveRecentSearch(p.name);
                          onClose();
                          navigate(`/product/${p.slug || p.id}`);
                        }}
                        className="flex items-center p-2.5 border border-neutral-100 hover:border-aura-black cursor-pointer transition-all hover:bg-neutral-50 group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-20 object-cover mr-3 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-400 uppercase tracking-wider">{p.style || p.gender}</p>
                          <h5 className="text-sm font-semibold text-aura-black truncate group-hover:text-aura-accent transition-colors">
                            {p.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-bold text-aura-black">₹{p.price}</span>
                            {p.originalPrice && (
                              <span className="text-xs text-neutral-400 line-through">₹{p.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
