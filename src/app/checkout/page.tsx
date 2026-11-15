'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Truck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ShippingAddress } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getSubtotal, getShippingFee, getTax, getTotal, couponCode, discountAmount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    country: 'India',
  });

  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'rush'>('standard');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prepopulate user address if available
  useEffect(() => {
    if (user?.savedAddresses && user.savedAddresses.length > 0) {
      setAddress(user.savedAddresses[0]);
    }
  }, [user]);

  // If cart is empty, redirect back to shop
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const subtotal = getSubtotal();
  const baseShipping = getShippingFee();
  const rushFee = deliverySpeed === 'rush' ? 299 : 0;
  const shipping = baseShipping + rushFee;
  const tax = getTax();
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  // Auto-fill state/city based on Indian PIN Code prefix
  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    let city = address.city;
    let state = address.state;

    if (pin.startsWith('11')) {
      city = 'New Delhi';
      state = 'Delhi';
    } else if (pin.startsWith('40')) {
      city = 'Mumbai';
      state = 'Maharashtra';
    } else if (pin.startsWith('56')) {
      city = 'Bengaluru';
      state = 'Karnataka';
    } else if (pin.startsWith('60')) {
      city = 'Chennai';
      state = 'Tamil Nadu';
    } else if (pin.startsWith('70')) {
      city = 'Kolkata';
      state = 'West Bengal';
    } else if (pin.startsWith('50')) {
      city = 'Hyderabad';
      state = 'Telangana';
    }

    setAddress({ ...address, pinCode: pin, city, state });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate inputs
    if (!address.fullName.trim() || !address.email.trim() || !address.phone.trim()) {
      setErrorMessage('Please enter your full name, email, and phone number.');
      return;
    }
    if (address.phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (address.pinCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (!address.addressLine1.trim()) {
      setErrorMessage('Please enter your complete street address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server (server calculates genuine total)
      const createRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          couponCode,
          shippingAddress: address,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || 'Failed to initialize payment order');
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = createData;

      // 2. Determine if real Razorpay key or Demo key
      const isDemoKey = !keyId || keyId.includes('fitxxxDemoKey');

      if (isDemoKey) {
        // SANDBOX / DEMO MODE: Simulate realistic verification through backend HMAC route
        const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: `sig_mock_${Date.now()}`,
            orderDetails: { items, address, total },
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.verified) {
          throw new Error(verifyData.error || 'Payment signature verification failed.');
        }

        const finalizedOrder = {
          id: orderId,
          orderNumber: verifyData.orderNumber,
          customer: { name: address.fullName, email: address.email, phone: address.phone },
          shippingAddress: address,
          items: [...items],
          subtotal,
          discount: discountAmount,
          shipping,
          tax,
          total,
          status: 'received',
          paymentStatus: 'paid',
          paymentMethod: 'razorpay',
          razorpayPaymentId: verifyData.paymentId,
          createdAt: new Date().toISOString(),
        };
        const existingOrders = JSON.parse(localStorage.getItem('fitxxx-orders') || '[]');
        localStorage.setItem('fitxxx-orders', JSON.stringify([finalizedOrder, ...existingOrders]));
        clearCart();
        router.push(`/order-confirmation/${orderId}`);
        return;
      }

      // 3. PRODUCTION MODE: Load Razorpay JS SDK dynamically and open modal
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.head.appendChild(script);
      });

      const options = {
        key: keyId,
        amount: amount,  // in paise
        currency: currency,
        name: 'FitXxx',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#E50924',
          backdrop_color: '#090909',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setErrorMessage('Payment was cancelled. Please try again.');
          },
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: { items, address, total },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
            const finalizedOrder = {
              id: orderId,
              orderNumber: verifyData.orderNumber,
              customer: { name: address.fullName, email: address.email, phone: address.phone },
              shippingAddress: address,
              items: [...items],
              subtotal,
              discount: discountAmount,
              shipping,
              tax,
              total,
              status: 'received',
              paymentStatus: 'paid',
              paymentMethod: 'razorpay',
              razorpayPaymentId: verifyData.paymentId,
              createdAt: new Date().toISOString(),
            };
            const existingOrders = JSON.parse(localStorage.getItem('fitxxx-orders') || '[]');
            localStorage.setItem('fitxxx-orders', JSON.stringify([finalizedOrder, ...existingOrders]));
            clearCart();
            router.push(`/order-confirmation/${orderId}`);
          } catch (err: any) {
            setErrorMessage(err.message || 'Payment verification failed');
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Payment processing error');
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      <div className="mb-8 pb-4 border-b border-brand-surface-borderDark flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
            STEP 2 OF 2
          </span>
          <h1 className="font-display font-black text-3xl text-neutral-900 dark:text-white tracking-tight mt-1">
            SECURE CHECKOUT
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>RAZORPAY 256-BIT ENCRYPTION</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-brand-crimson/15 border border-brand-crimson/40 text-brand-crimson text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: SHIPPING ADDRESS & DELIVERY SPEED */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Details */}
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
              1. CONTACT INFORMATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Alex Vance"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">PHONE NUMBER (+91)</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">EMAIL ADDRESS FOR ORDER UPDATES</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="you@streetwear.com"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
              2. SHIPPING DESTINATION (INDIA & GLOBAL)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">STREET ADDRESS / HOUSE NUMBER</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  placeholder="e.g. Flat 402, Neo Heights, 100ft Road"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">LANDMARK / SUITE (OPTIONAL)</label>
                <input
                  type="text"
                  value={address.addressLine2 || ''}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  placeholder="Near Metro Station"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">PIN CODE (6-DIGIT)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.pinCode}
                  onChange={handlePinCodeChange}
                  placeholder="560038"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">CITY</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">STATE</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">COUNTRY</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
              3. DELIVERY SPEED
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliverySpeed('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliverySpeed === 'standard'
                    ? 'border-brand-crimson bg-brand-crimson/10 text-white font-bold'
                    : 'border-neutral-800 bg-brand-black text-neutral-400'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span>STANDARD EXPRESS</span>
                  <span className="font-mono text-emerald-400">{baseShipping === 0 ? 'FREE' : formatPrice(baseShipping)}</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans mt-1">3-5 business days dispatch</p>
              </div>

              <div
                onClick={() => setDeliverySpeed('rush')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliverySpeed === 'rush'
                    ? 'border-brand-crimson bg-brand-crimson/10 text-white font-bold'
                    : 'border-neutral-800 bg-brand-black text-neutral-400'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span>RUSH 24H DISPATCH</span>
                  <span className="font-mono text-white">+₹299</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-sans mt-1">Priority queue fabrication</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & RAZORPAY CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-5">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300">
              BAG REVIEW ({items.length} ITEMS)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-neutral-800">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-12 h-14 object-cover rounded-lg bg-neutral-900 border border-neutral-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                      Size: {item.size} • Qty: {item.quantity}
                    </span>
                    {item.isCustom && (
                      <span className="text-[9px] font-mono text-brand-crimson uppercase block">
                        3D Custom Artwork
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs font-mono text-neutral-400 border-t border-brand-surface-borderDark pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({couponCode})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({deliverySpeed === 'rush' ? 'Rush' : 'Standard'})</span>
                <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="text-white">{formatPrice(tax)}</span>
              </div>
              <div className="pt-3 border-t border-brand-surface-borderDark flex justify-between text-lg font-bold text-white font-sans">
                <span>Final Total</span>
                <span className="text-brand-crimson font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Pay with Razorpay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-brand-crimson/30"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'PROCESSING SECURE ORDER...' : `PAY ${formatPrice(total)} WITH RAZORPAY`}</span>
            </button>

            <div className="space-y-1 text-center text-[11px] font-mono text-neutral-500">
              <p className="flex items-center justify-center gap-1.5 text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SERVER-VERIFIED RAZORPAY PAYMENT GATEWAY</span>
              </p>
              <p>Supports UPI, NetBanking, Visa, Mastercard, RuPay & EMI</p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
