import React from 'react';
import { Metadata } from 'next';
import { ShopCatalog } from '@/components/shop/ShopCatalog';

export const metadata: Metadata = {
  title: 'Streetwear Collections & Archives — FitXxx',
  description: 'Curated Korean oversized streetwear collections. Drop 01 signature series, tactical outerwear, and minimalist essentials.',
};

export default function CollectionsPage() {
  return (
    <ShopCatalog
      initialCategory="all"
      pageTitle="COLLECTIONS & ARCHIVES"
      pageSubtitle="Curated cuts engineered for modern unisex streetwear."
    />
  );
}
