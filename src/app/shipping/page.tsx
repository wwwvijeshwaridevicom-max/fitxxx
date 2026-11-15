import React from 'react';
import { Metadata } from 'next';
import { Truck, ShieldCheck, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery — FitXxx Streetwear',
  description: 'Shipping rates, dispatch timelines, and delivery protocols for India and international destinations.',
};

export default function ShippingPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          LOGISTICS & ATELIER DISPATCH
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
          SHIPPING & DELIVERY
        </h1>
      </div>

      <div className="space-y-6 text-xs font-sans text-neutral-400">
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <h2 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-crimson" />
            <span>DOMESTIC DISPATCH (INDIA)</span>
          </h2>
          <p>• Complimentary express shipping on all orders totaling ₹1,999 and above. Flat ₹199 standard fee for orders below ₹1,999.</p>
          <p>• Ready-made signature drops dispatch within 24 to 48 hours.</p>
          <p>• Custom 3D garments require 3 to 5 business days for precision printing, heat-curing, and hand bar-tacking.</p>
        </div>

        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <h2 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-crimson" />
            <span>WORLDWIDE COURIER DISPATCH</span>
          </h2>
          <p>• We ship globally via DHL Express and FedEx International Priority.</p>
          <p>• International deliveries typically arrive within 5 to 8 business days following atelier dispatch.</p>
        </div>

        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
          <h2 className="font-mono font-bold text-sm text-white uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-crimson" />
            <span>EXCHANGES & DAMAGE GUARANTEE</span>
          </h2>
          <p>• 7-day hassle-free size exchange guarantee on all unworn garments with tags attached.</p>
          <p>• If a custom garment possesses manufacturing or print misalignment, our atelier will reprint and rush-dispatch a replacement at zero charge.</p>
        </div>
      </div>
    </div>
  );
}
