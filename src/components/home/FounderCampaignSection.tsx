'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Check, ShoppingBag } from 'lucide-react';
import { FOUNDER_ASSETS } from '@/data/fitxxx-assets';
import { useCartStore } from '@/store/useCartStore';
import confetti from 'canvas-confetti';

export function FounderCampaignSection() {
  const { addItem } = useCartStore();
  const [comboAdded, setComboAdded] = useState(false);

  const handleComboQuickAdd = () => {
    addItem({
      productId: 'prod-005-black-dragon-red-flame-combo',
      title: 'BLACK DRAGON × RED FLAME COMBO SET',
      price: 4999,
      quantity: 1,
      size: 'L',
      color: '#090909',
      colorName: 'Jet Black / Crimson Red / Silver',
      image: '/Clothes%20images/RED%20COMBO%20DISPLAY.png',
      isCustom: false,
    });

    setComboAdded(true);
    setTimeout(() => setComboAdded(false), 2500);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });
  };

  return (
    <section className="py-24 bg-gradient-to-b from-brand-black via-[#0D0D10] to-brand-black text-white border-y border-brand-surface-borderDark relative overflow-hidden">
      
      {/* Background Architectural Brand Watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[140px] sm:text-[220px] font-display font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
        FOUNDER
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal border border-neutral-800 text-xs font-mono tracking-widest text-[#F0E6D8]">
            <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
            <span>ORIGINAL FOUNDER CAMPAIGN // SEOUL LABS</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tighter text-white uppercase leading-none">
            BUILT DIFFERENT.<br />
            <span className="text-brand-crimson">WORN DIFFERENT.</span>
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base font-sans font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
            Designed with vision. Built for individuality.
          </p>
        </div>

        {/* 2-COLUMN CINEMATIC EDITORIAL STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: FOUNDER SITTING CAMPAIGN PHOTOGRAPH */}
          <div className="lg:col-span-6 rounded-3xl bg-brand-charcoal/80 border border-neutral-800 p-4 sm:p-6 shadow-2xl relative group overflow-hidden">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={FOUNDER_ASSETS.sit}
                alt="FitXxx Founder Campaign — Original Sitting Studio Portrait"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent pointer-events-none" />

              {/* Founder Verified Identity Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                <span className="bg-brand-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>FOUNDER // ORIGINAL PORTRAIT</span>
                </span>
                <span className="text-neutral-300 bg-brand-crimson/90 px-2.5 py-1 rounded-lg font-bold">
                  STUDIO ARCHIVE
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                AUTHENTIC FOUNDER DRAPE & SILHOUETTE
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Featuring the founder in the canonical jet-black French Terry oversized hoodie, 
                tailored baggy lower, and white footwear. Natural appearance, beard, hairstyle, 
                and streetwear proportions preserved with zero AI alterations.
              </p>
            </div>
          </div>

          {/* RIGHT: STANDING MULTI-ANGLE 360° FOUNDER REFERENCE & MANIFESTO */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Standing 360 Reference Card */}
            <div className="rounded-3xl bg-brand-charcoal/80 border border-neutral-800 p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-brand-surface-borderDark pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-crimson animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                    360° MULTI-ANGLE STANDING REFERENCE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 bg-brand-black px-2 py-0.5 rounded border border-neutral-800">
                  REAL DRAPE
                </span>
              </div>

              {/* Standing Photo Stage */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 group">
                <img
                  src={FOUNDER_ASSETS.stand360}
                  alt="FitXxx Founder 360 Multi-Angle Standing Reference"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700 text-[10px] font-mono text-white">
                  FULL-BODY ARTICULATED FIT REFERENCE
                </div>
              </div>

              {/* Manifesto Quote */}
              <div className="p-4 rounded-2xl bg-brand-black/60 border border-neutral-800/80 space-y-2">
                <p className="text-xs sm:text-sm text-neutral-300 font-sans italic leading-relaxed">
                  &ldquo;Streetwear isn&apos;t just clothing you put on; it&apos;s architectural volume that speaks before you say a word. We created FitXxx so you never have to settle for off-the-rack conformity.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="font-bold text-white">— THE FITXXX FOUNDER</span>
                  <span className="text-brand-crimson">SEOUL / MUMBAI</span>
                </div>
              </div>
            </div>

            {/* Direct Studio Callout & Action */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-charcoal via-[#19191D] to-brand-charcoal border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-black text-lg text-white">
                  YOUR CANVAS. YOUR RULES.
                </h4>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Launch the 3D Customizer to project your own decals, typography & dragon artwork.
                </p>
              </div>

              <Link
                href="/customize"
                className="w-full sm:w-auto py-3.5 px-6 bg-brand-crimson hover:bg-brand-crimson/90 active:scale-95 text-white font-mono font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all flex-shrink-0 shadow-lg shadow-brand-crimson/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>CUSTOMIZE IN 3D</span>
              </Link>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 9. HOMEPAGE PRODUCT CARD — BLACK DRAGON × RED FLAME COMBO SET             */}
        {/* ========================================================================= */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-brand-charcoal via-[#121215] to-brand-charcoal border border-neutral-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-brand-black border border-neutral-800 group shadow-2xl">
              <img
                src="/Clothes%20images/RED%20COMBO%20DISPLAY.png"
                alt="BLACK DRAGON × RED FLAME COMBO SET"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                <span className="px-3 py-1 rounded text-xs font-mono font-black bg-white text-black tracking-widest uppercase shadow-md">
                  FOUNDER EDITION
                </span>
                <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-brand-crimson text-white tracking-widest uppercase shadow-md">
                  NEW ARRIVAL
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
                  <span className="text-xs font-mono tracking-widest text-[#F0E6D8] uppercase">
                    OFFICIAL LAUNCH // FOUNDER EDITION DROP
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase leading-tight">
                  BLACK DRAGON × RED FLAME COMBO SET
                </h3>
                <p className="text-sm text-neutral-400 font-sans leading-relaxed max-w-xl">
                  A statement-making streetwear combo built for those who refuse to blend in. Featuring a premium oversized black hoodie with a striking silver dragon back graphic, bold crimson sleeve flames, signature FitXxx chest branding and matching relaxed-fit lower with coordinated flame detailing.
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-mono text-3xl sm:text-4xl font-black text-white">
                  ₹4,999
                </span>
                <span className="font-mono text-lg text-neutral-500 line-through">
                  ₹6,499
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-brand-crimson/15 border border-brand-crimson text-brand-crimson uppercase">
                  SAVE ₹1,500 (23% OFF)
                </span>
                <span className="text-xs font-mono text-emerald-400 uppercase w-full">
                  • IN STOCK (45 UNITS READY TO DISPATCH)
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/product/black-dragon-red-flame-combo-set"
                  className="w-full sm:w-auto py-3.5 px-8 bg-white hover:bg-neutral-200 text-black font-display font-black text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <span>VIEW PRODUCT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleComboQuickAdd}
                  className="w-full sm:w-auto py-3.5 px-8 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-mono font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-crimson/25 hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{comboAdded ? 'ADDED TO BAG ✓' : 'ADD TO CART'}</span>
                </button>

                <Link
                  href="/customize?product=black-dragon-red-flame-combo-set"
                  className="w-full sm:w-auto py-3.5 px-5 bg-brand-black hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-mono font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-brand-crimson" />
                  <span>3D STUDIO</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
