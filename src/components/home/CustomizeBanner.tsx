'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Layers, Palette, Rotate3d, CheckCircle2 } from 'lucide-react';

export function CustomizeBanner() {
  const features = [
    {
      icon: <Palette className="w-5 h-5 text-brand-crimson" />,
      title: '6 Signature Colorways',
      desc: 'Jet Black, Warm Ivory, Chocolate Brown, Charcoal, Olive & Custom Hex',
    },
    {
      icon: <Layers className="w-5 h-5 text-brand-crimson" />,
      title: '10 Artwork Categories',
      desc: 'Dragons, Y2K Flames, Cyber Moths, Korean Hangeul typography & Minimal Insignias',
    },
    {
      icon: <Rotate3d className="w-5 h-5 text-brand-crimson" />,
      title: 'Real-Time 3D Preview',
      desc: 'Interactive 360° orbital preview with dynamic UV texture projection',
    },
  ];

  return (
    <section className="py-20 bg-brand-charcoal text-white border-y border-brand-surface-borderDark relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-brand-crimson/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/20 border border-brand-crimson/40 text-brand-crimson text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE CORE FITXXX EXPERIENCE</span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
              DESIGN YOUR OWN.<br />
              <span className="text-brand-crimson">WEAR YOUR IDENTITY.</span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base font-sans leading-relaxed">
              Don't settle for mass-produced uniformity. Our proprietary 3D Customization Studio puts the power of a streetwear atelier in your hands. 
              Place vector graphics, customize Korean typography, or upload your own art with real-time 360° visualization.
            </p>

            <div className="space-y-4 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-brand-black border border-neutral-800 flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{f.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/customize"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-crimson/30"
              >
                <span>ENTER 3D CUSTOM STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-brand-surface-borderDark bg-brand-black shadow-2xl p-4 sm:p-8">
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85"
                  alt="FitXxx 3D Customization Studio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                
                {/* Floating Preview Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-brand-charcoal/90 backdrop-blur-md p-4 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-brand-crimson font-bold block">3D GARMENT ENGINE ACTIVE</span>
                    <span className="text-neutral-400 text-[11px]">Instant Print Zone Projection</span>
                  </div>
                  <Link
                    href="/customize"
                    className="px-3.5 py-1.5 bg-brand-crimson text-white text-[11px] font-bold rounded-lg hover:bg-brand-crimson/90 transition-colors"
                  >
                    LAUNCH →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
