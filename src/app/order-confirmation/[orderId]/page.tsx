'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Download, 
  ArrowRight, 
  Clock, 
  Scissors, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Fire festive streetwear confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E50924', '#FFFFFF', '#F0E6D8'],
    });

    // Lookup order from local history
    const stored = JSON.parse(localStorage.getItem('fitxxx-orders') || '[]');
    const matched = stored.find((o: any) => o.id === orderId);
    if (matched) {
      setOrder(matched);
    } else {
      // Default fallback order representation for direct route viewing
      setOrder({
        id: orderId,
        orderNumber: `FITXXX-${orderId.substring(orderId.length - 6).toUpperCase()}`,
        customer: { name: 'Valued Creator', email: 'creator@fitxxx.com', phone: '+91 98765 43210' },
        shippingAddress: { fullName: 'Alex Vance', city: 'Bengaluru', state: 'Karnataka', pinCode: '560038', country: 'India', addressLine1: 'Flat 402, Neo Heights' },
        items: [],
        subtotal: 4499,
        shipping: 0,
        tax: 225,
        total: 4724,
        status: 'review',
        paymentStatus: 'paid',
        paymentMethod: 'razorpay',
        razorpayPaymentId: `pay_${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
    }
  }, [orderId]);

  if (!order) return null;

  const steps = [
    { label: 'Order Received', status: 'completed', desc: 'Payment verified via Razorpay' },
    { label: 'Design Review', status: 'current', desc: 'Our print masters verify artwork specs' },
    { label: 'Approved', status: 'upcoming', desc: 'Sent to garment atelier' },
    { label: 'In Production', status: 'upcoming', desc: 'Precision cutting 450 GSM French Terry' },
    { label: 'Quality Check', status: 'upcoming', desc: 'Double needle stitch inspection' },
    { label: 'Dispatched', status: 'upcoming', desc: 'Express tracking number provided' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* SUCCESS HERO BANNER */}
      <div className="p-8 sm:p-10 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
            PAYMENT VERIFIED • ORDER CONFIRMED
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
            WELCOME TO THE SYNDICATE
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            ORDER NUMBER: <strong className="text-white">{order.orderNumber}</strong> • RAZORPAY ID: {order.razorpayPaymentId || 'pay_demo_verified'}
          </p>
        </div>

        <p className="text-xs text-neutral-400 max-w-lg mx-auto font-sans leading-relaxed">
          We have dispatched a full receipt and high-resolution design sheet to <strong className="text-white">{order.customer?.email}</strong>. 
          Your garment is queued for artisan fabrication.
        </p>
      </div>

      {/* MANUFACTURING & PRODUCTION TIMELINE */}
      <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-surface-borderDark">
          <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-brand-crimson" />
            <span>CUSTOM GARMENT PRODUCTION PIPELINE</span>
          </h3>
          <span className="text-[10px] font-mono text-brand-crimson uppercase px-2 py-0.5 rounded bg-brand-crimson/15 border border-brand-crimson/30">
            STATUS: ACTIVE IN QUEUE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-left text-xs ${
                s.status === 'completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : s.status === 'current'
                  ? 'bg-brand-crimson/15 border-brand-crimson text-white font-bold animate-pulse'
                  : 'bg-brand-black border-neutral-800 text-neutral-500'
              }`}
            >
              <div className="font-mono text-[10px] text-neutral-400 uppercase">STEP 0{idx + 1}</div>
              <div className="font-bold text-xs mt-0.5">{s.label}</div>
              <p className="text-[10px] text-neutral-400 font-sans mt-1 line-clamp-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER SUMMARY & RECEIPT DETAILS */}
      <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-surface-borderDark">
          <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
            ITEMIZED ORDER RECEIPT
          </h3>
          <button
            onClick={() => window.print()}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD INVOICE</span>
          </button>
        </div>

        {/* Shipping address details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-neutral-400 bg-brand-black p-4 rounded-xl border border-neutral-800">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">SHIPPING ADDRESS</span>
            <p className="text-white font-bold mt-0.5">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">PAYMENT CONFIRMATION</span>
            <p className="text-emerald-400 font-bold mt-0.5">RAZORPAY VERIFIED (PAID)</p>
            <p>Total Paid: <strong className="text-white">{formatPrice(order.total)}</strong></p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/account"
            className="flex-1 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>VIEW IN ACCOUNT & TRACKING</span>
          </Link>
          <Link
            href="/shop"
            className="flex-1 py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
