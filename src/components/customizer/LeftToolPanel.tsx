'use client';

import React, { useRef, useState } from 'react';
import { 
  Sparkles, 
  Type, 
  Upload, 
  Palette, 
  Shirt, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useCustomizerStore, COLOR_PALETTE } from '@/store/useCustomizerStore';
import { PlacementZoneSelector } from './PlacementZoneSelector';
import { PresetSelector } from './PresetSelector';
import { GarmentType } from '@/types';

interface LeftToolPanelProps {
  onOpenArtworkModal: () => void;
  onOpenTextModal: () => void;
}

export function LeftToolPanel({ onOpenArtworkModal, onOpenTextModal }: LeftToolPanelProps) {
  const { 
    garmentType, 
    setGarmentType, 
    baseColor, 
    setBaseColor, 
    colorName, 
    activeZone, 
    addLayer 
  } = useCustomizerStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState('');

  const garmentOptions: { id: GarmentType; label: string; price: string }[] = [
    { id: 'hoodie', label: 'Oversized Hoodie', price: '₹3,999' },
    { id: 'sweatshirt', label: 'Crewneck Sweatshirt', price: '₹3,499' },
    { id: 'lower', label: 'Korean Baggy Lower', price: '₹3,499' },
    { id: 'combo', label: 'Hoodie + Lower Combo', price: '₹6,999' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload PNG, JPG, or SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addLayer({
          type: 'upload',
          zone: activeZone,
          uploadUrl: reader.result,
          fileName: file.name,
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full lg:w-80 bg-brand-charcoal border-b lg:border-b-0 lg:border-r border-brand-surface-borderDark p-5 flex flex-col gap-6 text-white overflow-y-auto max-h-[85vh] lg:max-h-full">
      
      {/* 1. PRODUCT SELECTION */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Shirt className="w-3.5 h-3.5 text-brand-crimson" />
          <span>SELECT BASE GARMENT</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          {garmentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setGarmentType(opt.id)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                garmentType === opt.id
                  ? 'bg-brand-crimson/15 border-brand-crimson text-white font-bold shadow-md'
                  : 'bg-brand-black border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <span>{opt.label}</span>
              <span className="font-mono text-[11px] text-neutral-400">{opt.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. COLOR SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-brand-crimson" />
            <span>GARMENT SHADE</span>
          </span>
          <span className="text-white font-bold truncate max-w-[120px]">{colorName}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PALETTE.map((c) => {
            const isSelected = baseColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                onClick={() => setBaseColor(c.hex, c.name)}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  isSelected ? 'border-brand-crimson scale-110 shadow-lg' : 'border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && (
                  <Check className={`w-4 h-4 mx-auto ${c.hex === '#F0E6D8' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            );
          })}

          {/* Custom Hex Color Picker */}
          <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-neutral-600 hover:border-white cursor-pointer flex items-center justify-center bg-neutral-800 text-[10px] font-mono text-neutral-300">
            <span>HEX</span>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value, 'Custom')}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Custom Hex Picker"
            />
          </label>
        </div>
      </div>

      {/* 3. PRINT PLACEMENT ZONES */}
      <PlacementZoneSelector />

      {/* 4. CREATIVE TOOLS: ARTWORK, TEXT, UPLOAD */}
      <div className="space-y-2.5 pt-2 border-t border-brand-surface-borderDark">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          CUSTOMIZATION TOOLS
        </label>

        {/* Artwork Library Button */}
        <button
          onClick={onOpenArtworkModal}
          className="w-full py-3 px-4 rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson hover:bg-neutral-900 text-white text-xs font-bold tracking-wider flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-crimson group-hover:scale-110 transition-transform" />
            <span>ARTWORK & STICKER LIBRARY</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">10 CATS</span>
        </button>

        {/* Custom Text Button */}
        <button
          onClick={onOpenTextModal}
          className="w-full py-3 px-4 rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson hover:bg-neutral-900 text-white text-xs font-bold tracking-wider flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Type className="w-4 h-4 text-brand-crimson group-hover:scale-110 transition-transform" />
            <span>ADD CUSTOM TEXT</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">FONTS</span>
        </button>

        {/* Upload Custom Graphic */}
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson hover:bg-neutral-900 text-white text-xs font-bold tracking-wider flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-brand-crimson group-hover:scale-110 transition-transform" />
              <span>UPLOAD CUSTOM ARTWORK</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">PNG / JPG</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".png,.jpg,.jpeg,.svg,.webp"
            className="hidden"
          />

          {uploadError && (
            <p className="text-[11px] text-brand-crimson flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* 5. 1-CLICK PRESET INSPIRATIONS */}
        <PresetSelector />

      </div>

    </div>
  );
}
