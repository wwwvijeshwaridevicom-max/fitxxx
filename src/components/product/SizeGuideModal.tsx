'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { GarmentType } from '@/types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentType: GarmentType;
}

export function SizeGuideModal({ isOpen, onClose, garmentType }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'cm' | 'in'>('in');

  if (!isOpen) return null;

  const upperSizes = [
    { size: 'XS', chest: unit === 'in' ? '44"' : '112 cm', length: unit === 'in' ? '27"' : '68 cm', shoulder: unit === 'in' ? '22"' : '56 cm', sleeve: unit === 'in' ? '23"' : '58 cm' },
    { size: 'S', chest: unit === 'in' ? '46"' : '117 cm', length: unit === 'in' ? '28"' : '71 cm', shoulder: unit === 'in' ? '23"' : '58 cm', sleeve: unit === 'in' ? '23.5"' : '60 cm' },
    { size: 'M', chest: unit === 'in' ? '48"' : '122 cm', length: unit === 'in' ? '29"' : '73 cm', shoulder: unit === 'in' ? '24"' : '61 cm', sleeve: unit === 'in' ? '24"' : '61 cm' },
    { size: 'L', chest: unit === 'in' ? '50"' : '127 cm', length: unit === 'in' ? '30"' : '76 cm', shoulder: unit === 'in' ? '25"' : '63 cm', sleeve: unit === 'in' ? '24.5"' : '62 cm' },
    { size: 'XL', chest: unit === 'in' ? '52"' : '132 cm', length: unit === 'in' ? '31"' : '78 cm', shoulder: unit === 'in' ? '26"' : '66 cm', sleeve: unit === 'in' ? '25"' : '63 cm' },
    { size: 'XXL', chest: unit === 'in' ? '55"' : '140 cm', length: unit === 'in' ? '32"' : '81 cm', shoulder: unit === 'in' ? '27"' : '68 cm', sleeve: unit === 'in' ? '25.5"' : '65 cm' },
  ];

  const lowerSizes = [
    { size: 'XS', waist: unit === 'in' ? '28-30"' : '71-76 cm', length: unit === 'in' ? '39"' : '99 cm', thigh: unit === 'in' ? '26"' : '66 cm', cuff: unit === 'in' ? '12"' : '30 cm' },
    { size: 'S', waist: unit === 'in' ? '30-32"' : '76-81 cm', length: unit === 'in' ? '40"' : '101 cm', thigh: unit === 'in' ? '27"' : '68 cm', cuff: unit === 'in' ? '13"' : '33 cm' },
    { size: 'M', waist: unit === 'in' ? '32-34"' : '81-86 cm', length: unit === 'in' ? '41"' : '104 cm', thigh: unit === 'in' ? '28"' : '71 cm', cuff: unit === 'in' ? '14"' : '35 cm' },
    { size: 'L', waist: unit === 'in' ? '34-36"' : '86-91 cm', length: unit === 'in' ? '42"' : '106 cm', thigh: unit === 'in' ? '29"' : '73 cm', cuff: unit === 'in' ? '14.5"' : '37 cm' },
    { size: 'XL', waist: unit === 'in' ? '36-38"' : '91-96 cm', length: unit === 'in' ? '42.5"' : '108 cm', thigh: unit === 'in' ? '30"' : '76 cm', cuff: unit === 'in' ? '15"' : '38 cm' },
    { size: 'XXL', waist: unit === 'in' ? '38-42"' : '96-106 cm', length: unit === 'in' ? '43"' : '109 cm', thigh: unit === 'in' ? '31"' : '79 cm', cuff: unit === 'in' ? '16"' : '40 cm' },
  ];

  const isLower = garmentType === 'lower';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl shadow-2xl p-6 text-white z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-surface-borderDark">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-brand-crimson" />
            <h3 className="font-display font-black text-lg tracking-wider text-white">
              KOREAN OVERSIZED SIZE ARCHITECTURE
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Units Switcher */}
        <div className="flex items-center justify-between py-4">
          <p className="text-xs text-neutral-400 font-sans">
            FitXxx silhouettes are cut intentionally oversized. We recommend taking your normal size for the signature Korean drop drape.
          </p>
          <div className="flex bg-brand-black border border-neutral-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded ${unit === 'in' ? 'bg-brand-crimson text-white font-bold' : 'text-neutral-400'}`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded ${unit === 'cm' ? 'bg-brand-crimson text-white font-bold' : 'text-neutral-400'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-brand-black">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="p-3">SIZE</th>
                {isLower ? (
                  <>
                    <th className="p-3">WAIST</th>
                    <th className="p-3">OUTSEAM</th>
                    <th className="p-3">THIGH</th>
                    <th className="p-3">LEG OPENING</th>
                  </>
                ) : (
                  <>
                    <th className="p-3">CHEST</th>
                    <th className="p-3">LENGTH</th>
                    <th className="p-3">SHOULDER</th>
                    <th className="p-3">SLEEVE</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {isLower
                ? lowerSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-900/60">
                      <td className="p-3 font-bold text-white">{row.size}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.thigh}</td>
                      <td className="p-3">{row.cuff}</td>
                    </tr>
                  ))
                : upperSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-900/60">
                      <td className="p-3 font-bold text-white">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.shoulder}</td>
                      <td className="p-3">{row.sleeve}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Guidance */}
        <div className="mt-4 p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <p><strong className="text-white">Model Specs:</strong> Male model is 6'1" (185cm) wearing size Large. Female model is 5'8" (173cm) wearing size Medium.</p>
          <p><strong className="text-white">Care:</strong> Machine wash cold inside-out. Hang dry to maintain loopback fleece integrity.</p>
        </div>

      </div>
    </div>
  );
}
