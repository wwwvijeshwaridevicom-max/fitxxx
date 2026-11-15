import { Product } from '@/types';

export const APPROVED_SIGNATURE_PRODUCTS: Product[] = [
  {
    id: 'prod-001-chocolate-hoodie',
    slug: 'chocolate-brown-oversized-hoodie',
    title: 'CHOCOLATE BROWN HOODIE',
    subtitle: 'Signature Approved Series — Product 001',
    description: 'The defining silhouette of FitXxx. Cut in an exaggerated Korean-inspired oversized drape with structured heavyweight French Terry. Features clean ivory piping slicing across the drop shoulders and outer sleeves, contrasted with a precision white FitXxx chest embroidery and custom antique metal drawstring aglets.',
    fabricDetails: 'Heavyweight French Terry (100% Combed Compact Cotton). Loopback interior, ribbed double-needle cuffs & hem, bio-washed for an ultra-soft matte handfeel.',
    price: 4499,
    compareAtPrice: 5999,
    category: 'hoodies',
    tags: ['Signature', 'Bestseller', 'Oversized', 'Heavyweight', 'Approved Concept'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Chocolate Brown', hex: '#3D2314' },
      { name: 'Jet Black', hex: '#090909' },
      { name: 'Warm Ivory', hex: '#F0E6D8' },
    ],
    images: {
      front: '/Clothes%20images/brown%20hoodie%20display%20.jpeg',
      back: '/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg',
      detail: '/Clothes%20images/combo%20set%20chcohalte%20brown%20hoodie%20and%20lower%20ivory%20men%20wear%20model.jpeg',
      model: '/Clothes%20images/wear%20boith%20combo%20brown%20ivopry.jpeg',
      display: '/Clothes%20images/brown%20hoodie%20display%20.jpeg',
      gallery: [
        '/Clothes%20images/brown%20hoodie%20display%20.jpeg',
        '/Clothes%20images/wear%20boith%20combo%20brown%20ivopry.jpeg',
        '/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg',
        '/Clothes%20images/combo%20set%20chcohalte%20brown%20hoodie%20and%20lower%20ivory%20men%20wear%20model.jpeg'
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_001',
    isBestseller: true,
    stockCount: 42,
    garmentType: 'hoodie'
  },
  {
    id: 'prod-002-ivory-brown-lower',
    slug: 'ivory-brown-loose-korean-lower',
    title: 'IVORY × BROWN LOWER',
    subtitle: 'Signature Approved Series — Product 002',
    description: 'Engineered with our signature Korean balloon-leg silhouette. A warm ivory base complemented by sculpted chocolate-brown curved side panels and subtle dark piping. Features a small embroidered star emblem on the upper front, heavy metal drawstring tips, deep slant side pockets, and an ergonomic back pocket.',
    fabricDetails: 'Diagonal French Terry. Double-stitched seams, elasticated drawcord waistband with reinforced brass aglets, relaxed ankle cuff with internal toggle.',
    price: 3799,
    compareAtPrice: 4999,
    category: 'lowers',
    tags: ['Signature', 'Baggy Fit', 'Korean Streetwear', 'Approved Concept'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Warm Ivory', hex: '#F0E6D8' },
      { name: 'Jet Black', hex: '#090909' },
      { name: 'Charcoal Grey', hex: '#2B2B2B' },
    ],
    images: {
      front: '/Clothes%20images/ivory%20x%20brown%20lower%20display%20.jpeg',
      back: '/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg',
      detail: '/Clothes%20images/combo%20set%20chcohalte%20brown%20hoodie%20and%20lower%20ivory%20men%20wear%20model.jpeg',
      model: '/Clothes%20images/wear%20boith%20combo%20brown%20ivopry.jpeg',
      display: '/Clothes%20images/ivory%20x%20brown%20lower%20display%20.jpeg',
      gallery: [
        '/Clothes%20images/ivory%20x%20brown%20lower%20display%20.jpeg',
        '/Clothes%20images/wear%20boith%20combo%20brown%20ivopry.jpeg',
        '/Clothes%20images/combo%20set%20men%20wear%20both%20brown%20ivory.jpeg',
        '/Clothes%20images/combo%20set%20chcohalte%20brown%20hoodie%20and%20lower%20ivory%20men%20wear%20model.jpeg'
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_002',
    isBestseller: true,
    stockCount: 35,
    garmentType: 'lower'
  },
  {
    id: 'prod-003-black-dragon-hoodie',
    slug: 'black-dragon-cyber-oversized-hoodie',
    title: 'BLACK DRAGON HOODIE',
    subtitle: 'Signature Approved Series — Product 003',
    description: 'The iconic high-density graphic hoodie. Matte jet-black finish with a massive metallic silver and slate dragon screen-print dominating the back piece, accented with vibrant crimson red details. Subtle FitXxx chest logo and the 3-line manifesto typography: DISCIPLINE / GRIND / EVOLVE.',
    fabricDetails: 'Heavyweight Brushed Fleece. 100% Ring-Spun Cotton, ultra-dense weave, storm-proof double layer hood, reinforced pocket bar-tacking.',
    price: 4999,
    compareAtPrice: 6499,
    category: 'hoodies',
    tags: ['Signature', 'Dragon', 'Graphic Back', 'Heavyweight', 'Approved Concept'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black', hex: '#090909' },
      { name: 'Charcoal Grey', hex: '#2B2B2B' },
      { name: 'Crimson Red', hex: '#E50924' },
    ],
    images: {
      front: '/Clothes%20images/red%20hoodie%20image%20.jpeg',
      back: '/Clothes%20images/bothwear%20men%20women%20red%20hoodie.jpeg',
      detail: '/Clothes%20images/red%20hoodie%20image%20.jpeg',
      model: '/Clothes%20images/dragoin%20red%20hoodie%20image%20men%20.jpeg',
      modelWomen: '/Clothes%20images/women%20red%20hoodie%20imaage%20.jpeg',
      gallery: [
        '/Clothes%20images/red%20hoodie%20image%20.jpeg',
        '/Clothes%20images/dragoin%20red%20hoodie%20image%20men%20.jpeg',
        '/Clothes%20images/women%20red%20hoodie%20imaage%20.jpeg',
        '/Clothes%20images/bothwear%20men%20women%20red%20hoodie.jpeg'
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_003',
    isBestseller: true,
    isNewArrival: true,
    stockCount: 50,
    garmentType: 'hoodie'
  },
  {
    id: 'prod-004-flame-lower',
    slug: 'black-red-flame-baggy-lower',
    title: 'BLACK × RED FLAME LOWER',
    subtitle: 'Signature Approved Series — Product 004 / Drop 001',
    description: 'Engineered with high-voltage crimson tribal flames leaping from the hem upwards. Relaxed Korean wide-leg silhouette in jet-black heavyweight terry, featuring white FitXxx embroidery, reinforced heavy waistband drawstrings, and 360-degree multi-angle articulated knee pleats.',
    fabricDetails: 'Heavyweight French Terry. 100% Cotton, screen-printed crimson red flames, bio-washed for ultra-soft drape.',
    price: 3999,
    compareAtPrice: 5299,
    category: 'lowers',
    tags: ['Signature', 'Flame', 'Tribal', 'Baggy Fit', 'Approved Concept', 'New Arrival', 'Bestseller'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black with Crimson Flames', hex: '#090909' },
      { name: 'Charcoal Grey', hex: '#2B2B2B' }
    ],
    images: {
      front: '/Clothes%20images/red%20lower%20image%20best%20.jpeg',
      back: '/Clothes%20images/red%20lower%20fire%20360%20view.jpeg',
      display: '/Clothes%20images/red%20lower%20display%20.jpeg',
      model: '/Clothes%20images/men%20model%20red%20lower%20%20side%20and%20wright%20pose%20besr%20.jpeg',
      modelWomen: '/Clothes%20images/women%20red%20lower%20.jpeg',
      reference360: '/Clothes%20images/red%20lower%20fire%20360%20view.jpeg',
      detail: '/Clothes%20images/women%20red%20lower%20wear%20front%20back%20right%20left%20img.jpeg',
      gallery: [
        '/Clothes%20images/red%20lower%20image%20best%20.jpeg',
        '/Clothes%20images/red%20lower%20display%20.jpeg',
        '/Clothes%20images/red%20lower%20fire%20360%20view.jpeg',
        '/Clothes%20images/men%20model%20red%20lower%20%20side%20and%20wright%20pose%20besr%20.jpeg',
        '/Clothes%20images/women%20red%20lower%20.jpeg',
        '/Clothes%20images/women%20red%20lower%20wear%20front%20back%20right%20left%20img.jpeg',
        '/Clothes%20images/red%20lower%20girl%20and%20mem%20image%20.jpeg'
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_004',
    isBestseller: true,
    isNewArrival: true,
    stockCount: 48,
    garmentType: 'lower'
  },
  {
    id: 'prod-005-black-dragon-red-flame-combo',
    slug: 'black-dragon-red-flame-combo-set',
    title: 'BLACK DRAGON × RED FLAME COMBO SET',
    subtitle: 'Founder Edition // Complete Streetwear Uniform',
    description: 'A statement-making streetwear combo built for those who refuse to blend in. Featuring a premium oversized black hoodie with a striking silver dragon back graphic, bold crimson sleeve flames, signature FitXxx chest branding and matching relaxed-fit lower with coordinated flame detailing. Designed as one complete streetwear uniform.',
    fabricDetails: 'Heavyweight Loopback French Terry Cotton. Screen-printed crimson tribal flame sleeves and leg graphics with Imperial Silver Dragon back graphic. Double-stitched seams, brushed metal drawstring aglets, and reinforced ribbed trims.',
    price: 4999,
    compareAtPrice: 6499,
    category: 'combos',
    tags: ['Founder Edition', 'Combo Sets', 'New Arrival', 'Signature', 'Oversized', 'Streetwear Uniform'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black / Crimson Red / Silver', hex: '#090909' },
    ],
    images: {
      front: '/Clothes%20images/RED%20COMBO%20DISPLAY.png',
      back: '/Clothes%20images/RED%20COMBO%20SET%20BACK.png',
      display: '/Clothes%20images/RED%20COMBO%20SET%20FRONT.png',
      model: '/Clothes%20images/RED%20COMBO%20LEFT%20SIDE.png',
      modelWomen: '/Clothes%20images/RED%20COMBO%20END.png',
      detail: '/Clothes%20images/red%20hoodie%20image%20.jpeg',
      reference360: '/Clothes%20images/red%20lower%20fire%20360%20view.jpeg',
      gallery: [
        '/Clothes%20images/RED%20COMBO%20DISPLAY.png',
        '/Clothes%20images/RED%20COMBO%20SET%20FRONT.png',
        '/Clothes%20images/RED%20COMBO%20SET%20BACK.png',
        '/Clothes%20images/RED%20COMBO%20LEFT%20SIDE.png',
        '/Clothes%20images/RED%20COMBO%20END.png',
        '/Clothes%20images/red%20hoodie%20image%20.jpeg',
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_005',
    isBestseller: false,
    isNewArrival: true,
    stockCount: 45,
    garmentType: 'combo'
  },
  {
    id: 'prod-006-angel-wings-dusty-pink-sweatshirt',
    slug: 'angel-wings-oversized-sweatshirt-dusty-pink',
    title: 'ANGEL WINGS OVERSIZED SWEATSHIRT – DUSTY PINK',
    subtitle: 'Pink Edition // Unisex Classic Crew Neck',
    description: 'Make a statement with the FitXxx Angel Wings Oversized Sweatshirt. Designed for those who believe in discipline, confidence and individuality. Featuring an iconic white angel-wing back graphic, signature FitXxx chest branding and bold flame-inspired sleeve artwork. Its relaxed oversized silhouette delivers a clean streetwear aesthetic for everyday styling.',
    fabricDetails: 'Heavyweight Loopback French Terry Cotton. Ribbed classic crew neckline, ribbed cuffs, and bottom hem. Screen-printed white angel-wing back graphic with white flame-inspired sleeve details. Pre-shrunk and bio-washed for ultra-soft handfeel.',
    price: 3999,
    compareAtPrice: 5499,
    category: 'sweatshirts',
    tags: ['Pink Edition', 'Sweatshirts', 'Angel Wings', 'New Arrival', 'Signature', 'Oversized', 'Unisex'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Dusty Rose Pink', hex: '#D49A9E' },
    ],
    images: {
      front: '/Clothes%20images/PINK%20SWEATSHIRT%20FRONT%20AND%20BACK.png',
      back: '/Clothes%20images/MEN%20BACK.png',
      display: '/Clothes%20images/PINK%20SWEATSHIRT%20FRONT%20AND%20BACK.png',
      model: '/Clothes%20images/MEN%20PINK.png',
      modelWomen: '/Clothes%20images/WOMEN%20PINK.png',
      detail: '/Clothes%20images/PINK%20CLOSE%20UP.png',
      reference360: '/Clothes%20images/WOMEN%20BACK.png',
      gallery: [
        '/Clothes%20images/PINK%20SWEATSHIRT%20FRONT%20AND%20BACK.png',
        '/Clothes%20images/MEN%20PINK.png',
        '/Clothes%20images/MEN%20BACK.png',
        '/Clothes%20images/WOMEN%20PINK.png',
        '/Clothes%20images/WOMEN%20BACK.png',
        '/Clothes%20images/PINK%20CLOSE%20UP.png',
      ]
    },
    isSignatureApproved: true,
    signatureCode: 'PRODUCT_006',
    isBestseller: false,
    isNewArrival: true,
    stockCount: 40,
    garmentType: 'sweatshirt'
  }
];

// Safely archived unapproved products (deactivated from customer-facing catalog)
export const ARCHIVED_UNAPPROVED_PRODUCTS: Product[] = [
  {
    id: 'prod-004-heavy-boxy-tee',
    slug: 'heavyweight-oversized-boxy-tee',
    title: 'HEAVYWEIGHT BOXY TEE',
    subtitle: 'Core Basics Series [ARCHIVED]',
    description: 'Archived product. Kept for historical order references only.',
    fabricDetails: 'Combed Cotton Single Jersey.',
    price: 2299,
    compareAtPrice: 2999,
    category: 'tshirts',
    tags: ['Archived'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Jet Black', hex: '#090909' }],
    images: {
      front: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      back: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85',
    },
    stockCount: 0,
    garmentType: 'tshirt'
  },
  {
    id: 'prod-005-minimal-crewneck-sweatshirt',
    slug: 'minimal-drop-shoulder-sweatshirt',
    title: 'MINIMAL CREWNECK SWEATSHIRT',
    subtitle: 'Streetwear Uniform Series [ARCHIVED]',
    description: 'Archived product. Kept for historical order references only.',
    fabricDetails: 'Cotton-Poly Heavy Terry blend.',
    price: 3599,
    compareAtPrice: 4499,
    category: 'sweatshirts',
    tags: ['Archived'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Charcoal Grey', hex: '#2B2B2B' }],
    images: {
      front: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85',
      back: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    },
    stockCount: 0,
    garmentType: 'sweatshirt'
  },
  {
    id: 'prod-006-tactical-bomber-jacket',
    slug: 'tactical-cyber-bomber-jacket',
    title: 'TACTICAL CYBER BOMBER',
    subtitle: 'Outerwear Drop 01 [ARCHIVED]',
    description: 'Archived product. Kept for historical order references only.',
    fabricDetails: 'Coated Taslan Nylon exterior.',
    price: 6999,
    compareAtPrice: 8999,
    category: 'jackets',
    tags: ['Archived'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Jet Black', hex: '#090909' }],
    images: {
      front: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      back: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    },
    stockCount: 0,
    garmentType: 'jacket'
  },
  {
    id: 'prod-007-parachute-cargo-lower',
    slug: 'korean-parachute-cargo-pants',
    title: 'KOREAN PARACHUTE LOWER',
    subtitle: 'Bottoms Drop 01 [ARCHIVED]',
    description: 'Archived product. Kept for historical order references only.',
    fabricDetails: 'Ripstop cotton-nylon weave.',
    price: 4199,
    compareAtPrice: 5499,
    category: 'lowers',
    tags: ['Archived'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Jet Black', hex: '#090909' }],
    images: {
      front: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=85',
      back: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
    },
    stockCount: 0,
    garmentType: 'lower'
  },
  {
    id: 'prod-008-cyber-monolith-hoodie',
    slug: 'cyber-monolith-warm-ivory-hoodie',
    title: 'CYBER MONOLITH HOODIE',
    subtitle: 'Graphic Heavyweight Drop [ARCHIVED]',
    description: 'Archived product. Kept for historical order references only.',
    fabricDetails: 'Heavyweight Brushed Cotton Fleece.',
    price: 4699,
    compareAtPrice: 5999,
    category: 'hoodies',
    tags: ['Archived'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Warm Ivory', hex: '#F0E6D8' }],
    images: {
      front: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      back: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
    },
    stockCount: 0,
    garmentType: 'hoodie'
  }
];

// Active customer-facing catalog strictly limited to approved FitXxx signature products
export const ALL_PRODUCTS: Product[] = [
  ...APPROVED_SIGNATURE_PRODUCTS
];

// Safe lookup helper that checks active products first, then archives if necessary
export function findProductByIdOrSlug(idOrSlug: string): Product | undefined {
  const active = ALL_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (active) return active;
  return ARCHIVED_UNAPPROVED_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export const CATEGORIES_LIST = [
  { id: 'all', name: 'All Collections', count: ALL_PRODUCTS.length },
  { id: 'sweatshirts', name: 'Unisex Sweatshirts', count: ALL_PRODUCTS.filter(p => p.category === 'sweatshirts' || p.garmentType === 'sweatshirt').length },
  { id: 'pink', name: 'Pink Edition', count: ALL_PRODUCTS.filter(p => p.tags.includes('Pink Edition')).length },
  { id: 'combos', name: 'Combo Sets', count: ALL_PRODUCTS.filter(p => p.category === 'combos' || p.category === 'combo-sets' || p.garmentType === 'combo').length },
  { id: 'founder', name: 'Founder Edition', count: ALL_PRODUCTS.filter(p => p.tags.includes('Founder Edition')).length },
  { id: 'hoodies', name: 'Hoodies', count: ALL_PRODUCTS.filter(p => p.category === 'hoodies').length },
  { id: 'lowers', name: 'Lowers & Sweatpants', count: ALL_PRODUCTS.filter(p => p.category === 'lowers').length },
  { id: 'mens', name: "Men's Collection", count: ALL_PRODUCTS.length },
  { id: 'womens', name: "Women's Collection", count: ALL_PRODUCTS.length },
  { id: 'unisex', name: 'Unisex Streetwear', count: ALL_PRODUCTS.length },
  { id: 'custom', name: '3D Custom Studio', count: ALL_PRODUCTS.length },
];
