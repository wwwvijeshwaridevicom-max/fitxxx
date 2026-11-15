'use client';

import React, { useState } from 'react';
import { X, Search, Sparkles, Tag } from 'lucide-react';
import { ARTWORK_CATEGORIES, ARTWORK_LIBRARY } from '@/data/artworkLibrary';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { ArtworkCategory, ArtworkGraphic } from '@/types';

interface ArtworkPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArtworkPickerModal({ isOpen, onClose }: ArtworkPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { activeZone, addLayer } = useCustomizerStore();

  if (!isOpen) return null;

  const filteredArtworks = ARTWORK_LIBRARY.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesQuery = 
      !searchQuery.trim() || 
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleSelectArtwork = (art: ArtworkGraphic) => {
    addLayer({
      type: 'graphic',
      zone: activeZone,
      graphicId: art.id,
      graphicName: art.name,
      svgContent: art.svgContent,
      x: 0,
      y: 0,
      scale: art.defaultScale || 1.0,
      rotation: 0,
      opacity: 1.0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl shadow-2xl p-6 text-white z-10 flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-surface-borderDark">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-crimson" />
              <h3 className="font-display font-black text-lg tracking-wider text-white">
                STREETWEAR ARTWORK & STICKER LIBRARY
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select an original graphic to project onto <span className="text-brand-crimson font-mono font-bold uppercase">{activeZone.replace('_', ' ')}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & CATEGORIES */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dragon, flame, butterfly, korean, anime, symbols..."
              className="w-full bg-brand-black border border-brand-surface-borderDark rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-crimson text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              ALL GRAPHICS ({ARTWORK_LIBRARY.length})
            </button>
            {ARTWORK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-crimson text-white shadow-md'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ARTWORK GRID */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
          {filteredArtworks.map((art) => (
            <div
              key={art.id}
              onClick={() => handleSelectArtwork(art)}
              className="group cursor-pointer rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson p-4 flex flex-col items-center justify-between transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-200"
                dangerouslySetInnerHTML={{ __html: art.svgContent }}
              />

              <div className="w-full text-center mt-3 pt-2 border-t border-neutral-900">
                <h5 className="text-xs font-bold text-white group-hover:text-brand-crimson transition-colors truncate">
                  {art.name}
                </h5>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block mt-0.5">
                  {art.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <div className="pt-4 border-t border-brand-surface-borderDark flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>ORIGINAL & PROPERLY LICENSED FITXXX VECTOR ASSETS</span>
          <span>PRINT-READY RESOLUTION</span>
        </div>

      </div>
    </div>
  );
}
