'use client';

import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';

export function InstagramGallery() {
  const posts = [
    {
      img: '/Clothes%20images/wear%20boith%20combo%20brown%20ivopry.jpeg',
      tag: '#FitXxxSignature001',
    },
    {
      img: '/Clothes%20images/dragoin%20red%20hoodie%20image%20men%20.jpeg',
      tag: '#BlackDragonHoodie',
    },
    {
      img: '/Clothes%20images/women%20red%20lower%20.jpeg',
      tag: '#WomenFlameLower',
    },
    {
      img: '/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg',
      tag: '#BrownIvoryUniform',
    },
    {
      img: '/Clothes%20images/bothwear%20men%20women%20red%20hoodie.jpeg',
      tag: '#SeoulStreetwear',
    },
    {
      img: '/Clothes%20images/red%20lower%20girl%20and%20mem%20image%20.jpeg',
      tag: '#FitXxxCommunity',
    },
  ];

  return (
    <section className="py-20 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
              COMMUNITY CURATION
            </span>
            <h2 className="font-display font-black text-3xl text-white tracking-tight mt-1">
              TAG @FITXXX.OFFICIAL
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold tracking-widest text-neutral-400 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Instagram className="w-4 h-4 text-brand-crimson" />
            <span>FOLLOW ON INSTAGRAM</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
            >
              <img
                src={post.img}
                alt="FitXxx Community"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                <Instagram className="w-5 h-5 text-white mb-1" />
                <span className="text-[10px] font-mono text-neutral-300">{post.tag}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
