'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ALL_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { itemIds, clearWishlist } = useWishlistStore();

  const wishlistedProducts = ALL_PRODUCTS.filter((p) => itemIds.includes(p.id));

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark flex items-baseline justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
            PRIVATE ARCHIVE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
            SAVED WISHLIST ({wishlistedProducts.length})
          </h1>
        </div>
        {wishlistedProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-mono text-neutral-400 hover:text-brand-crimson"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your wishlist is empty</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Save your favorite Korean oversized pieces and custom concepts here.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-crimson text-white font-bold text-xs tracking-widest rounded-xl hover:bg-brand-crimson/90 transition-colors"
          >
            <span>DISCOVER STREETWEAR</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
