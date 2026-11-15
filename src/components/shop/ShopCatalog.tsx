'use client';

import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS, CATEGORIES_LIST } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/utils';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  Check, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';

interface ShopCatalogProps {
  initialCategory?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function ShopCatalog({ 
  initialCategory = 'all',
  pageTitle = 'ALL STREETWEAR ARCHIVES',
  pageSubtitle = 'Explore our approved Korean oversized cuts and signature streetwear uniforms.' 
}: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Jet Black', hex: '#090909' },
    { name: 'Warm Ivory', hex: '#F0E6D8' },
    { name: 'Chocolate Brown', hex: '#3D2314' },
    { name: 'Charcoal Grey', hex: '#2B2B2B' },
    { name: 'Olive Green', hex: '#3A4032' },
    { name: 'Crimson Red', hex: '#E50924' },
  ];

  // Toggle filter items
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(8000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'combos' || selectedCategory === 'combo-sets') {
          if (product.category !== 'combos' && product.category !== 'combo-sets' && product.garmentType !== 'combo') {
            return false;
          }
        } else if (selectedCategory === 'sweatshirts') {
          if (product.category !== 'sweatshirts' && product.garmentType !== 'sweatshirt') {
            return false;
          }
        } else if (selectedCategory === 'pink' || selectedCategory === 'pink-edition') {
          if (!product.tags.includes('Pink Edition')) return false;
        } else if (selectedCategory === 'founder') {
          if (!product.tags.includes('Founder Edition')) return false;
        } else if (selectedCategory === 'mens' || selectedCategory === 'womens' || selectedCategory === 'unisex') {
          // Unisex items match all
        } else if (selectedCategory === 'custom') {
          // All garments can be customized
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const hasMatchingSize = selectedSizes.some(s => product.sizes.includes(s as any));
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = selectedColors.some(c => 
          product.colors.some(pc => pc.name.toLowerCase() === c.toLowerCase())
        );
        if (!hasMatchingColor) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      // In stock
      if (inStockOnly && product.stockCount <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isSignatureApproved ? 1 : 0) - (a.isSignatureApproved ? 1 : 0);
    });
  }, [selectedCategory, selectedSizes, selectedColors, maxPrice, inStockOnly, sortBy]);

  const activeFilterCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    selectedSizes.length + 
    selectedColors.length + 
    (maxPrice < 8000 ? 1 : 0) + 
    (inStockOnly ? 1 : 0);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER BAR */}
      <div className="mb-10 pb-6 border-b border-brand-surface-borderDark flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
            FITXXX CATALOGUE 2026
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl font-sans">
            {pageSubtitle}
          </p>
        </div>

        {/* Action Controls: Mobile Filter Trigger & Sort dropdown */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold tracking-wider flex items-center gap-2 border border-neutral-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-crimson" />
            <span>FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-brand-charcoal dark:bg-brand-charcoal bg-white border border-brand-surface-borderDark dark:border-brand-surface-borderDark border-neutral-300 text-neutral-900 dark:text-white text-xs font-mono px-4 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-brand-crimson cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="newest">LATEST ARRIVALS</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-brand-surface-borderDark">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 dark:text-white flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-brand-crimson" />
              <span>FILTER ARCHIVE</span>
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-mono text-brand-crimson hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* 1. Category */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              CATEGORY
            </h4>
            <div className="space-y-1">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-sans text-left flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-brand-crimson/15 text-brand-crimson font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-[10px] text-neutral-500">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sizes */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              SIZE
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {availableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      isSelected
                        ? 'bg-brand-crimson border-brand-crimson text-white shadow-md'
                        : 'border-neutral-800 bg-brand-charcoal/50 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Colors */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              COLORWAY
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`relative w-7 h-7 rounded-full border-2 transition-transform ${
                      isSelected ? 'border-brand-crimson scale-110 shadow-lg' : 'border-neutral-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 mx-auto ${color.hex === '#F0E6D8' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Price Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>MAX PRICE</span>
              <span className="font-bold text-white">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="8000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-crimson bg-neutral-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* 5. In Stock Only Toggle */}
          <div className="pt-2 border-t border-brand-surface-borderDark">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-neutral-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-brand-crimson rounded"
              />
              <span>IN STOCK ONLY</span>
            </label>
          </div>

        </aside>

        {/* PRODUCTS GRID */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark p-8 space-y-4">
              <p className="text-base font-bold text-white">No products found matching your active filters</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Try widening your price range, clearing selected sizes, or resetting all filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-brand-crimson text-white text-xs font-mono font-bold tracking-widest rounded-lg hover:bg-brand-crimson/90 transition-colors"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* MOBILE FILTERS MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-brand-black text-white p-6 flex flex-col justify-between border-l border-brand-surface-borderDark shadow-2xl overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-brand-surface-borderDark">
                  <h3 className="font-mono font-bold text-xs uppercase tracking-widest">FILTERS</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-400">CATEGORY</span>
                  <div className="space-y-1">
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full py-1 text-xs text-left block ${selectedCategory === cat.id ? 'text-brand-crimson font-bold' : 'text-neutral-400'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-400">SIZE</span>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`py-2 text-xs font-mono border rounded ${selectedSizes.includes(s) ? 'bg-brand-crimson text-white border-brand-crimson' : 'border-neutral-800 text-neutral-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-neutral-400">
                    <span>MAX PRICE</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="8000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand-crimson"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-brand-surface-borderDark space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-brand-crimson text-white text-xs font-bold font-mono tracking-widest rounded-xl"
                >
                  APPLY FILTERS ({filteredProducts.length})
                </button>
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  RESET
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
