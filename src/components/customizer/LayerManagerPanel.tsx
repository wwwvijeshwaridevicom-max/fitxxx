'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Trash2, 
  Copy, 
  RotateCw, 
  Move, 
  Maximize2, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  ShoppingBag, 
  Save, 
  Download, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useCustomizerStore, GARMENT_BASE_PRICES } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function LayerManagerPanel() {
  const {
    garmentType,
    baseColor,
    colorName,
    layers,
    selectedLayerId,
    setSelectedLayerId,
    updateLayer,
    removeLayer,
    duplicateLayer,
    clearAllLayers,
    selectedSize,
    setSelectedSize,
    undo,
    redo,
    undoStack,
    redoStack,
    calculatePrice,
    getDesignConfig,
  } = useCustomizerStore();

  const { addItem } = useCartStore();
  const { saveDesignToProfile, isAuthenticated, openAuthModal } = useAuthStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const totalPrice = calculatePrice();
  const basePrice = GARMENT_BASE_PRICES[garmentType];

  const sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    const designConfig = getDesignConfig();

    addItem({
      productId: `custom-${garmentType}`,
      title: `Custom ${garmentType.toUpperCase()} — ${colorName}`,
      price: totalPrice,
      quantity: 1,
      size: selectedSize,
      color: baseColor,
      colorName: colorName,
      image: garmentType === 'hoodie' 
        ? '/Clothes%20images/red%20hoodie%20image%20.jpeg' 
        : '/Clothes%20images/red%20lower%20image%20best%20.jpeg',
      isCustom: true,
      customDesign: designConfig,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });
  };

  const handleSaveDesign = () => {
    const designConfig = getDesignConfig();
    saveDesignToProfile(designConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadPreview = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `fitxxx-custom-${garmentType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="w-full lg:w-84 bg-brand-charcoal border-t lg:border-t-0 lg:border-l border-brand-surface-borderDark p-5 flex flex-col gap-5 text-white overflow-y-auto max-h-[85vh] lg:max-h-full">
      
      {/* HISTORY CONTROLS */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono uppercase text-neutral-400">DESIGN ACTIONS</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-1.5 rounded-lg bg-brand-black border border-neutral-800 disabled:opacity-30 hover:border-neutral-600 text-neutral-300 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-1.5 rounded-lg bg-brand-black border border-neutral-800 disabled:opacity-30 hover:border-neutral-600 text-neutral-300 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearAllLayers}
            disabled={layers.length === 0}
            className="p-1.5 rounded-lg bg-brand-black border border-neutral-800 disabled:opacity-30 hover:border-brand-crimson text-neutral-400 hover:text-brand-crimson transition-colors"
            title="Reset Design"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ACTIVE LAYERS LIST */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-crimson" />
            <span>DESIGN LAYERS ({layers.length})</span>
          </span>
        </div>

        {layers.length === 0 ? (
          <div className="p-4 rounded-xl bg-brand-black border border-neutral-800 text-center text-xs text-neutral-500">
            No design layers added yet. Use the left panel to add stickers, artwork, typography or custom photos.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {layers.map((layer, index) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-crimson/15 border-brand-crimson text-white font-bold'
                      : 'bg-brand-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-neutral-500">#{index + 1}</span>
                    <span className="truncate">
                      {layer.type === 'graphic' ? layer.graphicName : layer.type === 'text' ? `Text: "${layer.text}"` : 'Custom Upload'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                    {layer.zone.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SELECTED LAYER CONTROLS */}
      {selectedLayer && (
        <div className="p-4 rounded-xl bg-brand-black border border-brand-surface-borderDark space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-2">
            <span className="font-bold text-brand-crimson uppercase truncate max-w-[140px]">
              {selectedLayer.type === 'graphic' ? selectedLayer.graphicName : selectedLayer.type === 'text' ? 'Text Layer' : 'Upload Layer'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => duplicateLayer(selectedLayer.id)}
                className="p-1 rounded text-neutral-400 hover:text-white"
                title="Duplicate layer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeLayer(selectedLayer.id)}
                className="p-1 rounded text-neutral-400 hover:text-brand-crimson"
                title="Delete layer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scale Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
              <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> SCALE</span>
              <span>{Math.round(selectedLayer.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.05"
              value={selectedLayer.scale}
              onChange={(e) => updateLayer(selectedLayer.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-brand-crimson bg-neutral-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Rotation Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
              <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> ROTATE</span>
              <span>{Math.round(selectedLayer.rotation)}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={selectedLayer.rotation}
              onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
              className="w-full accent-brand-crimson bg-neutral-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Position X & Y */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                <span>POS X</span>
                <span>{Math.round(selectedLayer.x)}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={selectedLayer.x}
                onChange={(e) => updateLayer(selectedLayer.id, { x: parseInt(e.target.value) })}
                className="w-full accent-brand-crimson bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                <span>POS Y</span>
                <span>{Math.round(selectedLayer.y)}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={selectedLayer.y}
                onChange={(e) => updateLayer(selectedLayer.id, { y: parseInt(e.target.value) })}
                className="w-full accent-brand-crimson bg-neutral-800 h-1.5 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SIZE SELECTOR */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase text-neutral-400">SELECT GARMENT SIZE</label>
        <div className="grid grid-cols-6 gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedSize === s
                  ? 'bg-brand-crimson text-white shadow-md'
                  : 'bg-brand-black border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="pt-3 border-t border-brand-surface-borderDark space-y-1.5 text-xs text-neutral-400 font-mono">
        <div className="flex justify-between">
          <span>Base {garmentType.toUpperCase()}</span>
          <span className="text-white">{formatPrice(basePrice)}</span>
        </div>
        {totalPrice > basePrice && (
          <div className="flex justify-between text-neutral-300">
            <span>Custom Prints & Zones</span>
            <span>+{formatPrice(totalPrice - basePrice)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-neutral-800 flex justify-between text-base font-bold text-white font-sans">
          <span>TOTAL</span>
          <span className="text-brand-crimson font-mono">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-brand-crimson/20"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ADD TO BAG — {formatPrice(totalPrice)}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSaveDesign}
            className="py-2.5 px-3 rounded-lg bg-brand-black border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'SAVED!' : 'SAVE DESIGN'}</span>
          </button>

          <button
            onClick={handleDownloadPreview}
            className="py-2.5 px-3 rounded-lg bg-brand-black border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD</span>
          </button>
        </div>
      </div>

    </div>
  );
}
