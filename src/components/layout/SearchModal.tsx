'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { ALL_PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = ALL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularSearches = ['Chocolate Brown Hoodie', 'Ivory × Brown Lower', 'Black Dragon Hoodie', 'Black × Red Flame Lower', '3D Custom'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative max-w-2xl mx-auto bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-brand-surface-borderDark flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hoodies, lowers, approved concepts, categories..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="p-5 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-lg bg-brand-surface-cardDark border border-neutral-800 text-xs text-neutral-300 hover:text-brand-crimson hover:border-brand-crimson/50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-2 divide-y divide-brand-surface-borderDark">
            {results.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No streetwear products found matching "{query}". Try checking our custom studio.
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="pt-2 first:pt-0 flex items-center gap-4 p-2 rounded-xl hover:bg-brand-surface-cardDark transition-colors group"
                >
                  <div className="w-14 h-16 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                    <img
                      src={product.images.front}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-crimson transition-colors truncate">
                        {product.title}
                      </h4>
                      {product.isSignatureApproved && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40">
                          {product.signatureCode}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {product.subtitle || product.fabricDetails}
                    </p>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-brand-crimson transition-colors" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-brand-black/60 border-t border-brand-surface-borderDark flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>PRESS ESC TO CLOSE</span>
          <Link href="/shop" onClick={onClose} className="hover:text-white transition-colors">
            VIEW ALL PRODUCTS →
          </Link>
        </div>

      </div>
    </div>
  );
}
