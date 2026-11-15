import React from 'react';
import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — FitXxx Streetwear',
  description: 'Everything you need to know about 450 GSM French Terry, the 3D Customizer Studio, print durability, and sizing.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is 450 GSM French Terry, and why does it matter?',
      a: 'Grams per Square Meter (GSM) measures fabric weight and density. Standard commercial hoodies range from 240 to 300 GSM and collapse after a few washes. FitXxx uses 450 GSM pure combed cotton loopback French Terry. It maintains its structural architectural boxy drape, provides thermal comfort, and gets softer with every wash.',
    },
    {
      q: 'How does the 3D Customizer Studio work?',
      a: 'Our customizer uses WebGL/Three.js to dynamically render vector graphics, custom text, and uploaded photos onto UV-mapped 3D garment models. When you place an order, the exact vector coordinates and scale parameters are transmitted directly to our atelier screen-printing machines.',
    },
    {
      q: 'Will custom prints fade or crack after washing?',
      a: 'Never. We utilize high-solids discharge screen printing and water-based plastisol inks with industrial curing ovens at 160°C. The ink penetrates the cotton fibers rather than sitting on top like cheap iron-on vinyl.',
    },
    {
      q: 'Can I upload my own custom graphic or band artwork?',
      a: 'Yes. In the 3D Studio, click "Upload Custom Artwork" to upload PNG, JPG, or SVG files up to 10MB. We recommend transparent PNG files for the cleanest streetwear print result.',
    },
    {
      q: 'Are FitXxx garments true to size?',
      a: 'Our patterns are cut intentionally oversized with dropped shoulders and relaxed chest widths. If you desire the signature Korean streetwear silhouette, take your standard size. If you prefer a traditional standard fit, order one size down.',
    },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          KNOWLEDGE BASE
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="text-brand-crimson font-mono">Q.</span>
              <span>{f.q}</span>
            </h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed pl-5">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
