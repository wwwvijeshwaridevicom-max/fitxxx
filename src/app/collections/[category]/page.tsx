import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShopCatalog } from '@/components/shop/ShopCatalog';
import { CATEGORIES_LIST } from '@/data/products';

interface Props {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES_LIST.map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = CATEGORIES_LIST.find((c) => c.id === params.category);
  const name = cat ? cat.name : 'Collection';
  return {
    title: `${name} — FitXxx Streetwear`,
    description: `Explore the ${name} drop from FitXxx. Korean-inspired oversized fashion with 450 GSM French Terry and real-time customizer.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = CATEGORIES_LIST.find((c) => c.id === params.category);

  if (!cat && params.category !== 'all') {
    notFound();
  }

  const title = cat ? cat.name.toUpperCase() : 'COLLECTION';

  return (
    <ShopCatalog
      initialCategory={params.category}
      pageTitle={title}
      pageSubtitle={`Engineered for modern unisex drape. 100% combed cotton, bio-washed.`}
    />
  );
}
