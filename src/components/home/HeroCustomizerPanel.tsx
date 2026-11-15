'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  Type, 
  Sticker, 
  ShoppingBag, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Bookmark, 
  Check, 
  Compass,
  ArrowRight,
  Flame,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useCustomizerStore, COLOR_PALETTE } from '@/store/useCustomizerStore';
import { ARTWORK_LIBRARY, ARTWORK_CATEGORIES } from '@/data/artworkLibrary';
import { PlacementZone, ArtworkCategory } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';

type CustomizerTab = 'product' | 'color' | 'prints' | 'text' | 'stickers';

export function HeroCustomizerPanel() {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('prints');
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory>('dragons');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const {
    garmentType,
    setGarmentType,
    baseColor,
    setBaseColor,
    activeZone,
    setActiveZone,
    layers,
    addLayer,
    clearAllLayers,
    undo,
    redo,
    undoStack,
    redoStack,
    calculatePrice,
    getDesignConfig
  } = useCustomizerStore();

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const currentPrice = calculatePrice();

  // Print placement zones
  const zones: { id: PlacementZone; label: string; forGarment: 'all' | 'hoodie' | 'lower' }[] = [
    { id: 'front_chest', label: 'Front Chest', forGarment: 'hoodie' },
    { id: 'large_back', label: 'Back', forGarment: 'hoodie' },
    { id: 'left_sleeve', label: 'Left Sleeve', forGarment: 'hoodie' },
    { id: 'right_sleeve', label: 'Right Sleeve', forGarment: 'hoodie' },
    { id: 'hood', label: 'Hood', forGarment: 'hoodie' },
    { id: 'left_thigh', label: 'Left Thigh', forGarment: 'lower' },
    { id: 'right_thigh', label: 'Right Thigh', forGarment: 'lower' },
    { id: 'front_leg', label: 'Front Leg', forGarment: 'lower' },
    { id: 'back_leg', label: 'Back Leg', forGarment: 'lower' },
    { id: 'lower_leg', label: 'Lower Leg', forGarment: 'lower' },
  ];

  const availableZones = zones.filter((z) => {
    if (garmentType === 'combo') return true;
    if (garmentType === 'sweatshirt') return z.forGarment === 'hoodie' && z.id !== 'hood';
    return z.forGarment === 'all' || z.forGarment === garmentType;
  });

  // Artwork list filtered by category
  const filteredArtworks = ARTWORK_LIBRARY.filter(
    (art) => art.category === selectedCategory
  );

  // Handle adding artwork graphic
  const handleAddArtwork = (graphic: typeof ARTWORK_LIBRARY[0]) => {
    addLayer({
      type: 'graphic',
      zone: activeZone,
      graphicId: graphic.id,
      graphicName: graphic.name,
      svgContent: graphic.svgContent,
      x: 0,
      y: activeZone === 'large_back' ? -10 : 0,
      scale: graphic.defaultScale || 1.1,
      rotation: 0,
      opacity: 1.0,
    });
  };

  // Handle adding custom text
  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    addLayer({
      type: 'text',
      zone: activeZone,
      text: customText.toUpperCase(),
      fontFamily: 'mono',
      fontSize: 18,
      fontColor: textColor,
      textAlign: 'center',
      x: 0,
      y: activeZone === 'large_back' ? 70 : 10,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
    });
    setCustomText('');
  };

  // Handle Save Design
  const handleSaveDesign = () => {
    const config = getDesignConfig();
    try {
      const saved = JSON.parse(localStorage.getItem('fitxxx_saved_designs') || '[]');
      saved.unshift(config);
      localStorage.setItem('fitxxx_saved_designs', JSON.stringify(saved.slice(0, 10)));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    const config = getDesignConfig();
    addItem({
      productId: `custom-${config.garmentType}`,
      title: `Custom ${config.garmentType.toUpperCase()} // ${config.colorName}`,
      price: currentPrice,
      quantity: 1,
      size: 'L',
      color: baseColor,
      colorName: config.colorName,
      image: config.garmentType === 'hoodie' 
        ? '/Clothes%20images/red%20hoodie%20image%20.jpeg' 
        : '/Clothes%20images/red%20lower%20image%20best%20.jpeg',
      isCustom: true,
      customDesign: config,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });
  };

  return (
    <div className="w-full rounded-2xl bg-brand-charcoal/95 border border-brand-surface-borderDark p-4 sm:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-md relative z-20 text-white">
      
      {/* HEADER */}
      <div className="pb-3 border-b border-brand-surface-borderDark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
          <h3 className="font-display font-black text-sm tracking-wider uppercase text-white">
            CUSTOMIZATION STUDIO
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-neutral-400 bg-brand-black px-2 py-0.5 rounded border border-neutral-800">
          REAL-TIME 3D
        </span>
      </div>

      {/* TOP TABS: Product, Color, Prints, Text, Stickers */}
      <div className="grid grid-cols-5 gap-1 py-3 border-b border-brand-surface-borderDark text-[10px] font-mono font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('product')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeTab === 'product'
              ? 'bg-brand-crimson text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          Product
        </button>
        <button
          onClick={() => setActiveTab('color')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeTab === 'color'
              ? 'bg-brand-crimson text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setActiveTab('prints')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeTab === 'prints'
              ? 'bg-brand-crimson text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          Prints
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeTab === 'text'
              ? 'bg-brand-crimson text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveTab('stickers')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeTab === 'stickers'
              ? 'bg-brand-crimson text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          Stickers
        </button>
      </div>

      {/* PRINT PLACEMENT ZONE SELECTOR */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-brand-surface-borderDark/60">
        <span className="text-[9px] font-mono uppercase text-neutral-400 flex-shrink-0">ZONE:</span>
        {availableZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setActiveZone(zone.id)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex-shrink-0 transition-all ${
              activeZone === zone.id
                ? 'bg-white text-black font-black shadow-sm'
                : 'bg-brand-black/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT STAGE */}
      <div className="py-3 min-h-[170px] max-h-[220px] overflow-y-auto pr-1">
        
        {/* 1. PRODUCT TAB */}
        {activeTab === 'product' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">SELECT GARMENT SILHOUETTE:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setGarmentType('hoodie')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  garmentType === 'hoodie'
                    ? 'border-brand-crimson bg-brand-crimson/15 text-white'
                    : 'border-neutral-800 bg-brand-black/60 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-display font-black text-[11px] text-white">HOODIE</div>
                <div className="text-[9px] font-mono text-neutral-400 mt-0.5">Heavy French Terry</div>
                <div className="text-xs font-mono font-bold text-brand-crimson mt-1">₹3,999</div>
              </button>

              <button
                onClick={() => setGarmentType('lower')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  garmentType === 'lower'
                    ? 'border-brand-crimson bg-brand-crimson/15 text-white'
                    : 'border-neutral-800 bg-brand-black/60 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-display font-black text-[11px] text-white">LOWER</div>
                <div className="text-[9px] font-mono text-neutral-400 mt-0.5">Articulated Balloon</div>
                <div className="text-xs font-mono font-bold text-brand-crimson mt-1">₹3,499</div>
              </button>

              <button
                onClick={() => setGarmentType('combo')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  garmentType === 'combo'
                    ? 'border-brand-crimson bg-brand-crimson/15 text-white'
                    : 'border-neutral-800 bg-brand-black/60 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-display font-black text-[11px] text-white">COMBO</div>
                <div className="text-[9px] font-mono text-neutral-400 mt-0.5">Full Uniform Set</div>
                <div className="text-xs font-mono font-bold text-brand-crimson mt-1">₹6,999</div>
              </button>
            </div>
          </div>
        )}

        {/* 2. COLOR TAB */}
        {activeTab === 'color' && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">APPROVED COLOR PALETTE:</span>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setBaseColor(c.hex, c.name)}
                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                    baseColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'border-brand-crimson bg-brand-crimson/15'
                      : 'border-neutral-800 bg-brand-black/60 hover:border-neutral-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-mono text-neutral-200 truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. PRINTS TAB */}
        {activeTab === 'prints' && (
          <div className="space-y-2.5">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'dragons', label: 'Dragons' },
                { id: 'flames', label: 'Flames' },
                { id: 'butterflies', label: 'Butterflies' },
                { id: 'stars', label: 'Stars' },
                { id: 'abstract', label: 'Abstract' },
                { id: 'korean_typography', label: 'Korean' },
                { id: 'minimal_symbols', label: 'Symbols' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ArtworkCategory)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-crimson text-white'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Graphics Grid */}
            <div className="grid grid-cols-3 gap-2">
              {filteredArtworks.slice(0, 6).map((graphic) => (
                <button
                  key={graphic.id}
                  onClick={() => handleAddArtwork(graphic)}
                  className="p-2 rounded-xl bg-brand-black/80 border border-neutral-800 hover:border-brand-crimson/60 flex flex-col items-center gap-1.5 group transition-all"
                  title={`Add ${graphic.name} to ${activeZone}`}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center p-1 group-hover:scale-110 transition-transform"
                    dangerouslySetInnerHTML={{ __html: graphic.svgContent }}
                  />
                  <span className="text-[9px] font-mono text-neutral-300 truncate w-full text-center">
                    {graphic.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. TEXT TAB */}
        {activeTab === 'text' && (
          <form onSubmit={handleAddText} className="space-y-2.5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">CUSTOM TYPOGRAPHY:</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. SEOUL / FITXXX"
                maxLength={20}
                className="flex-1 bg-brand-black border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson uppercase"
              />
              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-3 py-2 bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-lg transition-colors"
              >
                ADD
              </button>
            </div>

            {/* Text Color Chips */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[9px] font-mono text-neutral-400 uppercase">COLOR:</span>
              {['#FFFFFF', '#E50924', '#F0E6D8', '#3D2314', '#929292'].map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setTextColor(color)}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    textColor === color ? 'scale-125 border-white ring-2 ring-brand-crimson' : 'border-neutral-700'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </form>
        )}

        {/* 5. STICKERS TAB */}
        {activeTab === 'stickers' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">QUICK DECALS & STICKERS:</span>
            <div className="grid grid-cols-4 gap-2">
              {ARTWORK_LIBRARY.filter((a) => a.category === 'stars' || a.category === 'flames' || a.category === 'minimal_symbols').slice(0, 8).map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleAddArtwork(sticker)}
                  className="aspect-square p-2 rounded-xl bg-brand-black/80 border border-neutral-800 hover:border-brand-crimson flex items-center justify-center group transition-all"
                  title={`Add ${sticker.name}`}
                >
                  <div
                    className="w-8 h-8 group-hover:scale-110 transition-transform"
                    dangerouslySetInnerHTML={{ __html: sticker.svgContent }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ACTION TOOLBAR: Undo, Redo, Reset, Save, Cart */}
      <div className="pt-3 border-t border-brand-surface-borderDark space-y-2.5">
        
        {/* Undo / Redo / Reset / Layers count */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30 transition-opacity"
              title="Undo change"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-30 transition-opacity"
              title="Redo change"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearAllLayers}
              disabled={layers.length === 0}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 disabled:opacity-30 transition-colors"
              title="Reset all prints"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-400">
              {layers.length} {layers.length === 1 ? 'LAYER' : 'LAYERS'}
            </span>
            <button
              onClick={handleSaveDesign}
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition-colors"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">SAVED</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3 h-3" />
                  <span>SAVE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRICING & ADD TO CART CTA */}
        <div className="pt-1 flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-neutral-400 uppercase">PRICE</span>
            <span className="font-mono text-sm font-black text-white">{formatPrice(currentPrice)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 active:scale-95 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/25"
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>ADDED TO BAG!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
