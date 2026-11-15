'use client';

import React, { useState } from 'react';
import { X, Type, AlignLeft, AlignCenter, AlignRight, Check } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextEditorModal({ isOpen, onClose }: TextEditorModalProps) {
  const { activeZone, addLayer } = useCustomizerStore();

  const [text, setText] = useState('FITXXX SYNDICATE');
  const [fontFamily, setFontFamily] = useState<'sans' | 'display' | 'gothic' | 'mono' | 'korean'>('display');
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  if (!isOpen) return null;

  const fontOptions = [
    { id: 'display', name: 'Bold Streetwear (Syne / Impact)', sample: 'SYNDICATE' },
    { id: 'sans', name: 'Clean Minimal Sans (Inter)', sample: 'OVERSIZED' },
    { id: 'gothic', name: 'Gothic Brutalist', sample: 'REBELLION' },
    { id: 'mono', name: 'Industrial Monospace', sample: 'SKU//8901' },
    { id: 'korean', name: 'Korean Seoul Aesthetic', sample: '과부하 서울' },
  ];

  const colorPresets = [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Crimson Red', hex: '#E50924' },
    { name: 'Warm Ivory', hex: '#F0E6D8' },
    { name: 'Matte Black', hex: '#090909' },
    { name: 'Cyber Amber', hex: '#F59E0B' },
    { name: 'Slate Grey', hex: '#94A3B8' },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addLayer({
      type: 'text',
      zone: activeZone,
      text: text.trim(),
      fontFamily,
      fontSize,
      fontColor,
      textAlign,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl shadow-2xl p-6 text-white z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-surface-borderDark">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-brand-crimson" />
            <h3 className="font-display font-black text-lg tracking-wider text-white">
              CUSTOM TEXT & TYPOGRAPHY
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="py-4 space-y-4">
          
          {/* Text Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              YOUR CUSTOM TEXT
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. TOKYO DRIFT, NO LIMITS, 1998"
              className="w-full bg-brand-black border border-brand-surface-borderDark rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
              autoFocus
            />
          </div>

          {/* Font Family Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              FONT FAMILY
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fontOptions.map((font) => (
                <button
                  type="button"
                  key={font.id}
                  onClick={() => setFontFamily(font.id as any)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    fontFamily === font.id
                      ? 'border-brand-crimson bg-brand-crimson/10 text-white font-bold'
                      : 'border-neutral-800 bg-brand-black text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block text-white font-medium truncate">{font.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{font.sample}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              TEXT COLOR
            </label>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setFontColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    fontColor === c.hex ? 'border-brand-crimson scale-110' : 'border-neutral-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Alignment & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                ALIGNMENT
              </label>
              <div className="flex border border-neutral-800 rounded-lg overflow-hidden bg-brand-black">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 p-2 flex justify-center ${textAlign === 'left' ? 'bg-neutral-800 text-brand-crimson' : 'text-neutral-400'}`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`flex-1 p-2 flex justify-center ${textAlign === 'center' ? 'bg-neutral-800 text-brand-crimson' : 'text-neutral-400'}`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`flex-1 p-2 flex justify-center ${textAlign === 'right' ? 'bg-neutral-800 text-brand-crimson' : 'text-neutral-400'}`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1.5">
                <span>SIZE</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-brand-crimson bg-neutral-800 h-2 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-brand-black border border-neutral-800 text-center flex items-center justify-center min-h-[90px]">
            <span
              style={{
                color: fontColor,
                fontSize: `${fontSize * 0.75}px`,
                textAlign,
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
            >
              {text || 'PREVIEW TEXT'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all mt-6"
          >
            <Check className="w-4 h-4" />
            <span>ADD TEXT TO {activeZone.toUpperCase().replace('_', ' ')}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
