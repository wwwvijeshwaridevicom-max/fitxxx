import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CustomizerStudio } from '@/components/customizer/CustomizerStudio';

export const metadata: Metadata = {
  title: '3D Customization Studio — FitXxx Streetwear',
  description: 'Design your custom oversized hoodie, sweatpants, or jacket with our interactive 3D studio. Real-time print placement, Korean typography, stickers, and 360-degree preview.',
};

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-black text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-brand-crimson border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs tracking-widest uppercase text-neutral-400">
              LOADING 3D CUSTOM STUDIO...
            </span>
          </div>
        </div>
      }
    >
      <CustomizerStudio />
    </Suspense>
  );
}
