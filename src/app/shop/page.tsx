import React from 'react';
import { Metadata } from 'next';
import { ShopCatalog } from '@/components/shop/ShopCatalog';

export const metadata: Metadata = {
  title: 'Shop All Streetwear Drops — FitXxx',
  description: 'Browse the complete FitXxx collection. 450 GSM oversized hoodies, Korean baggy bottoms, heavyweight boxy tees, and tactical outerwear.',
};

export default function ShopPage() {
  return <ShopCatalog initialCategory="all" />;
}
