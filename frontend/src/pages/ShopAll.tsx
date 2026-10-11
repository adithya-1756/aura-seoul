import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product, Category } from '../types';

export const ShopAll: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters from query params
  const currentCategory = searchParams.get('category') || '';
  const currentStyle = searchParams.get('style') || '';
  const currentGender = searchParams.get('gender') || '';
  const currentSort = searchParams.get('sort') || 'recommended';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentDiscount = searchParams.get('discount') || '';
  const currentRating = searchParams.get('rating') || '';

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    api.getCategories().then(res => {
      if (res.success) setCategories(res.data || []);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          sort: currentSort,
          limit: 30
        };
        if (currentCategory) params.category = currentCategory;
        if (currentStyle) params.style = currentStyle;
        if (currentGender) params.gender = currentGender;
        if (currentMinPrice) params.minPrice = currentMinPrice;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;
        if (currentSize) params.size = currentSize;
        if (currentColor) params.color = currentColor;
        if (currentDiscount) params.discount = currentDiscount;
        if (currentRating) params.rating = currentRating;

        const res = await api.getProducts(params);
        if (res.success) {
          setProducts(res.data || []);
          setTotalCount(res.meta?.total || (res.data || []).length);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentCategory,
    currentStyle,
    currentGender,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentSize,
    currentColor,
    currentDiscount,
    currentRating
  ]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handlePriceApply = () => {
    const next = new URLSearchParams(searchParams);
    if (minPriceInput) next.set('minPrice', minPriceInput);
    else next.delete('minPrice');

    if (maxPriceInput) next.set('maxPrice', maxPriceInput);
    else next.delete('maxPrice');

    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    currentCategory ||
    currentStyle ||
    currentGender ||
    currentMinPrice ||
    currentMaxPrice ||
    currentSize ||
    currentColor ||
    currentDiscount ||
    currentRating
  );

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Charcoal', hex: '#333333' },
    { name: 'Sage', hex: '#4A5B4E' },
    { name: 'Taupe', hex: '#B8A693' },
    { name: 'Pink', hex: '#F7C6D9' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Navy', hex: '#1E2D4A' }
  ];
  const availableStyles = [
    'Korean Streetwear',
    'Y2K Fashion',
    'Minimalist Style',
    'Casual Everyday Wear',
    'College Fits',
    'Party Wear',
    'Ethnic and Traditional Wear',
    'Athleisure'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest mb-2">
          <Link to="/" className="hover:text-aura-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-aura-black font-semibold">Shop All</span>
          {currentCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-aura-accent font-semibold">{currentCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-aura-black">
              All Collections
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Curated Korean streetwear, Y2K aesthetics, and everyday apparel tailored for self-expression.
            </p>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-500 bg-neutral-100 px-3 py-1.5 self-start sm:self-auto">
            {totalCount} Products
          </span>
        </div>
      </div>

      {/* Top Filter Bar (Sorting & Mobile Toggle) */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-neutral-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center space-x-2 border border-neutral-300 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-aura-black hover:border-aura-black"
          >
            <Filter className="w-4 h-4 text-aura-accent" />
            <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
          </button>

          {/* Quick Gender Pills */}
          <div className="hidden sm:flex items-center space-x-1 text-xs">
            {['All', 'Women', 'Men', 'Unisex'].map(g => {
              const isActive = (g === 'All' && !currentGender) || currentGender === g;
              return (
                <button
                  key={g}
                  onClick={() => updateParam('gender', g === 'All' ? '' : g)}
                  className={`px-3 py-1.5 uppercase font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-aura-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sort By:</span>
          <select
            value={currentSort}
            onChange={e => updateParam('sort', e.target.value)}
            className="border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-aura-black outline-none focus:border-aura-black cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-seller">Best Selling</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">Active Filters:</span>
          {currentCategory && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Category: {currentCategory}
              <button onClick={() => updateParam('category', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentStyle && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Style: {currentStyle}
              <button onClick={() => updateParam('style', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentGender && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Gender: {currentGender}
              <button onClick={() => updateParam('gender', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentSize && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Size: {currentSize}
              <button onClick={() => updateParam('size', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentColor && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Color: {currentColor}
              <button onClick={() => updateParam('color', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Price: ₹{currentMinPrice || '0'} - ₹{currentMaxPrice || '5000+'}
              <button
                onClick={() => {
                  setMinPriceInput('');
                  setMaxPriceInput('');
                  updateParam('minPrice', '');
                  updateParam('maxPrice', '');
                }}
                className="ml-1.5 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentDiscount && (
            <span className="inline-flex items-center bg-neutral-100 text-aura-black text-xs font-medium px-2.5 py-1">
              Min {currentDiscount}% Off
              <button onClick={() => updateParam('discount', '')} className="ml-1.5 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs font-bold tracking-wider uppercase text-aura-crimson hover:underline flex items-center space-x-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 pr-4 border-r border-neutral-200">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Categories</h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto text-xs text-neutral-600 pr-2">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left py-1 hover:text-aura-black flex items-center justify-between ${
                  !currentCategory ? 'font-bold text-aura-accent' : ''
                }`}
              >
                <span>All Categories</span>
                <span>({totalCount})</span>
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => updateParam('category', c.slug)}
                  className={`w-full text-left py-1 hover:text-aura-black flex items-center justify-between ${
                    currentCategory === c.slug ? 'font-bold text-aura-accent' : ''
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {c.productCount !== undefined && <span className="text-neutral-400">({c.productCount})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Price Range (₹)</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={e => setMinPriceInput(e.target.value)}
                className="w-full border border-neutral-300 px-2.5 py-1.5 text-xs outline-none focus:border-aura-black"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={e => setMaxPriceInput(e.target.value)}
                className="w-full border border-neutral-300 px-2.5 py-1.5 text-xs outline-none focus:border-aura-black"
              />
              <button
                onClick={handlePriceApply}
                className="bg-aura-black text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-neutral-800"
              >
                Go
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Size</h3>
            <div className="flex flex-wrap gap-1.5">
              {availableSizes.map(s => {
                const isSelected = currentSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateParam('size', isSelected ? '' : s)}
                    className={`w-9 h-9 text-xs font-bold uppercase border transition-all ${
                      isSelected
                        ? 'bg-aura-black text-white border-aura-black'
                        : 'bg-white text-neutral-800 border-neutral-200 hover:border-aura-black'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(c => {
                const isSelected = currentColor.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    onClick={() => updateParam('color', isSelected ? '' : c.name.toLowerCase())}
                    className={`w-7 h-7 rounded-full border-2 p-0.5 transition-all ${
                      isSelected ? 'border-aura-black scale-110 ring-2 ring-aura-black/20' : 'border-transparent'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-full h-full rounded-full block border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Aesthetics */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Fashion Style</h3>
            <div className="space-y-1 text-xs text-neutral-600">
              {availableStyles.map(st => {
                const isSelected = currentStyle === st;
                return (
                  <button
                    key={st}
                    onClick={() => updateParam('style', isSelected ? '' : st)}
                    className={`w-full text-left py-1 hover:text-aura-black block ${
                      isSelected ? 'font-bold text-aura-accent' : ''
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discount Percentage */}
          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold tracking-widest uppercase text-aura-black mb-3">Discount</h3>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {['20', '25', '30', '35'].map(d => (
                <button
                  key={d}
                  onClick={() => updateParam('discount', currentDiscount === d ? '' : d)}
                  className={`block py-0.5 hover:text-aura-black ${
                    currentDiscount === d ? 'font-bold text-aura-crimson' : ''
                  }`}
                >
                  {d}% or more
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-24 text-center">
              <Sparkles className="w-8 h-8 text-aura-accent animate-spin mx-auto mb-3" />
              <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">Loading catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-neutral-300 p-8 space-y-4">
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black">
                No clothing items found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No products match the selected filter criteria. Try clearing your filters or selecting a different category.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-aura-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
