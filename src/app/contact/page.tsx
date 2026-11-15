'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send message.');
      } else {
        setTicketId(data.ticketId || null);
        setSubmitted(true);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          CLIENT CONCIERGE
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
          CONTACT FITXXX ATELIER
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          DIRECT LINE TO OUR PRODUCTION & DESIGN TEAM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6 text-xs font-mono text-neutral-400">
          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
            <h3 className="font-bold text-white uppercase text-sm">HEADQUARTERS & LAB</h3>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-crimson flex-shrink-0 mt-0.5" />
              <span>FitXxx Labs, 100ft Road, Indiranagar, Bengaluru, KA 560038, India</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-crimson flex-shrink-0" />
              <span className="text-white">concierge@fitxxx.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-crimson flex-shrink-0" />
              <span>+91 98765 43210 (Mon-Sat, 10am - 7pm IST)</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-2">
            <h4 className="font-bold text-white uppercase text-xs">CUSTOM BULK & WHOLESALE</h4>
            <p className="text-neutral-400 font-sans leading-relaxed">
              For music tours, streetwear collabs, esports jerseys, or private syndicate runs of 50+ units, email <strong className="text-white">atelier@fitxxx.com</strong>.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">DISPATCH RECEIVED</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
                  Our atelier concierge will review your message and reply within 12 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@streetwear.com"
                    className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">MESSAGE / INQUIRY</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your order, custom artwork inquiry, or collaboration..."
                    className="w-full bg-brand-black border border-brand-surface-borderDark rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT DISPATCH</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
