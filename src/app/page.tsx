import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ExploreCollections } from '@/components/home/ExploreCollections';
import { CustomizeBanner } from '@/components/home/CustomizeBanner';
import { SignatureLookbookSection } from '@/components/home/SignatureLookbookSection';
import { CampaignShowcaseSection } from '@/components/home/CampaignShowcaseSection';
import { FounderCampaignSection } from '@/components/home/FounderCampaignSection';
import { ProductGridSection } from '@/components/home/ProductGridSection';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { 
  APPROVED_SIGNATURE_PRODUCTS, 
  ALL_PRODUCTS 
} from '@/data/products';

export default function HomePage() {
  // 5. Bestsellers: Signature Approved Series 001 (Chocolate Hoodie) & 002 (Ivory Lower)
  const bestsellers = APPROVED_SIGNATURE_PRODUCTS.filter(
    (p) => p.id === 'prod-001-chocolate-hoodie' || p.id === 'prod-002-ivory-brown-lower'
  );
  
  // 6. New Arrivals: Drop 001 Releases & Founder Edition Combo Set
  const newArrivals = APPROVED_SIGNATURE_PRODUCTS.filter(
    (p) => p.isNewArrival
  );

  // 7. Men's Collection: Approved Streetwear Silhouettes
  const mensProducts = APPROVED_SIGNATURE_PRODUCTS;

  // 8. Women's Collection: Approved Streetwear Silhouettes
  const womensProducts = APPROVED_SIGNATURE_PRODUCTS;

  // 9. Unisex Collection: All 4 Approved Uniforms
  const unisexProducts = APPROVED_SIGNATURE_PRODUCTS;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. TRUST AND BENEFITS STRIP */}
      <TrustStrip />

      {/* 3. EXPLORE OUR COLLECTIONS */}
      <ExploreCollections />

      {/* 4. CUSTOMIZE YOUR OWN BANNER */}
      <CustomizeBanner />

      {/* 5. NEW ARRIVALS (Initial Featured: Black Dragon Hoodie & Black × Red Flame Lower) */}
      <ProductGridSection
        tag="LATEST RELEASES"
        title="NEW ARRIVALS"
        subtitle="Fresh drops from our Seoul design laboratory. Black Dragon cyber graphic hoodie and articulated tribal flame baggy lower."
        products={newArrivals}
        viewAllHref="/collections"
        bg="charcoal"
      />

      {/* 6. BESTSELLERS (Initial Featured: Chocolate Brown Hoodie & Ivory × Brown Lower) */}
      <ProductGridSection
        tag="SIGNATURE APPROVED CONCEPTS"
        title="BESTSELLERS DROP 01"
        subtitle="The iconic FitXxx silhouettes. Crafted with heavyweight French Terry cotton, custom embroidery, and Korean oversized cuts."
        products={bestsellers}
        viewAllHref="/shop"
        bg="black"
      />

      {/* 6B. FOUNDER CAMPAIGN (REAL FOUNDER IDENTITY // BUILT DIFFERENT. WORN DIFFERENT.) */}
      <FounderCampaignSection />

      {/* 6C. EDITORIAL LOOKBOOKS & CAMPAIGNS */}
      <SignatureLookbookSection />
      <CampaignShowcaseSection />

      {/* 7. MEN'S COLLECTION */}
      <ProductGridSection
        tag="CURATED CUTS"
        title="MEN'S STREETWEAR ARCHIVE"
        subtitle="Drop-shoulder hoodies, heavyweight joggers, and tactical layers designed for effortless drape."
        products={mensProducts}
        viewAllHref="/collections/mens"
        bg="black"
      />

      {/* 8. WOMEN'S COLLECTION */}
      <ProductGridSection
        tag="VOLUMINOUS DRAPE"
        title="WOMEN'S OVERSIZED FITS"
        subtitle="Relaxed silhouettes, cropped hems, and exaggerated streetwear aesthetics."
        products={womensProducts}
        viewAllHref="/collections/womens"
        bg="charcoal"
      />

      {/* 9. UNISEX COLLECTION */}
      <ProductGridSection
        tag="GENDERLESS LUXURY"
        title="UNISEX STREETWEAR UNIFORMS"
        subtitle="Clothes engineered for individuals, not conventions. Wear it loose, wear it bold."
        products={unisexProducts}
        viewAllHref="/collections/unisex"
        bg="black"
      />

      {/* 10. CUSTOMER REVIEWS */}
      <CustomerReviews />

      {/* 11. INSTAGRAM GALLERY */}
      <InstagramGallery />
    </div>
  );
}
