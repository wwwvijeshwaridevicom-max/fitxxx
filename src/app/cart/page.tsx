'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getShippingFee,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

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
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark flex items-baseline justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
            CHECKOUT ARCHIVE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
            SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>
        <Link href="/shop" className="text-xs font-mono text-neutral-400 hover:text-white hidden sm:block">
          CONTINUE SHOPPING →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your bag is currently empty</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Explore our signature drops or design your custom outfit in the 3D Studio.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/shop"
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-widest rounded-xl transition-colors"
            >
              BROWSE SHOP
            </Link>
            <Link
              href="/customize"
              className="px-6 py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>3D CUSTOM STUDIO</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ITEMS LIST */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Alert */}
            <div className="p-4 rounded-xl bg-brand-charcoal border border-brand-surface-borderDark flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-crimson" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">
                    You have unlocked FREE EXPRESS SHIPPING!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> more to unlock FREE shipping.
                  </span>
                )}
              </div>
              <span className="font-mono text-neutral-400">{Math.round(progressToFreeShipping)}%</span>
            </div>

            {/* Line Items */}
            <div className="divide-y divide-brand-surface-borderDark rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  {/* Left: Thumbnail & Info */}
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-24 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      {item.isCustom && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand-crimson text-white text-[9px] font-mono font-bold rounded uppercase">
                          CUSTOM
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white">{item.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span>Size: <strong className="text-white">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full border border-neutral-600" style={{ backgroundColor: item.color }} />
                          {item.colorName}
                        </span>
                      </div>
                      {item.isCustom && item.customDesign && (
                        <span className="inline-block mt-1 text-[11px] font-mono text-brand-crimson">
                          {item.customDesign.layers.length} Custom Print Layer(s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity, Price & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-white min-w-[80px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-500 hover:text-brand-crimson transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-5">
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
                ORDER SUMMARY
              </h3>

              {/* Coupon */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>CODE: {couponCode} (-{formatPrice(discountAmount)})</span>
                    </div>
                    <button onClick={removeCoupon} className="underline text-[11px] text-neutral-400 hover:text-white">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="PROMO CODE (FITXXX10)"
                      className="flex-1 bg-brand-black border border-brand-surface-borderDark px-3.5 py-2.5 text-xs text-white uppercase rounded-xl focus:outline-none focus:border-brand-crimson placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-mono rounded-xl transition-colors"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponMessage && !couponCode && (
                  <p className="text-[11px] text-brand-crimson mt-1 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponMessage.text}</span>
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-neutral-400 border-t border-brand-surface-borderDark pt-4 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% Apparel GST)</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                <div className="pt-3 border-t border-brand-surface-borderDark flex justify-between text-base font-bold text-white font-sans">
                  <span>Estimated Total</span>
                  <span className="text-brand-crimson font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-brand-crimson/25"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RAZORPAY 256-BIT ENCRYPTION</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
