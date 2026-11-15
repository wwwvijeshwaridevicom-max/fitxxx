import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_PRODUCTS } from '@/data/products';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = ALL_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Product Not Found — FitXxx' };

  return {
    title: `${product.title} — FitXxx Streetwear`,
    description: product.description,
    openGraph: {
      title: `${product.title} — FitXxx`,
      description: product.description,
      images: [{ url: product.images.front }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = ALL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data for Product SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.images.front, product.images.back],
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'FitXxx',
    },
    offers: {
      '@type': 'Offer',
      url: `https://fitxxx.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
