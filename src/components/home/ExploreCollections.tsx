'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function ExploreCollections() {
  const collections = [
    {
      title: 'OVERSIZED HOODIES',
      subtitle: 'Chocolate Brown Piping & Imperial Black Dragon Prints',
      image: '/Clothes%20images/brown%20hoodie%20display%20.jpeg',
      href: '/collections/hoodies',
      span: 'lg:col-span-6',
    },
    {
      title: 'KOREAN BAGGY LOWERS',
      subtitle: 'Ivory Curved Panels & Black × Red Flame Silhouettes',
      image: '/Clothes%20images/red%20lower%20image%20best%20.jpeg',
      href: '/collections/lowers',
      span: 'lg:col-span-6',
    },
    {
      title: 'SIGNATURE COMBO UNIFORMS',
      subtitle: 'Black Dragon × Red Flame & Chocolate Brown Matching Sets',
      image: '/Clothes%20images/RED%20COMBO%20DISPLAY.png',
      href: '/collections',
      span: 'lg:col-span-6',
    },
    {
      title: '3D CUSTOM STUDIO',
      subtitle: '360° Real-Time 3D Decal Studio: Dragons, Flames & Typography',
      image: '/Clothes%20images/red%20lower%20fire%20360%20view.jpeg',
      href: '/customize',
      span: 'lg:col-span-6',
      highlight: true,
    },
  ];

  return (
    <section className="py-20 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
              ARCHITECTURE OF FIT
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
              EXPLORE OUR COLLECTIONS
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs font-mono font-bold tracking-widest text-neutral-400 hover:text-white flex items-center gap-1 group"
          >
            <span>VIEW ALL ARCHIVES</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className={`group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-brand-surface-borderDark bg-neutral-900 ${col.span}`}
            >
              {/* Background Image */}
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badge if highlight */}
              {col.highlight && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-crimson text-white text-[10px] font-mono font-bold uppercase tracking-widest shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>CORE USP</span>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    {col.subtitle}
                  </p>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide mt-1 group-hover:text-brand-crimson transition-colors">
                    {col.title}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-brand-crimson group-hover:border-brand-crimson transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
