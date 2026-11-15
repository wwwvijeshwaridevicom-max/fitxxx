'use client';

import React, { useState } from 'react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { PlacementZone } from '@/types';
import { Compass, Sparkles } from 'lucide-react';

export function PlacementZoneSelector() {
  const { garmentType, activeZone, setActiveZone, layers } = useCustomizerStore();
  const [comboView, setComboView] = useState<'upper' | 'lower'>('upper');

  const upperZones: { id: PlacementZone; label: string }[] = [
    { id: 'front_chest', label: 'Front Chest' },
    { id: 'large_back', label: 'Large Back' },
    { id: 'left_sleeve', label: 'Left Sleeve' },
    { id: 'right_sleeve', label: 'Right Sleeve' },
    { id: 'hood', label: 'Hood Graphic' },
  ];

  const lowerZones: { id: PlacementZone; label: string }[] = [
    { id: 'left_thigh', label: 'Left Thigh' },
    { id: 'right_thigh', label: 'Right Thigh' },
    { id: 'front_leg', label: 'Front Leg' },
    { id: 'back_leg', label: 'Back Leg' },
    { id: 'lower_leg', label: 'Lower Leg' },
  ];

  const availableZones = 
    garmentType === 'combo'
      ? (comboView === 'upper' ? upperZones : lowerZones)
      : (garmentType === 'lower' ? lowerZones : (garmentType === 'sweatshirt' ? upperZones.filter(z => z.id !== 'hood') : upperZones));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400">
        <span>PRINT PLACEMENT ZONE</span>
        <span className="text-[10px] text-brand-crimson">AUTOCAMERA SYNC</span>
      </div>

      {/* If combo, show Upper / Lower toggle */}
      {garmentType === 'combo' && (
        <div className="grid grid-cols-2 gap-1 p-1 bg-brand-black rounded-lg border border-neutral-800 text-[11px] font-mono font-bold">
          <button
            onClick={() => {
              setComboView('upper');
              if (!upperZones.some((z) => z.id === activeZone)) {
                setActiveZone('front_chest');
              }
            }}
            className={`py-1.5 rounded text-center transition-all ${
              comboView === 'upper'
                ? 'bg-brand-crimson text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            HOODIE ZONES
          </button>
          <button
            onClick={() => {
              setComboView('lower');
              if (!lowerZones.some((z) => z.id === activeZone)) {
                setActiveZone('left_thigh');
              }
            }}
            className={`py-1.5 rounded text-center transition-all ${
              comboView === 'lower'
                ? 'bg-brand-crimson text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            LOWER ZONES
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {availableZones.map((zone) => {
          const isActive = activeZone === zone.id;
          const zoneLayerCount = layers.filter((l) => l.zone === zone.id).length;

          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold tracking-wider transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-brand-crimson/15 border-brand-crimson text-white shadow-lg shadow-brand-crimson/10'
                  : 'bg-brand-black border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <span>{zone.label}</span>
              {zoneLayerCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-crimson text-white text-[10px] flex items-center justify-center font-mono">
                  {zoneLayerCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
