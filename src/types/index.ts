export type GarmentType = 'hoodie' | 'lower' | 'combo' | 'tshirt' | 'sweatshirt' | 'jacket';

export type PlacementZone = 
  | 'front_chest' 
  | 'large_back' 
  | 'left_sleeve' 
  | 'right_sleeve' 
  | 'hood'
  | 'left_thigh'
  | 'right_thigh'
  | 'front_leg'
  | 'back_leg'
  | 'lower_leg'
  | 'left_lower_leg' 
  | 'right_lower_leg' 
  | 'front_thigh';

export type ArtworkCategory = 
  | 'dragons'
  | 'flames'
  | 'butterflies'
  | 'stars'
  | 'abstract'
  | 'korean_typography'
  | 'minimal_symbols'
  | 'anime'
  | 'geometric'
  | 'motivational';

export interface ArtworkGraphic {
  id: string;
  name: string;
  category: ArtworkCategory;
  svgContent: string;
  defaultScale?: number;
  tags?: string[];
}

export type LayerType = 'graphic' | 'text' | 'upload';

export interface DesignLayer {
  id: string;
  type: LayerType;
  zone: PlacementZone;
  // Graphic layer properties
  graphicId?: string;
  svgContent?: string;
  graphicName?: string;
  // Text layer properties
  text?: string;
  fontFamily?: 'sans' | 'display' | 'gothic' | 'mono' | 'korean';
  fontSize?: number; // relative px or rem
  fontColor?: string;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  // Upload layer properties
  uploadUrl?: string;
  fileName?: string;
  // Transform properties
  x: number; // percentage offset -50 to 50
  y: number; // percentage offset -50 to 50
  scale: number; // 0.2 to 2.5
  rotation: number; // -180 to 180 degrees
  opacity: number;
}

export interface CustomDesignConfig {
  id: string;
  title: string;
  garmentType: GarmentType;
  baseColor: string;
  colorName: string;
  layers: DesignLayer[];
  previewImages?: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
  };
  basePrice: number;
  calculatedPrice: number;
  createdAt?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
  colorName: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  fabricDetails: string;
  price: number;
  compareAtPrice?: number;
  category: 'hoodies' | 'lowers' | 'combos' | 'combo-sets' | 'tshirts' | 'sweatshirts' | 'jackets' | 'mens' | 'womens' | 'unisex' | 'custom';
  tags: string[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: { name: string; hex: string }[];
  images: {
    front: string;
    back: string;
    detail?: string;
    model?: string;
    modelWomen?: string;
    display?: string;
    reference360?: string;
    gallery?: string[];
  };
  isSignatureApproved?: boolean; // For Approved FitXxx Products
  signatureCode?: 'PRODUCT_001' | 'PRODUCT_002' | 'PRODUCT_003' | 'PRODUCT_004' | 'PRODUCT_005' | string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  stockCount: number;
  garmentType: GarmentType;
}

export interface CartItem {
  id: string; // unique item id
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  colorName: string;
  image: string;
  isCustom?: boolean;
  customDesign?: CustomDesignConfig;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export type OrderStatus = 
  | 'received' 
  | 'review' 
  | 'approved' 
  | 'production' 
  | 'quality_check' 
  | 'shipped' 
  | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  savedDesigns?: CustomDesignConfig[];
  createdAt: string;
}
