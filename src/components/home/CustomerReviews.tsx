'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export function CustomerReviews() {
  const reviews = [
    {
      author: 'Marcus K.',
      handle: '@marcus.fits',
      location: 'Seoul / Mumbai',
      rating: 5,
      product: '001 Chocolate Brown Hoodie',
      title: 'Structured Heavyweight Cotton Drape',
      comment: 'The weight of this hoodie is unbelievable. It maintains its oversized boxy shape without collapsing. The ivory shoulder piping is ultra clean and the antique metal drawstring aglets give it that true luxury streetwear feel.',
      verified: true,
    },
    {
      author: 'Rhea Sengupta',
      handle: '@rhea_street',
      location: 'Bengaluru, IN',
      rating: 5,
      product: '002 Ivory × Brown Lower',
      title: 'The Best Korean Baggy Lower Out There',
      comment: 'The balloon leg silhouette on these sweatpants is perfection. The curved chocolate side panels create an insane visual cut. Combined with the star emblem embroidery, this is easily my favorite everyday lower.',
      verified: true,
    },
    {
      author: 'Devon Lee',
      handle: '@devon.raw',
      location: 'Tokyo / London',
      rating: 5,
      product: '003 Black Dragon Hoodie (Customized)',
      title: 'Customizer 3D Engine is Legitimate',
      comment: 'I customized the back graphic with custom Seoul typography in the 3D Studio before ordering. The printed hoodie arrived looking 100% identical to the 3D preview. Crisp screen print and deep jet-black fleece.',
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-brand-charcoal text-white border-y border-brand-surface-borderDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-brand-crimson">
            CREATOR PERSPECTIVES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
            COMMUNITY FIT & STYLING ARCHIVE
          </h2>
          <p className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wider">
            EARLY ACCESS SUPPORTERS & DESIGN COLLABORATORS
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-brand-black border border-brand-surface-borderDark flex flex-col justify-between hover:border-neutral-700 transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {r.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 uppercase">
                      <CheckCircle className="w-3 h-3" />
                      VERIFIED BUYER
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  "{r.title}"
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {r.comment}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-neutral-900 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{r.author}</span>
                  <span className="text-[11px] font-mono text-neutral-500">{r.handle} • {r.location}</span>
                </div>
                <span className="text-[10px] font-mono text-brand-crimson uppercase max-w-[120px] truncate text-right">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
