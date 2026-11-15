'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Sparkles, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      size: product.sizes[0] || 'L',
      color: product.colors[0]?.hex || '#090909',
      colorName: product.colors[0]?.name || 'Jet Black',
      image: product.images.front,
      isCustom: false,
    });
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-brand-charcoal dark:bg-brand-charcoal bg-white border border-brand-surface-borderDark dark:border-brand-surface-borderDark border-brand-surface-borderLight overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-brand-crimson/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.tags.includes('Founder Edition') && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-white text-black tracking-widest uppercase shadow-md border border-neutral-300">
            FOUNDER EDITION
          </span>
        )}
        {product.tags.includes('Pink Edition') && (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-[#D49A9E] text-black tracking-widest uppercase shadow-md border border-[#E3B0B4]">
            PINK EDITION
          </span>
        )}
        {product.isSignatureApproved && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-crimson text-white tracking-widest uppercase shadow-md">
            {product.signatureCode || 'APPROVED SIGNATURE'}
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900/90 text-neutral-200 border border-neutral-700 tracking-widest uppercase">
            BESTSELLER
          </span>
        )}
      </div>

      {/* WISHLIST BUTTON */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isWishlisted
            ? 'bg-brand-crimson text-white scale-110 shadow-lg'
            : 'bg-black/50 text-white/80 hover:text-brand-crimson hover:bg-black/80'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
      </button>

      {/* PRODUCT IMAGE GALLERY WRAPPER */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
        <img
          src={isHovered && product.images.back ? product.images.back : product.images.front}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* QUICK ACTION OVERLAY BAR */}
        <div className="absolute inset-x-2.5 bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-2.5 px-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-[10px] font-mono font-black tracking-wider flex items-center justify-center gap-1 backdrop-blur-md transition-all shadow-lg"
          >
            <span>VIEW PRODUCT</span>
          </Link>

          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 px-2 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-[10px] font-mono font-bold tracking-wider flex items-center justify-center gap-1 backdrop-blur-md transition-all shadow-lg"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={c.hex}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-600 inline-block"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-sans font-bold text-sm sm:text-base text-neutral-900 dark:text-white hover:text-brand-crimson dark:hover:text-brand-crimson transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.subtitle || product.fabricDetails}
          </p>
        </div>

        <div className="pt-3 mt-2 border-t border-brand-surface-borderDark/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono text-xs text-neutral-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/customize?product=${product.slug}`}
            className="text-[11px] font-mono font-bold text-brand-crimson hover:underline flex items-center gap-1"
          >
            CUSTOMIZE →
          </Link>
        </div>
      </div>

    </div>
  );
}
