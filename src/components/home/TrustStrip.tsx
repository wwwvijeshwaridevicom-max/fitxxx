'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, RefreshCw } from 'lucide-react';

export function TrustStrip() {
  const benefits = [
    {
      icon: <Sparkles className="w-5 h-5 text-brand-crimson" />,
      title: 'HEAVYWEIGHT COTTON FLEECE',
      desc: '100% structured combed cotton engineered for effortless streetwear drape.',
    },
    {
      icon: <Truck className="w-5 h-5 text-brand-crimson" />,
      title: 'FREE EXPRESS SHIPPING',
      desc: 'Complimentary shipping across India on orders above ₹1,999.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-crimson" />,
      title: 'RAZORPAY ENCRYPTED',
      desc: 'Server-verified 256-bit secure payments and instant receipting.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-brand-crimson" />,
      title: 'KOREAN OVERSIZED CUTS',
      desc: 'Engineered balloon leg and drop-shoulder streetwear silhouettes.',
    },
  ];

  return (
    <section className="bg-brand-charcoal dark:bg-brand-charcoal bg-white border-y border-brand-surface-borderDark dark:border-brand-surface-borderDark border-brand-surface-borderLight py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3.5 group">
              <div className="p-2.5 rounded-xl bg-brand-black/80 dark:bg-brand-black/80 bg-neutral-100 border border-neutral-800 dark:border-neutral-800 border-neutral-300 group-hover:border-brand-crimson/50 transition-colors flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 dark:text-white uppercase">
                  {b.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed font-sans">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
