import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw, Scissors } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About FitXxx — The Seoul Syndicate Streetwear Atelier',
  description: 'Learn the philosophy of FitXxx. Minimalist Korean oversized silhouettes, 450 GSM heavyweight French Terry, and creator-first 3D garment customization.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
          BRAND MANIFESTO
        </span>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight">
          DESIGN. WEAR. OWN IT.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
          FitXxx is an international unisex streetwear atelier founded on the collision of Korean architectural drapes, raw underground subcultures, and proprietary 3D garment fabrication.
        </p>
      </div>

      {/* Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black border border-neutral-800 flex items-center justify-center text-brand-crimson">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-lg text-white">450 GSM FRENCH TERRY</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            We reject the flimsy, collapsing fabrics of fast fashion. Every FitXxx hoodie and lower is woven from 450 GSM combed cotton with high-density loopback fleece.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black border border-neutral-800 flex items-center justify-center text-brand-crimson">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-lg text-white">KOREAN OVERSIZED CUT</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Our patterns feature exaggerated drop-shoulder seams, articulated balloon legs, and subtle piping engineered to drape effortlessly on any body.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-black border border-neutral-800 flex items-center justify-center text-brand-crimson">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-lg text-white">ZERO DEADSTOCK</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Through our real-time 3D Customizer Studio, customers customize their own pieces, which are fabricated with precision screen printing and embroidery on demand.
          </p>
        </div>
      </div>

      {/* Signature Approved Designs Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-black border border-brand-surface-borderDark space-y-8">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
            FOUNDATIONAL ROOTS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
            THE 3 APPROVED SIGNATURE SILHOUETTES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans text-neutral-400">
          <div className="space-y-2 border-l border-brand-crimson pl-4">
            <h4 className="font-bold text-white text-sm">001 — CHOCOLATE BROWN HOODIE</h4>
            <p>Oversized drape, ivory shoulder piping, white chest embroidery, metal drawstring aglets, and kangaroo pocket.</p>
          </div>
          <div className="space-y-2 border-l border-brand-crimson pl-4">
            <h4 className="font-bold text-white text-sm">002 — IVORY × BROWN LOWER</h4>
            <p>Warm ivory balloon leg, sculpted chocolate curved side panels, star emblem embroidery, and adjustable waistband.</p>
          </div>
          <div className="space-y-2 border-l border-brand-crimson pl-4">
            <h4 className="font-bold text-white text-sm">003 — BLACK DRAGON HOODIE</h4>
            <p>Jet-black brushed fleece, massive metallic silver dragon back screen-print, crimson accents, and 3-line manifesto.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/customize"
            className="px-8 py-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>ENTER 3D CUSTOM STUDIO</span>
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 bg-brand-charcoal hover:bg-neutral-800 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all border border-neutral-800"
          >
            <span>SHOP COLLECTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
