'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, Layers, Scissors, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { APPROVED_SIGNATURE_PRODUCTS } from '@/data/products';

export function SignatureLookbookSection() {
  const prod001 = APPROVED_SIGNATURE_PRODUCTS.find((p) => p.slug === 'chocolate-brown-oversized-hoodie');
  const prod002 = APPROVED_SIGNATURE_PRODUCTS.find((p) => p.slug === 'ivory-brown-loose-korean-lower');

  return (
    <section className="py-24 bg-gradient-to-b from-brand-black via-[#0D0D10] to-brand-black text-white border-y border-brand-surface-borderDark relative overflow-hidden">
      
      {/* Background Architectural Watermark */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[140px] sm:text-[200px] font-display font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
        001×002
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-charcoal border border-neutral-800 text-xs font-mono tracking-widest text-[#F0E6D8]">
            <span className="w-2 h-2 rounded-full bg-[#3D2314]" />
            <span>APPROVED SIGNATURE LOOKBOOK // 001 × 002</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            CHOCOLATE BROWN <span className="text-brand-crimson">×</span> WARM IVORY
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed">
            The canonical FitXxx uniform. Exaggerated drop-shoulder volume paired with curved balloon-leg drape. 
            Engineered with contrast seam piping and antique hardware.
          </p>
        </div>

        {/* 2-COLUMN HERO EDITORIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT: PRODUCT 001 SPOTLIGHT */}
          <div className="lg:col-span-6 rounded-3xl bg-brand-charcoal/90 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-all shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#3D2314] text-[#F0E6D8] border border-[#52331C] tracking-widest">
                PRODUCT 001 // SIGNATURE
              </span>
              <span className="text-xs font-mono text-neutral-400">
                OVERSIZED CUT
              </span>
            </div>

            {/* Product Image Stage */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-black mb-6 border border-neutral-800/80">
              <img
                src={prod001?.images.front || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85'}
                alt="Chocolate Brown Oversized Hoodie"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Piping Callout Badge */}
              <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 text-[10px] font-mono text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0E6D8]" />
                <span>IVORY PIPING ACROSS DROP SHOULDERS</span>
              </div>
            </div>

            {/* Spec details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-black text-2xl text-white tracking-tight">
                  CHOCOLATE BROWN HOODIE
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  Exaggerated Korean drop-shoulder silhouette, loopback interior, white FitXxx chest embroidery, and antique metal aglets.
                </p>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-white">
                    {formatPrice(prod001?.price || 4499)}
                  </span>
                  <span className="font-mono text-xs text-neutral-500 line-through">
                    {formatPrice(prod001?.compareAtPrice || 5999)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  IN STOCK ({prod001?.stockCount || 42} UNITS)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/product/chocolate-brown-oversized-hoodie"
                  className="py-3 px-4 bg-brand-black hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/customize?product=chocolate-brown-oversized-hoodie"
                  className="py-3 px-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-brand-crimson/25"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOMIZE 3D</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT 002 SPOTLIGHT */}
          <div className="lg:col-span-6 rounded-3xl bg-brand-charcoal/90 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between group hover:border-neutral-700 transition-all shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-[#F0E6D8] text-[#3D2314] border border-[#DDD0BF] tracking-widest">
                PRODUCT 002 // SIGNATURE
              </span>
              <span className="text-xs font-mono text-neutral-400">
                BALLOON LOWER
              </span>
            </div>

            {/* Product Image Stage */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-black mb-6 border border-neutral-800/80">
              <img
                src={prod002?.images.front || 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85'}
                alt="Ivory x Brown Loose Korean Lower"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Panel Callout Badge */}
              <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 text-[10px] font-mono text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D2314]" />
                <span>CURVED CHOCOLATE SIDE PANELS</span>
              </div>
            </div>

            {/* Spec details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-black text-2xl text-white tracking-tight">
                  IVORY × BROWN LOWER
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  Sculpted Korean balloon-leg drape, heavy metal drawstring tips, embroidered front star emblem, and internal ankle toggle.
                </p>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-neutral-800">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-white">
                    {formatPrice(prod002?.price || 3799)}
                  </span>
                  <span className="font-mono text-xs text-neutral-500 line-through">
                    {formatPrice(prod002?.compareAtPrice || 4999)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  IN STOCK ({prod002?.stockCount || 35} UNITS)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/product/ivory-brown-loose-korean-lower"
                  className="py-3 px-4 bg-brand-black hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/customize?product=ivory-brown-loose-korean-lower"
                  className="py-3 px-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-brand-crimson/25"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOMIZE 3D</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* EDITORIAL CAMPAIGN PHOTOGRAPHY SHOWCASE */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="group relative rounded-3xl overflow-hidden bg-brand-charcoal border border-neutral-800 shadow-2xl">
            <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
              <img
                src="/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg"
                alt="Men's Brown × Ivory Combo Set Editorial Campaign"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-brand-black via-brand-black/90 to-transparent">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#F0E6D8] uppercase bg-[#3D2314] px-2.5 py-1 rounded border border-[#52331C]">
                CAMPAIGN 01 // EDITORIAL LOUNGE
              </span>
              <h4 className="font-display font-black text-xl text-white mt-2">
                RELAXED FORM & ARTICULATED DRAPE
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Captured in natural studio lighting. Demonstrating relaxed drape when seated and standing front/back profiles.
              </p>
            </div>
          </div>

          <div className="group relative rounded-3xl overflow-hidden bg-brand-charcoal border border-neutral-800 shadow-2xl">
            <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
              <img
                src="/Clothes%20images/combo%20set%20chcohalte%20brown%20hoodie%20and%20lower%20ivory%20men%20wear%20model.jpeg"
                alt="Complete Chocolate Brown Hoodie and Ivory Lower Combo Set"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-brand-black via-brand-black/90 to-transparent">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#F0E6D8] uppercase bg-[#3D2314] px-2.5 py-1 rounded border border-[#52331C]">
                SPECIFICATION SHEET // 001 × 002
              </span>
              <h4 className="font-display font-black text-xl text-white mt-2">
                FULL UNIFORM SYSTEM
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Standing model proportions with flat-lay display sheets showing white piping, star embroidery, and heavy hardware.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM LOOKBOOK BANNER */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-brand-black border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#3D2314] border border-[#52331C] text-[#F0E6D8] flex items-center justify-center flex-shrink-0 font-display font-black text-xl">
              FX
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                WEAR THE COMPLETE DUO // OUTFIT 01
              </h4>
              <p className="text-xs text-neutral-400 font-sans">
                Pair both silhouettes together for the authentic Korean streetwear lookbook drape.
              </p>
            </div>
          </div>

          <Link
            href="/collections"
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-brand-charcoal hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>EXPLORE FULL LOOKBOOK</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
