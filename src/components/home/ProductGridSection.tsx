'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '../product/ProductCard';

interface ProductGridSectionProps {
  tag: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  bg?: 'black' | 'charcoal';
}

export function ProductGridSection({
  tag,
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
  bg = 'black',
}: ProductGridSectionProps) {
  return (
    <section className={`py-20 ${bg === 'charcoal' ? 'bg-brand-charcoal' : 'bg-brand-black'} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
              {tag}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl font-sans">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="text-xs font-mono font-bold tracking-widest text-neutral-400 hover:text-white flex items-center gap-1 group self-start md:self-auto"
          >
            <span>VIEW ALL ({products.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
