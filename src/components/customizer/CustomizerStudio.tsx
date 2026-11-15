'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { LeftToolPanel } from './LeftToolPanel';
import { LayerManagerPanel } from './LayerManagerPanel';
import { ArtworkPickerModal } from './ArtworkPickerModal';
import { TextEditorModal } from './TextEditorModal';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { ALL_PRODUCTS } from '@/data/products';
import { GarmentType } from '@/types';
import { SlidersHorizontal, Layers, Eye } from 'lucide-react';
import { ThreeDErrorBoundary } from '@/components/ErrorBoundary';

// Dynamically import Three.js viewer with SSR disabled
const GarmentViewer = dynamic(
  () => import('../viewer3d/GarmentViewer').then((mod) => mod.GarmentViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] lg:min-h-[620px] bg-brand-charcoal rounded-2xl flex flex-col items-center justify-center text-neutral-400 gap-3 border border-brand-surface-borderDark animate-pulse">
        <div className="w-10 h-10 border-2 border-brand-crimson border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest uppercase">INITIALIZING 3D ENGINE...</span>
      </div>
    ),
  }
);

export function CustomizerStudio() {
  const searchParams = useSearchParams();
  const { setGarmentType, setBaseColor } = useCustomizerStore();

  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'tools' | 'viewer' | 'layers'>('viewer');

  // Pre-populate if query parameter exists
  useEffect(() => {
    const garment = searchParams.get('garment') as GarmentType | null;
    const productSlug = searchParams.get('product');

    if (garment && ['hoodie', 'lower', 'tshirt', 'sweatshirt', 'jacket'].includes(garment)) {
      setGarmentType(garment);
    } else if (productSlug) {
      const matched = ALL_PRODUCTS.find((p) => p.slug === productSlug);
      if (matched) {
        setGarmentType(matched.garmentType);
        if (matched.colors.length > 0) {
          setBaseColor(matched.colors[0].hex, matched.colors[0].name);
        }
      }
    }
  }, [searchParams, setGarmentType, setBaseColor]);

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
      
      {/* STUDIO TITLE BAR */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-surface-borderDark pb-3">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2">
            3D CUSTOM CLOTHING STUDIO
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-crimson text-white">
              V2.0
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-sans">
            Craft your streetwear uniform. Project original graphics, Korean typography, custom text, or uploaded designs directly onto 3D garments.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-brand-charcoal p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setMobileTab('tools')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
              mobileTab === 'tools' ? 'bg-brand-crimson text-white' : 'text-neutral-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
          <button
            onClick={() => setMobileTab('viewer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
              mobileTab === 'viewer' ? 'bg-brand-crimson text-white' : 'text-neutral-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setMobileTab('layers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
              mobileTab === 'layers' ? 'bg-brand-crimson text-white' : 'text-neutral-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* 3-PANEL STUDIO GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden bg-brand-charcoal border border-brand-surface-borderDark shadow-2xl min-h-[640px]">
        
        {/* LEFT TOOL PANEL */}
        <div className={`lg:col-span-3 ${mobileTab === 'tools' ? 'block' : 'hidden lg:block'}`}>
          <LeftToolPanel
            onOpenArtworkModal={() => setIsArtworkModalOpen(true)}
            onOpenTextModal={() => setIsTextModalOpen(true)}
          />
        </div>

        {/* CENTER 3D GARMENT PREVIEW */}
        <div className={`lg:col-span-6 p-4 flex flex-col justify-center ${mobileTab === 'viewer' ? 'block' : 'hidden lg:block'}`}>
          <ThreeDErrorBoundary>
            <GarmentViewer />
          </ThreeDErrorBoundary>
        </div>

        {/* RIGHT LAYER MANAGER & ACTIONS */}
        <div className={`lg:col-span-3 ${mobileTab === 'layers' ? 'block' : 'hidden lg:block'}`}>
          <LayerManagerPanel />
        </div>

      </div>

      {/* MODALS */}
      <ArtworkPickerModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
      />

      <TextEditorModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
      />

    </div>
  );
}
