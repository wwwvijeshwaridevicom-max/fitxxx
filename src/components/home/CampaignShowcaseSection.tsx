'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Shield, Sparkles } from 'lucide-react';

export function CampaignShowcaseSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#090909] via-[#110D0F] to-[#090909] text-white border-y border-neutral-800 relative overflow-hidden">
      
      {/* Background Graphic Watermark */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[140px] sm:text-[220px] font-display font-black text-brand-crimson/[0.03] pointer-events-none select-none tracking-tighter">
        DRAGON×FLAME
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-xs font-mono tracking-widest text-brand-crimson">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>EDITORIAL CAMPAIGN // DROP 001 × 003</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white">
            BLACK DRAGON <span className="text-brand-crimson">×</span> RED FLAME
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed">
            High-voltage cyber streetwear engineered in Seoul. Imperial silver dragon back artwork, 
            tribal crimson flame typography, and articulated Korean wide-leg proportions.
          </p>
        </div>

        {/* 3-COLUMN CAMPAIGN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1: MEN'S DRAGON & FLAME SILHOUETTE */}
          <div className="group rounded-3xl bg-brand-charcoal/90 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-brand-crimson/40 transition-all shadow-2xl">
            <div className="relative aspect-[4/5] bg-neutral-950 overflow-hidden">
              <img
                src="/Clothes%20images/dragoin%20red%20hoodie%20image%20men%20.jpeg"
                alt="Men's Black Dragon Hoodie Front & Back"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700 text-[10px] font-mono text-white">
                MEN’S POSE // FRONT & BACK
              </div>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-brand-crimson font-bold uppercase tracking-widest">
                PRODUCT 003 // SIGNATURE HOODIE
              </span>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                BLACK DRAGON HOODIE
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Dense silver dragon screenprint across the upper back with DISCIPLINE / GRIND / EVOLVE manifesto and crimson seam details.
              </p>
              <div className="pt-2">
                <Link
                  href="/product/black-dragon-cyber-oversized-hoodie"
                  className="w-full py-3 px-4 bg-brand-black hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>VIEW DRAGON HOODIE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: DUAL GENDER CAMPAIGN LINEUP */}
          <div className="group rounded-3xl bg-brand-charcoal/90 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-brand-crimson/40 transition-all shadow-2xl">
            <div className="relative aspect-[4/5] bg-neutral-950 overflow-hidden">
              <img
                src="/Clothes%20images/bothwear%20men%20women%20red%20hoodie.jpeg"
                alt="Men & Women Dual Campaign Lineup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-brand-crimson/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono text-white font-bold">
                UNISEX SQUAD LINEUP
              </div>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-brand-crimson font-bold uppercase tracking-widest">
                EDITORIAL LINEUP // 4-ANGLE
              </span>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                UNISEX FITXXX MANIFESTO
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Male and female models wearing oversized silhouettes, highlighting relaxed shoulder drop, hood volume, and front star branding.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections/unisex"
                  className="w-full py-3 px-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-crimson/25"
                >
                  <span>EXPLORE UNISEX ARCHIVE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 3: BLACK × RED FLAME LOWER 360° */}
          <div className="group rounded-3xl bg-brand-charcoal/90 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-brand-crimson/40 transition-all shadow-2xl">
            <div className="relative aspect-[4/5] bg-neutral-950 overflow-hidden">
              <img
                src="/Clothes%20images/red%20lower%20fire%20360%20view.jpeg"
                alt="Black × Red Flame Lower 360 Degree View"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-neutral-700 text-[10px] font-mono text-white">
                360° MULTI-ANGLE REFERENCE
              </div>
            </div>

            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-brand-crimson font-bold uppercase tracking-widest">
                PRODUCT 004 // FLAME LOWER
              </span>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                BLACK × RED FLAME LOWER
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                4-angle calibrated study (Front, Right Side, Back, Left Side) showing dynamic crimson flame placement and baggy ankle drape.
              </p>
              <div className="pt-2">
                <Link
                  href="/product/black-red-flame-baggy-lower"
                  className="w-full py-3 px-4 bg-brand-black hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>VIEW FLAME LOWER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* WOMEN'S CAMPAIGN DUO STRIP */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="group rounded-3xl overflow-hidden bg-brand-charcoal border border-neutral-800 relative shadow-2xl">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/Clothes%20images/women%20red%20lower%20wear%20front%20back%20right%20left%20img.jpeg"
                alt="Women's 4-Angle 360° Fit Guide"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-brand-black via-brand-black/95 to-transparent">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-crimson uppercase bg-brand-black px-2.5 py-1 rounded border border-neutral-800">
                WOMEN’S FIT GUIDE // 4-ANGLE + MACRO
              </span>
              <h4 className="font-display font-black text-xl text-white mt-2">
                CURATED FEMALE STREETWEAR SILHOUETTES
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Engineered for relaxed unisex flow. Macro callouts for waistband elasticity, star embroidery, and deep side pockets.
              </p>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-brand-charcoal border border-neutral-800 relative shadow-2xl">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/Clothes%20images/red%20lower%20girl%20and%20mem%20image%20.jpeg"
                alt="Editorial Campaign Duo Male and Female"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-brand-black via-brand-black/95 to-transparent">
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-crimson uppercase bg-brand-black px-2.5 py-1 rounded border border-neutral-800">
                EDITORIAL COLLAGE // SEOUL UNDERGROUND
              </span>
              <h4 className="font-display font-black text-xl text-white mt-2">
                FITXXX DROP 001 COMMUNITY
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Multi-pose lookbook showing standing duo, floor seated drape, and walking back profile in authentic Korean streetwear.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
