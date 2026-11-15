'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import { ThreeDErrorBoundary } from '@/components/ErrorBoundary';
import { HeroCustomizerPanel } from './HeroCustomizerPanel';

const GarmentViewer = dynamic(
  () => import('../viewer3d/GarmentViewer').then((mod) => mod.GarmentViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] lg:h-[620px] rounded-2xl bg-brand-charcoal flex flex-col items-center justify-center text-neutral-400 gap-3 border border-brand-surface-borderDark animate-pulse">
        <div className="w-12 h-12 border-2 border-brand-crimson border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest uppercase">INITIALIZING 3D HOODIE STUDIO...</span>
      </div>
    ),
  }
);

export function HeroSection() {
  return (
    <section className="relative min-h-[94vh] pt-24 pb-12 flex items-center overflow-hidden bg-brand-black text-white">
      
      {/* Background Architectural Grid Lines & Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-neutral-800" />
        <div className="absolute right-1/4 top-0 bottom-0 w-[1px] bg-neutral-800" />
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-neutral-800" />
      </div>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* HERO 3-COLUMN MASTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ========================================================================= */}
          {/* 1. LEFT: HUMAN FASHION MODEL CAMPAIGN & EDITORIAL HEADLINE                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-brand-charcoal/60 rounded-3xl p-5 sm:p-7 border border-brand-surface-borderDark backdrop-blur-sm shadow-2xl">
            
            {/* Top Drop Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-black border border-neutral-800 text-xs font-mono tracking-widest text-neutral-300 self-start">
              <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
              <span>COLLECTION 01 // KOREAN OVERSIZED CUTS</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl tracking-tighter leading-[0.95] text-white">
                DESIGN.<br />
                WEAR.<br />
                <span className="text-brand-crimson drop-shadow-[0_0_20px_rgba(229,9,36,0.35)]">OWN IT.</span>
              </h1>
            </div>

            {/* Actual Founder Campaign Photography Display */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 group shadow-xl">
              <img
                src="/Clothes%20images/founder%20image%20sit.png"
                alt="FitXxx Founder Campaign — Original Sitting Studio Portrait"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                <span className="bg-brand-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-700 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                  <span>FOUNDER CAMPAIGN // ORIGINAL VISION</span>
                </span>
                <span className="text-neutral-300 bg-brand-crimson/80 px-2 py-0.5 rounded font-bold">
                  OVERSIZED UNIFORM
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed">
              Premium streetwear for everyday comfort. Create your own style with FitXxx.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link
                href="/customize"
                className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-mono font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-crimson/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>CUSTOMIZE NOW</span>
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto py-3.5 px-6 bg-brand-black hover:bg-neutral-800 text-white border border-neutral-700 font-mono font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Features strip */}
            <div className="pt-3 border-t border-brand-surface-borderDark/80 grid grid-cols-3 gap-2 text-left">
              <div>
                <span className="font-mono text-sm sm:text-base font-black text-white block">PREMIUM</span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase">Cotton Terry</span>
              </div>
              <div>
                <span className="font-mono text-sm sm:text-base font-black text-white block">3D UV</span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase">Decal Studio</span>
              </div>
              <div>
                <span className="font-mono text-sm sm:text-base font-black text-white block">UNISEX</span>
                <span className="text-[9px] font-mono text-neutral-400 uppercase">Korean Fit</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 2. CENTER: REAL 3D PRODUCT VIEWER (ROTATING 3D HOODIE USP)               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col relative min-h-[520px] lg:min-h-[640px]">
            <ThreeDErrorBoundary>
              <GarmentViewer />
            </ThreeDErrorBoundary>
          </div>

          {/* ========================================================================= */}
          {/* 3. RIGHT: LIVE CUSTOMIZATION PANEL                                       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 flex flex-col">
            <HeroCustomizerPanel />
          </div>

        </div>

      </div>

    </section>
  );
}
