'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Ruler, 
  Rotate3d, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Minus, 
  Star, 
  CheckCircle2,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { SizeGuideModal } from './SizeGuideModal';
import { ProductCard } from './ProductCard';
import { ThreeDErrorBoundary } from '@/components/ErrorBoundary';
import { ALL_PRODUCTS } from '@/data/products';
import confetti from 'canvas-confetti';

const GarmentViewer = dynamic(
  () => import('../viewer3d/GarmentViewer').then((mod) => mod.GarmentViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[4/5] bg-brand-charcoal rounded-2xl flex flex-col items-center justify-center text-neutral-400 gap-3 border border-brand-surface-borderDark animate-pulse">
        <div className="w-10 h-10 border-2 border-brand-crimson border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest uppercase">INITIALIZING 3D PREVIEW...</span>
      </div>
    ),
  }
);

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();

  // Gallery angles from official assets
  const defaultLabels = ['Main View', 'Front View', 'Back View', 'Side Profile', 'Alternate Angle', 'Close-Up Details'];
  const galleryImages: { label: string; url: string }[] = useMemo(() => {
    if (product.images.gallery && product.images.gallery.length > 0) {
      return product.images.gallery.map((url, i) => {
        let label = defaultLabels[i] || `Angle 0${i + 1}`;
        if (product.slug === 'black-dragon-red-flame-combo-set') {
          const comboLabels = [
            'Main Combo',
            'Front View',
            'Dragon Back',
            'Flame Sleeves',
            'Side Profile',
            'Close-Up Detail'
          ];
          label = comboLabels[i] || label;
        } else if (product.slug === 'angel-wings-oversized-sweatshirt-dusty-pink') {
          const pinkLabels = [
            'Flat Lay Front & Back',
            'Men Front Pose',
            'Angel Wings Back',
            'Women Front Drape',
            'Women Back Pose',
            'Macro Detail & Flames'
          ];
          label = pinkLabels[i] || label;
        }
        return { label, url };
      });
    }

    return [
      { label: 'Front', url: product.images.front },
      ...(product.images.display && product.images.display !== product.images.front ? [{ label: 'Display Spec', url: product.images.display }] : []),
      { label: 'Back', url: product.images.back },
      ...(product.images.model ? [{ label: 'Men Campaign', url: product.images.model }] : []),
      ...(product.images.modelWomen ? [{ label: 'Women Campaign', url: product.images.modelWomen }] : []),
      ...(product.images.reference360 ? [{ label: '360° Multi-Angle', url: product.images.reference360 }] : []),
      ...(product.images.detail && product.images.detail !== product.images.front ? [{ label: 'Macro Detail', url: product.images.detail }] : []),
    ];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>(galleryImages[0]?.url || product.images.front);
  const [is3DMode, setIs3DMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Jet Black', hex: '#090909' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[2] || product.sizes[0] || 'L');
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');

  // Fullscreen Lightbox & Zoom States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // PIN code checker state
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  // Live Matrix Inventory per color & size
  const [matrixStock, setMatrixStock] = useState<Record<string, number>>({});
  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const current = data.products.find((p: any) => p.id === product.id);
          if (current?.matrixInventory) {
            const stockMap: Record<string, number> = {};
            current.matrixInventory.forEach((inv: any) => {
              if (inv.colorHex.toLowerCase() === selectedColor.hex.toLowerCase()) {
                stockMap[inv.size] = inv.stockCount;
              }
            });
            setMatrixStock(stockMap);
          }
        }
      })
      .catch(() => {});
  }, [product.id, selectedColor.hex]);

  const isCurrentSizeOutOfStock = Boolean(selectedSize && matrixStock[selectedSize] === 0);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
        setZoomLevel(1);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  const openLightboxAt = (url: string) => {
    const idx = galleryImages.findIndex((g) => g.url === url);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setZoomLevel(1);
    setLightboxOpen(true);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeValid(false);
      setPincodeMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setPincodeValid(true);
    setPincodeMessage(`Express Streetwear Delivery active to ${cleanPin}. Estimated 2-4 business days.`);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor.hex,
      colorName: selectedColor.name,
      image: selectedImage,
      isCustom: false,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor.hex,
      colorName: selectedColor.name,
      image: selectedImage,
      isCustom: false,
    });

    router.push('/checkout');
  };

  const discountAmount = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const discountPercent = product.compareAtPrice ? Math.round((discountAmount / product.compareAtPrice) * 100) : 0;

  const relatedProducts = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* BREADCRUMB */}
      <nav className="text-xs font-mono text-neutral-500 mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-neutral-300">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-neutral-300">SHOP</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-neutral-300">COLLECTIONS</Link>
        <span>/</span>
        {product.tags.includes('Founder Edition') && (
          <>
            <span className="text-neutral-400 uppercase">FOUNDER EDITION</span>
            <span>/</span>
          </>
        )}
        <span className="text-brand-crimson uppercase truncate">{product.title}</span>
      </nav>

      {/* MAIN PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* LEFT COLUMN: MULTI-IMAGE / 3D PREVIEW */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails list (6 Photos) */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedImage(img.url);
                  setIs3DMode(false);
                }}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-900 relative group ${
                  !is3DMode && selectedImage === img.url
                    ? 'border-brand-crimson scale-105 shadow-md ring-2 ring-brand-crimson/30'
                    : 'border-brand-surface-borderDark opacity-70 hover:opacity-100 hover:border-neutral-500'
                }`}
                title={img.label}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm text-[8px] font-mono text-center text-white/90 truncate px-0.5 py-0.5 border-t border-white/10">
                  {img.label}
                </span>
              </button>
            ))}

            {/* 360 3D View Toggle Thumbnail */}
            <button
              onClick={() => setIs3DMode(true)}
              className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 p-2 transition-all flex-shrink-0 ${
                is3DMode
                  ? 'border-brand-crimson bg-brand-crimson/20 text-brand-crimson scale-105 shadow-md ring-2 ring-brand-crimson/30'
                  : 'border-brand-surface-borderDark bg-brand-charcoal text-neutral-400 hover:text-white'
              }`}
              title="Launch 3D interactive view"
            >
              <Rotate3d className="w-6 h-6 animate-pulse text-brand-crimson" />
              <span className="text-[10px] font-mono font-bold uppercase">3D ORBIT</span>
            </button>
          </div>

          {/* Main Visual Display */}
          <div className="flex-1 relative aspect-[3/4] sm:aspect-auto sm:min-h-[620px] rounded-2xl overflow-hidden bg-brand-black border border-brand-surface-borderDark shadow-2xl flex items-center justify-center group">
            {is3DMode ? (
              <ThreeDErrorBoundary>
                <GarmentViewer />
              </ThreeDErrorBoundary>
            ) : (
              <div 
                className="relative w-full h-full cursor-zoom-in overflow-hidden"
                onClick={() => openLightboxAt(selectedImage)}
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Fullscreen Overlay Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightboxAt(selectedImage);
                  }}
                  className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-brand-black/80 hover:bg-brand-crimson text-white text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md border border-neutral-700 transition-all opacity-80 hover:opacity-100 shadow-xl"
                  title="Expand to Fullscreen View"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">FULLSCREEN</span>
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
              {product.tags.includes('Founder Edition') && (
                <span className="px-3 py-1 rounded text-xs font-mono font-black bg-white text-black tracking-widest uppercase shadow-lg border border-neutral-300">
                  FOUNDER EDITION
                </span>
              )}
              {product.tags.includes('Pink Edition') && (
                <span className="px-3 py-1 rounded text-xs font-mono font-black bg-[#D49A9E] text-black tracking-widest uppercase shadow-lg border border-[#E3B0B4]">
                  PINK EDITION
                </span>
              )}
              {product.isSignatureApproved && (
                <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-brand-crimson text-white tracking-widest uppercase shadow-lg">
                  {product.signatureCode || 'APPROVED SIGNATURE'}
                </span>
              )}
            </div>

            {/* 3D Switch Pill */}
            {!is3DMode && (
              <button
                onClick={() => setIs3DMode(true)}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-brand-black/80 hover:bg-brand-crimson text-white text-xs font-mono font-bold tracking-wider flex items-center gap-2 backdrop-blur-md border border-neutral-700/80 transition-all shadow-xl z-10"
              >
                <Rotate3d className="w-4 h-4" />
                <span>360° 3D PREVIEW</span>
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: BUYING OPTIONS & DETAILS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Title & Pricing */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                FITXXX / {product.tags.includes('Founder Edition') ? 'FOUNDER EDITION' : product.category} // ARCHIVE 2026
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-all ${
                  isWishlisted
                    ? 'border-brand-crimson bg-brand-crimson text-white'
                    : 'border-neutral-800 text-neutral-400 hover:text-brand-crimson'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1.5 uppercase">
              {product.title}
            </h1>

            {product.subtitle && (
              <p className="text-xs font-mono text-neutral-400 mt-1 uppercase">
                {product.subtitle}
              </p>
            )}

            <div className="flex items-baseline gap-3 mt-4 flex-wrap">
              <span className="font-mono text-3xl font-black text-neutral-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="font-mono text-base text-neutral-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-crimson/15 border border-brand-crimson text-brand-crimson uppercase">
                    SAVE {formatPrice(discountAmount)} ({discountPercent}% OFF)
                  </span>
                </>
              )}
              <span className="text-xs font-mono text-emerald-400 uppercase w-full sm:w-auto">
                • IN STOCK ({product.stockCount} UNITS)
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2 pt-2 border-t border-brand-surface-borderDark">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400 uppercase">COLORWAY</span>
              <span className="text-neutral-900 dark:text-white font-bold">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => {
                const isSelected = selectedColor.hex.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
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
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="space-y-2 pt-2 border-t border-brand-surface-borderDark">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400 uppercase">SELECT SIZE</span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-brand-crimson hover:underline flex items-center gap-1 font-bold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>SIZE GUIDE (CM/IN)</span>
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {product.sizes.map((s) => {
                const isSoldOut = matrixStock[s] === 0;
                return (
                  <button
                    key={s}
                    disabled={isSoldOut}
                    onClick={() => {
                      if (!isSoldOut) {
                        setSelectedSize(s);
                        setSizeError(false);
                      }
                    }}
                    title={isSoldOut ? 'Out of stock' : `${s} available`}
                    className={`py-3 rounded-xl text-xs font-mono font-bold transition-all border relative overflow-hidden ${
                      isSoldOut
                        ? 'border-neutral-900 bg-neutral-900/60 text-neutral-600 cursor-not-allowed line-through'
                        : selectedSize === s
                        ? 'bg-brand-crimson border-brand-crimson text-white shadow-md'
                        : 'border-neutral-800 bg-brand-charcoal/50 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {s}
                    {isSoldOut && (
                      <span className="block text-[8px] font-sans text-neutral-500 uppercase no-underline">
                        SOLD OUT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p className="text-xs font-mono text-brand-crimson">Please choose a size before adding to bag.</p>
            )}
            {isCurrentSizeOutOfStock && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-brand-crimson/50 text-xs font-mono text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-crimson flex-shrink-0" />
                <span>Size {selectedSize} is currently out of stock. Please select another size.</span>
              </div>
            )}
          </div>

          {/* Quantity & Actions: Add to Bag + Buy Now */}
          <div className="space-y-3 pt-4 border-t border-brand-surface-borderDark">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-neutral-800 rounded-xl bg-brand-charcoal px-2">
                <button
                  disabled={isCurrentSizeOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-neutral-400 hover:text-white disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  disabled={isCurrentSizeOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-neutral-400 hover:text-white disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                disabled={isCurrentSizeOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-brand-crimson hover:bg-brand-crimson/90 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-brand-crimson/25"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isCurrentSizeOutOfStock ? 'SIZE OUT OF STOCK' : `ADD TO BAG — ${formatPrice(product.price * quantity)}`}</span>
              </button>
            </div>

            {/* BUY NOW BUTTON */}
            <button
              disabled={isCurrentSizeOutOfStock}
              onClick={handleBuyNow}
              className="w-full py-4 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black font-display font-black text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 shadow-xl"
            >
              <span>{isCurrentSizeOutOfStock ? 'SIZE CURRENTLY UNAVAILABLE' : 'BUY NOW — PROCEED TO CHECKOUT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* CUSTOMIZE THIS PRODUCT CTA */}
            <Link
              href={`/customize?product=${product.slug}`}
              className="w-full py-3.5 bg-brand-charcoal hover:bg-neutral-800 text-white border border-neutral-700/80 font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-brand-crimson group-hover:scale-110 transition-transform" />
              <span>CUSTOMIZE THIS PIECE IN 3D STUDIO</span>
            </Link>
          </div>

          {/* DELIVERY AVAILABILITY / PIN CODE CHECKER */}
          <div className="pt-4 border-t border-brand-surface-borderDark space-y-2">
            <span className="text-xs font-mono uppercase text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-crimson" />
              <span>DELIVERY AVAILABILITY & DISPATCH ESTIMATE</span>
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code (e.g. 110001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 bg-brand-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-brand-crimson"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold uppercase rounded-xl transition-colors"
              >
                CHECK
              </button>
            </form>
            {pincodeMessage && (
              <p className={`text-xs font-mono ${pincodeValid ? 'text-emerald-400' : 'text-brand-crimson'}`}>
                {pincodeMessage}
              </p>
            )}
          </div>

          {/* TABBED DETAILS / SPECS */}
          <div className="pt-6 border-t border-brand-surface-borderDark">
            <div className="flex border-b border-brand-surface-borderDark text-xs font-mono">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-3 font-bold uppercase transition-colors relative ${
                  activeTab === 'details' ? 'text-brand-crimson' : 'text-neutral-400 hover:text-white'
                }`}
              >
                DESCRIPTION
                {activeTab === 'details' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-crimson" />}
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-2.5 px-3 font-bold uppercase transition-colors relative ${
                  activeTab === 'fabric' ? 'text-brand-crimson' : 'text-neutral-400 hover:text-white'
                }`}
              >
                FABRIC & CRAFT
                {activeTab === 'fabric' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-crimson" />}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 px-3 font-bold uppercase transition-colors relative ${
                  activeTab === 'shipping' ? 'text-brand-crimson' : 'text-neutral-400 hover:text-white'
                }`}
              >
                SHIPPING & CARE
                {activeTab === 'shipping' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-crimson" />}
              </button>
            </div>

            <div className="py-4 text-xs font-sans text-neutral-400 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  
                  {/* UNIFORM / SWEATSHIRT FEATURES CHECKLIST */}
                  <div className="space-y-2 pt-2 border-t border-brand-surface-borderDark/40">
                    <span className="text-[11px] font-mono font-bold text-neutral-300 uppercase block tracking-wider">
                      {product.category === 'sweatshirts' ? 'KEY HIGHLIGHTS:' : 'SIGNATURE UNIFORM SPECIFICATIONS:'}
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                      {product.category === 'sweatshirts' ? (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Signature FitXxx chest branding</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Statement angel-wing back artwork</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>White flame-inspired sleeve graphics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Classic ribbed crew neckline</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Ribbed cuffs and bottom hem</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Relaxed unisex oversized silhouette</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Distinctive dusty pink colourway</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Oversized hoodie silhouette</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Matching baggy lower</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Statement silver dragon back artwork</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Red flame sleeve and lower graphics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Signature embroidered-style FitXxx branding</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Premium drawstrings & metal aglets</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Relaxed Korean streetwear fit</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson flex-shrink-0" />
                            <span>Coordinated two-piece set</span>
                          </li>
                        </>
                      )}
                    </ul>

                    {/* STYLING TIP */}
                    {product.category === 'sweatshirts' && (
                      <div className="pt-3 mt-3 text-xs font-mono text-neutral-300 border-t border-brand-surface-borderDark/40 space-y-1">
                        <span className="text-white font-bold uppercase tracking-wider block">STYLING:</span>
                        <p className="text-neutral-400">
                          Pair it with oversized cargos, baggy lowers or your favourite denim for a complete streetwear look.
                        </p>
                        <p className="text-brand-crimson font-bold uppercase tracking-widest pt-1">
                          FitXxx – Discipline. Grind. Evolve.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'fabric' && (
                <p>{product.fabricDetails}</p>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-1">
                  <p>• Complimentary express shipping across India on orders above ₹1,999.</p>
                  <p>• Standard delivery within 3-5 business days; Custom 3D orders ship within 5-7 business days.</p>
                  <p>• 7-day hassle-free size exchange guarantee.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-24 pt-16 border-t border-brand-surface-borderDark">
        <div className="mb-10">
          <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
            COMPLETE THE STREETWEAR UNIFORM
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight mt-1">
            RELATED ARCHIVAL PIECES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-sm tracking-wider uppercase">
                {product.title}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                [{lightboxIndex + 1} / {galleryImages.length}] — {galleryImages[lightboxIndex]?.label}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
                className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-lg bg-brand-crimson hover:bg-brand-crimson/80 text-white transition-colors"
                title="Close Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Photo Stage */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden my-4">
            <button
              onClick={() => {
                setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                setZoomLevel(1);
              }}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-brand-black/80 hover:bg-brand-crimson text-white border border-neutral-700 transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[lightboxIndex]?.url}
              alt={galleryImages[lightboxIndex]?.label}
              className="max-h-[82vh] max-w-[90vw] object-contain transition-transform duration-300 select-none shadow-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            <button
              onClick={() => {
                setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
                setZoomLevel(1);
              }}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-brand-black/80 hover:bg-brand-crimson text-white border border-neutral-700 transition-all z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 border-t border-neutral-800">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setLightboxIndex(i);
                  setZoomLevel(1);
                }}
                className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  lightboxIndex === i
                    ? 'border-brand-crimson scale-105'
                    : 'border-neutral-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        garmentType={product.garmentType}
      />

    </div>
  );
}
