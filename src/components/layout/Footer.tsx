'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe, Shield, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterState('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterState('success');
        setNewsletterMsg(data.message);
        setNewsletterEmail('');
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (err: any) {
      setNewsletterState('error');
      setNewsletterMsg(err.message);
    }
  };

  return (
    <footer className="bg-brand-black text-white border-t border-brand-surface-borderDark pt-20 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Manifesto & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-brand-surface-borderDark/60">
          
          <div className="lg:col-span-6 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">
                FIT<span className="text-brand-crimson">XXX</span>
              </span>
            </Link>
            
            <p className="text-neutral-400 text-sm sm:text-base max-w-md font-sans leading-relaxed">
              International unisex streetwear born from raw subculture and Korean oversized silhouettes. 
              We engineer luxury heavyweight French Terry essentials and empower creator-first garment customization.
            </p>

            <div className="flex items-center gap-6 pt-2">
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                DISCIPLINE // GRIND // EVOLVE
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-sm font-bold tracking-widest uppercase font-mono text-neutral-300">
              JOIN THE SYNDICATE
            </h4>
            <p className="text-xs text-neutral-400">
              Unlock private drop access, limited customization artwork, and 10% off your first signature order.
            </p>

            {newsletterState === 'success' ? (
              <div className="flex items-center gap-2 p-3.5 bg-brand-crimson/10 border border-brand-crimson/40 text-brand-crimson rounded-lg text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>{newsletterMsg || "WELCOME TO THE SYNDICATE. CHECK YOUR INBOX FOR CODE FITXXX10."}</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    required
                    disabled={newsletterState === 'loading'}
                    className="flex-1 bg-brand-charcoal border border-brand-surface-borderDark text-white placeholder-neutral-500 px-4 py-3 text-xs tracking-wider rounded-lg focus:outline-none focus:border-brand-crimson disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={newsletterState === 'loading'}
                    className="px-6 py-3 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:scale-100"
                  >
                    <span>{newsletterState === 'loading' ? 'JOINING...' : 'JOIN'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
                {newsletterState === 'error' && (
                  <p className="text-[11px] text-brand-crimson mt-1">{newsletterMsg}</p>
                )}
              </>
            )}

            <p className="text-[11px] text-neutral-600">
              By subscribing you agree to FitXxx's Privacy Policy and Terms. No spam, ever.
            </p>
          </div>

        </div>

        {/* MIDDLE SECTION: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16 border-b border-brand-surface-borderDark/60 text-xs">
          
          <div className="space-y-4">
            <h5 className="font-mono uppercase font-bold tracking-widest text-neutral-300">SHOP READY-MADE</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/collections/hoodies" className="hover:text-white transition-colors">Oversized Hoodies</Link></li>
              <li><Link href="/collections/lowers" className="hover:text-white transition-colors">Korean Lowers</Link></li>
              <li><Link href="/collections/tshirts" className="hover:text-white transition-colors">Boxy T-Shirts</Link></li>
              <li><Link href="/collections/sweatshirts" className="hover:text-white transition-colors">Crewneck Sweatshirts</Link></li>
              <li><Link href="/collections/jackets" className="hover:text-white transition-colors">Tactical Jackets</Link></li>
              <li><Link href="/shop" className="hover:text-brand-crimson font-semibold transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono uppercase font-bold tracking-widest text-neutral-300">CUSTOM STUDIO</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/customize?garment=hoodie" className="hover:text-white transition-colors">Customize Hoodie</Link></li>
              <li><Link href="/customize?garment=lower" className="hover:text-white transition-colors">Customize Lower</Link></li>
              <li><Link href="/customize?garment=tshirt" className="hover:text-white transition-colors">Customize Boxy Tee</Link></li>
              <li><Link href="/customize?garment=jacket" className="hover:text-white transition-colors">Customize Jacket</Link></li>
              <li><Link href="/customize" className="hover:text-brand-crimson font-semibold transition-colors">Launch 3D Studio</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono uppercase font-bold tracking-widest text-neutral-300">APPROVED CONCEPTS</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/product/chocolate-brown-oversized-hoodie" className="hover:text-white transition-colors">001 Chocolate Hoodie</Link></li>
              <li><Link href="/product/ivory-brown-loose-korean-lower" className="hover:text-white transition-colors">002 Ivory × Brown Lower</Link></li>
              <li><Link href="/product/black-dragon-cyber-oversized-hoodie" className="hover:text-white transition-colors">003 Black Dragon Hoodie</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Lookbook 2026</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono uppercase font-bold tracking-widest text-neutral-300">CLIENT SERVICES</h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Garment Size Guide</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Custom Printing FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <h5 className="font-mono uppercase font-bold tracking-widest text-neutral-300">LOCATION & LEGAL</h5>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span>India & Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-neutral-500" />
                <span>Verified Razorpay Gateways</span>
              </div>
              <div className="pt-2 text-[11px] text-neutral-500">
                FitXxx Apparel Ltd. All Rights Reserved.
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 FITXXX STREETWEAR LABS. DESIGN. WEAR. OWN IT.</p>

          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
