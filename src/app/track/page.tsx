'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Scissors,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('order') || '';

  const [orderQuery, setOrderQuery] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const maskName = (name?: string) => {
    if (!name) return 'Valued Creator';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };

  const maskEmail = (email?: string) => {
    if (!email || !email.includes('@')) return 'creator@fitxxx.com';
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user}***`;
    return `${maskedUser}@${domain}`;
  };

  const maskAddress = (addr?: string) => {
    if (!addr) return 'Atelier Dispatch Address';
    return `***, ${addr.split(',').slice(-2).join(',').trim() || addr}`;
  };

  const lookupOrder = (query: string) => {
    setValidationError('');
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setValidationError('Please enter an order number or email address.');
      return;
    }

    const isEmail = cleanQuery.includes('@');
    const isOrderNumber = cleanQuery.toUpperCase().startsWith('FITXXX') || cleanQuery.toUpperCase().startsWith('ORD-') || cleanQuery.length >= 6;

    if (!isEmail && !isOrderNumber) {
      setValidationError('Please enter a valid FitXxx order number (e.g. FITXXX-9921A) or registered email.');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const queryUpper = cleanQuery.toUpperCase();

    // 1. Search localStorage orders
    const stored = JSON.parse(localStorage.getItem('fitxxx-orders') || '[]');
    const matched = stored.find(
      (o: any) => 
        (o.orderNumber && o.orderNumber.toUpperCase().includes(queryUpper)) ||
        (o.id && o.id.toUpperCase().includes(queryUpper)) ||
        (o.customer?.email && o.customer.email.toUpperCase() === queryUpper)
    );

    setTimeout(() => {
      if (matched) {
        setSearchedOrder({
          ...matched,
          isFixture: false,
        });
      } else {
        // Fallback realistic tracked order for demonstration fixture
        setSearchedOrder({
          id: `ord-${cleanQuery.toLowerCase()}`,
          orderNumber: cleanQuery.toUpperCase().startsWith('FITXXX') ? cleanQuery.toUpperCase() : `FITXXX-${cleanQuery.toUpperCase()}`,
          isFixture: true,
          customer: { name: 'Kavya Sharma', email: 'kavya@syndicate.io' },
          shippingAddress: {
            fullName: 'Kavya Sharma',
            addressLine1: 'Villa 14, Palm Meadows, 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            pinCode: '560038',
            country: 'India'
          },
          items: [
            {
              title: 'CHOCOLATE BROWN OVERSIZED HOODIE',
              price: 4499,
              quantity: 1,
              size: 'L',
              colorName: 'Chocolate Brown',
              image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
              isCustom: false,
            }
          ],
          total: 4724,
          status: 'production',
          courier: 'Bluedart Express',
          trackingNumber: `BD${Date.now().toString().slice(-9)}IN`,
          estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          }),
          createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
        });
      }
      setLoading(false);
    }, 350);
  };

  useEffect(() => {
    if (initialQuery) {
      lookupOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(orderQuery);
  };

  const productionStages = [
    { title: 'Payment & Order Placed', desc: 'Verified 256-bit encrypted Razorpay transaction', done: true },
    { title: 'Artwork Verification', desc: 'Atelier design team verified vector print boundaries', done: true },
    { title: '450 GSM French Terry Cut', desc: 'Precision laser fabric drafting & ribbed hem fitting', done: true },
    { title: 'Custom Print & Heat Cure', desc: 'Polyurethane decal press & seam piping integration', done: searchedOrder?.status === 'quality_check' || searchedOrder?.status === 'shipped' || searchedOrder?.status === 'delivered' },
    { title: 'Double-Needle Quality Audit', desc: 'Tensile inspection and luxury metal aglet attachment', done: searchedOrder?.status === 'shipped' || searchedOrder?.status === 'delivered' },
    { title: 'Courier Handover & Dispatched', desc: 'Express airway bill created for rapid courier delivery', done: searchedOrder?.status === 'shipped' || searchedOrder?.status === 'delivered' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* HEADER */}
      <div className="mb-8 pb-4 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          LOGISTICS & PRODUCTION DISPATCH
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
          TRACK YOUR FITXXX ORDER
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          REAL-TIME ATELIER PIPELINE & EXPRESS COURIER RADAR
        </p>
      </div>

      {/* SEARCH BOX */}
      <form onSubmit={handleSearchSubmit} className="mb-10">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark flex flex-col sm:flex-row gap-2 shadow-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="ENTER ORDER NUMBER (e.g. FITXXX-9921A or email)"
              className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl pl-11 pr-4 py-3 text-xs font-mono uppercase text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span>LOCATING...</span>
            ) : (
              <>
                <span>TRACK ORDER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {validationError && (
          <p className="mt-2 text-xs font-mono text-brand-crimson flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{validationError}</span>
          </p>
        )}

        {/* Quick Demo Pill */}
        <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-neutral-500">
          <span>Try demo order fixtures:</span>
          <button
            type="button"
            onClick={() => { setOrderQuery('FITXXX-9921A'); lookupOrder('FITXXX-9921A'); }}
            className="text-brand-crimson hover:underline"
          >
            FITXXX-9921A
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setOrderQuery('FITXXX-9922B'); lookupOrder('FITXXX-9922B'); }}
            className="text-brand-crimson hover:underline"
          >
            FITXXX-9922B
          </button>
        </div>
      </form>

      {/* SEARCH RESULTS */}
      {searchedOrder && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* ORDER STATUS SUMMARY CARD */}
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-surface-borderDark">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson block">
                    ORDER IDENTIFIER
                  </span>
                  {searchedOrder.isFixture && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      DEVELOPMENT DEMO FIXTURE
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">
                  {searchedOrder.orderNumber}
                </h2>
                <span className="text-xs text-neutral-400 font-mono mt-0.5 block">
                  Placed {new Date(searchedOrder.createdAt).toLocaleDateString()} • Customer: {maskName(searchedOrder.customer?.name)} ({maskEmail(searchedOrder.customer?.email)})
                </span>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full font-bold bg-brand-crimson/15 border border-brand-crimson/40 text-brand-crimson inline-flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
                  <span>STATUS: {searchedOrder.status?.toUpperCase() || 'IN PRODUCTION'}</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PAYMENT VERIFIED (PAID)</span>
                </span>
              </div>
            </div>

            {/* ESTIMATED ARRIVAL BAR */}
            <div className="p-4 rounded-xl bg-brand-black border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-crimson/15 border border-brand-crimson/30 text-brand-crimson flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">ESTIMATED ATELIER DELIVERY</span>
                  <span className="text-white font-bold text-sm">
                    {searchedOrder.estimatedDelivery || 'Within 4-5 Business Days'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-neutral-500 uppercase block">COURIER DISPATCH PARTNER</span>
                <span className="text-white font-mono">
                  {searchedOrder.courier || 'Bluedart Express'} • {searchedOrder.trackingNumber || 'BD882194129IN'}
                </span>
              </div>
            </div>

            {/* MANUFACTURING TIMELINE */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300">
                PRODUCTION & CRAFTSMANSHIP TIMELINE
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {productionStages.map((stg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                      stg.done
                        ? 'bg-neutral-900/80 border-emerald-500/30 text-white'
                        : 'bg-brand-black/50 border-neutral-800/80 text-neutral-500 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {stg.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center text-[9px] font-mono">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase">{stg.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">{stg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESTINATION & ITEMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-surface-borderDark text-xs font-mono">
              <div className="p-4 rounded-xl bg-brand-black border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-crimson" />
                  <span>DELIVERY DESTINATION</span>
                </span>
                <p className="text-white font-bold">{maskName(searchedOrder.shippingAddress?.fullName)}</p>
                <p className="text-neutral-400">{maskAddress(searchedOrder.shippingAddress?.addressLine1)}</p>
                <p className="text-neutral-400">
                  {searchedOrder.shippingAddress?.city}, {searchedOrder.shippingAddress?.state} {searchedOrder.shippingAddress?.pinCode}
                </p>
                <p className="text-neutral-400">{searchedOrder.shippingAddress?.country || 'India'}</p>
              </div>

              <div className="p-4 rounded-xl bg-brand-black border border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-brand-crimson" />
                  <span>GARMENTS IN THIS RUN</span>
                </span>
                <div className="space-y-2">
                  {searchedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-white truncate max-w-[200px]">{item.title} ({item.size})</span>
                      <span className="text-brand-crimson font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white">
                    <span>Total Paid</span>
                    <span className="text-brand-crimson">{formatPrice(searchedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/shop"
                className="flex-1 py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2"
              >
                <span>SHOP NEXT DROP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="flex-1 py-3 bg-brand-black hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2"
              >
                <span>CONTACT CONCIERGE</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>

          </div>

        </div>
      )}

      {hasSearched && !searchedOrder && !loading && (
        <div className="p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-brand-crimson mx-auto" />
          <h3 className="font-bold text-white uppercase text-sm">NO ORDER FOUND</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Please verify the order number or email. You can also sign in to your FitXxx account to view your order archive.
          </p>
        </div>
      )}

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 px-4 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-brand-crimson border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            CONNECTING TO ATELIER DISPATCH RADAR...
          </p>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
