'use client';

import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { ARTWORK_LIBRARY } from '@/data/artworkLibrary';
import confetti from 'canvas-confetti';

interface DesignPreset {
  id: string;
  name: string;
  garmentType: 'hoodie' | 'lower' | 'tshirt' | 'sweatshirt' | 'jacket';
  baseColor: string;
  colorName: string;
  badge: string;
  layers: any[];
}

export function PresetSelector() {
  const { loadDesignConfig } = useCustomizerStore();

  const presets: DesignPreset[] = [
    {
      id: 'preset-cyber-dragon',
      name: 'Cyber Dragon Drop',
      garmentType: 'hoodie',
      baseColor: '#090909',
      colorName: 'Jet Black',
      badge: 'ICONIC ARCHIVE',
      layers: [
        {
          id: 'layer-back-dragon',
          type: 'graphic',
          zone: 'large_back',
          graphicId: 'art-dragon-imperial',
          graphicName: 'Imperial Silver Dragon',
          x: 0,
          y: 0,
          scale: 1.25,
          rotation: 0,
          opacity: 1,
        },
        {
          id: 'layer-front-text',
          type: 'text',
          zone: 'front_chest',
          text: 'DISCIPLINE',
          fontFamily: 'var(--font-syne)',
          fontSize: 34,
          fontColor: '#FFFFFF',
          textAlign: 'center',
          x: 0,
          y: 0,
          scale: 1.0,
          rotation: 0,
          opacity: 1,
        },
      ],
    },
    {
      id: 'preset-chocolate-piping',
      name: 'Chocolate Brown Piping',
      garmentType: 'hoodie',
      baseColor: '#3D2314',
      colorName: 'Chocolate Brown',
      badge: 'SIGNATURE 001',
      layers: [
        {
          id: 'layer-front-chest-star',
          type: 'graphic',
          zone: 'front_chest',
          graphicId: 'art-symbol-fitxxx-monogram',
          graphicName: 'FitXxx Triple-X Insignia',
          x: 0,
          y: -15,
          scale: 0.85,
          rotation: 0,
          opacity: 1,
        },
      ],
    },
    {
      id: 'preset-underground-flame',
      name: 'Underground Flame Lower',
      garmentType: 'lower',
      baseColor: '#090909',
      colorName: 'Jet Black',
      badge: 'SIGNATURE 004',
      layers: [
        {
          id: 'layer-leg-flame',
          type: 'graphic',
          zone: 'left_lower_leg',
          graphicId: 'art-flame-tribal',
          graphicName: 'Chrome Tribal Fire',
          x: 0,
          y: 0,
          scale: 1.3,
          rotation: 0,
          opacity: 1,
        },
      ],
    },
    {
      id: 'preset-ivory-balloon',
      name: 'Ivory Balloon Drape',
      garmentType: 'lower',
      baseColor: '#F0E6D8',
      colorName: 'Warm Ivory',
      badge: 'SIGNATURE 002',
      layers: [
        {
          id: 'layer-leg-star',
          type: 'graphic',
          zone: 'left_lower_leg',
          graphicId: 'art-star-korean',
          graphicName: 'Korean Starburst 8-Point',
          x: 0,
          y: -20,
          scale: 0.9,
          rotation: 0,
          opacity: 1,
        },
      ],
    },
  ];

  const handleApplyPreset = (preset: DesignPreset) => {
    loadDesignConfig({
      id: `preset-${Date.now()}`,
      title: `${preset.name} (${preset.garmentType.toUpperCase()})`,
      garmentType: preset.garmentType,
      baseColor: preset.baseColor,
      colorName: preset.colorName,
      layers: preset.layers,
      basePrice: 3999,
      calculatedPrice: 4499,
      createdAt: new Date().toISOString(),
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });
  };

  return (
    <div className="space-y-2 pt-2 border-t border-brand-surface-borderDark">
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
        <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
          <Wand2 className="w-3.5 h-3.5 text-brand-crimson" />
          <span>QUICK DESIGN PRESETS</span>
        </span>
        <span className="text-[10px] text-neutral-500">1-CLICK</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleApplyPreset(preset)}
            className="p-2.5 rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson hover:bg-neutral-900 transition-all text-left flex flex-col justify-between gap-1 group"
          >
            <span className="text-[9px] font-mono font-bold text-brand-crimson tracking-widest uppercase">
              {preset.badge}
            </span>
            <span className="text-xs font-bold text-white group-hover:text-brand-crimson transition-colors line-clamp-1">
              {preset.name}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              {preset.colorName} • {preset.garmentType}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
