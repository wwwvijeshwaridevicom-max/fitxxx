import React from 'react';
import { Metadata } from 'next';
import { Ruler } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Size Guide & Measurements — FitXxx Streetwear',
  description: 'Detailed measurements in cm and inches for FitXxx oversized hoodies, lowers, and t-shirts.',
};

export default function SizeGuidePage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      <div className="mb-10 pb-4 border-b border-brand-surface-borderDark">
        <span className="text-xs font-mono tracking-widest text-brand-crimson uppercase">
          FIT ARCHITECTURE
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight mt-1">
          GARMENT SIZE GUIDE
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          KOREAN OVERSIZED CUTS • UNISEX PATTERNS • CM & INCHES
        </p>
      </div>

      <div className="space-y-10 text-xs font-mono">
        {/* Hoodies */}
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
          <h2 className="font-display font-black text-lg text-white">OVERSIZED HOODIES & SWEATSHIRTS</h2>
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-brand-black">
            <table className="w-full text-left">
              <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-3">SIZE</th>
                  <th className="p-3">CHEST (IN)</th>
                  <th className="p-3">LENGTH (IN)</th>
                  <th className="p-3">SHOULDER (IN)</th>
                  <th className="p-3">SLEEVE (IN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                <tr><td className="p-3 font-bold text-white">XS</td><td className="p-3">44"</td><td className="p-3">27"</td><td className="p-3">22"</td><td className="p-3">23"</td></tr>
                <tr><td className="p-3 font-bold text-white">S</td><td className="p-3">46"</td><td className="p-3">28"</td><td className="p-3">23"</td><td className="p-3">23.5"</td></tr>
                <tr><td className="p-3 font-bold text-white">M</td><td className="p-3">48"</td><td className="p-3">29"</td><td className="p-3">24"</td><td className="p-3">24"</td></tr>
                <tr><td className="p-3 font-bold text-white">L</td><td className="p-3">50"</td><td className="p-3">30"</td><td className="p-3">25"</td><td className="p-3">24.5"</td></tr>
                <tr><td className="p-3 font-bold text-white">XL</td><td className="p-3">52"</td><td className="p-3">31"</td><td className="p-3">26"</td><td className="p-3">25"</td></tr>
                <tr><td className="p-3 font-bold text-white">XXL</td><td className="p-3">55"</td><td className="p-3">32"</td><td className="p-3">27"</td><td className="p-3">25.5"</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Lowers */}
        <div className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
          <h2 className="font-display font-black text-lg text-white">KOREAN LOWERS & SWEATPANTS</h2>
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-brand-black">
            <table className="w-full text-left">
              <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="p-3">SIZE</th>
                  <th className="p-3">WAIST (IN)</th>
                  <th className="p-3">OUTSEAM (IN)</th>
                  <th className="p-3">THIGH (IN)</th>
                  <th className="p-3">LEG OPENING (IN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                <tr><td className="p-3 font-bold text-white">XS</td><td className="p-3">28-30"</td><td className="p-3">39"</td><td className="p-3">26"</td><td className="p-3">12"</td></tr>
                <tr><td className="p-3 font-bold text-white">S</td><td className="p-3">30-32"</td><td className="p-3">40"</td><td className="p-3">27"</td><td className="p-3">13"</td></tr>
                <tr><td className="p-3 font-bold text-white">M</td><td className="p-3">32-34"</td><td className="p-3">41"</td><td className="p-3">28"</td><td className="p-3">14"</td></tr>
                <tr><td className="p-3 font-bold text-white">L</td><td className="p-3">34-36"</td><td className="p-3">42"</td><td className="p-3">29"</td><td className="p-3">14.5"</td></tr>
                <tr><td className="p-3 font-bold text-white">XL</td><td className="p-3">36-38"</td><td className="p-3">42.5"</td><td className="p-3">30"</td><td className="p-3">15"</td></tr>
                <tr><td className="p-3 font-bold text-white">XXL</td><td className="p-3">38-42"</td><td className="p-3">43"</td><td className="p-3">31"</td><td className="p-3">16"</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
