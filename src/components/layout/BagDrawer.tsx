'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function BagDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    couponCode, 
    discountAmount, 
    applyCoupon, 
    removeCoupon, 
    getSubtotal, 
    getShippingFee, 
    getTax, 
    getTotal 
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const freeShippingThreshold = 1999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-black text-white border-l border-brand-surface-borderDark flex flex-col shadow-2xl">
          
          {/* HEADER */}
          <div className="p-5 border-b border-brand-surface-borderDark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-crimson" />
              <h3 className="font-display font-black text-lg tracking-wider">
                YOUR BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button 
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="bg-brand-charcoal px-5 py-3 border-b border-brand-surface-borderDark">
            <div className="flex items-center justify-between text-xs mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  YOU'VE UNLOCKED FREE EXPRESS SHIPPING!
                </span>
              ) : (
                <span className="text-neutral-300">
                  Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> more for FREE shipping
                </span>
              )}
              <span className="text-neutral-400 font-mono text-[11px]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-crimson transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-brand-surface-borderDark">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-brand-charcoal border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1">Your bag is currently empty</p>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Explore our latest drops or head over to the 3D Studio to craft your custom garment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full pt-4">
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-widest rounded-lg transition-colors"
                  >
                    EXPLORE SHOP
                  </Link>
                  <Link
                    href="/customize"
                    onClick={closeCart}
                    className="w-full py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    DESIGN YOUR OWN
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.isCustom && (
                      <span className="absolute top-1 left-1 px-1 py-0.5 bg-brand-crimson text-[9px] font-bold rounded uppercase">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-brand-crimson transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                        <span>Size: <strong className="text-neutral-200">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-neutral-600 inline-block"
                            style={{ backgroundColor: item.color }} 
                          />
                          {item.colorName}
                        </span>
                      </div>

                      {item.isCustom && item.customDesign && (
                        <div className="mt-1.5 p-1.5 bg-neutral-900/80 rounded border border-neutral-800/80 text-[10px] text-neutral-400">
                          <span className="text-brand-crimson font-mono font-bold uppercase block">
                            3D Custom Specifications
                          </span>
                          <span>
                            {item.customDesign.layers.length} Layer(s) • Zones: {Array.from(new Set(item.customDesign.layers.map(l => l.zone.replace('_', ' ')))).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-800 rounded bg-neutral-900">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-brand-crimson transition-colors text-neutral-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-brand-crimson transition-colors text-neutral-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

          {/* FOOTER: COUPON & CHECKOUT */}
          {items.length > 0 && (
            <div className="p-5 border-t border-brand-surface-borderDark bg-brand-charcoal/40 space-y-4">
              
              {/* Coupon Form */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      <span>COUPON APPLIED: {couponCode} (-{formatPrice(discountAmount)})</span>
                    </div>
                    <button 
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="PROMO CODE (e.g. FITXXX10)"
                      className="flex-1 bg-brand-black border border-brand-surface-borderDark px-3 py-2 text-xs uppercase tracking-wider rounded-lg focus:outline-none focus:border-brand-crimson text-white placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponMessage && !couponCode && (
                  <p className="text-[11px] text-brand-crimson mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-neutral-200">
                    {shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-mono text-neutral-200">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-brand-surface-borderDark flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="font-mono text-brand-crimson">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-brand-crimson/20"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-neutral-500 font-mono">
                SECURED WITH 256-BIT ENCRYPTION • RAZORPAY VERIFIED
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
