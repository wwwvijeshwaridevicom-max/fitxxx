// FITXXX ADMIN CONSOLE, SUPPORT & BUSINESS MANAGEMENT TYPES
import { GarmentType, PlacementZone } from './index';

export type AdminRole = 'OWNER' | 'ADMIN' | 'SUPPORT_STAFF' | 'INVENTORY_MANAGER' | 'CUSTOMER';

export interface AdminUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: AdminRole;
  isOwner: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
}

export type OrderLifecycleStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refund_processing'
  | 'refunded';

export interface MatrixInventoryItem {
  id: string;
  productId: string;
  colorHex: string;
  colorName: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stockCount: number;
  reservedCount: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  startsAt: string;
  expiresAt?: string;
  maxUses?: number;
  usedCount: number;
  perCustomerLimit: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt: string;
}

export type TicketCategory = 
  | 'order_status'
  | 'sizing'
  | 'custom_design'
  | 'payment'
  | 'delivery'
  | 'return_refund'
  | 'product_defect'
  | 'other';

export type TicketStatus = 
  | 'new'
  | 'open'
  | 'under_review'
  | 'waiting_customer'
  | 'resolved'
  | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface SupportAttachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderType: 'customer' | 'staff';
  senderName: string;
  senderEmail?: string;
  message: string;
  isInternalNote: boolean;
  attachments?: SupportAttachment[];
  createdAt: string;
}

export interface SupportTicket {
  id: string; // e.g. "FIT-SUPPORT-10001"
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId?: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignedToName?: string;
  resolutionSummary?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: 'PRICE_CHANGE' | 'STOCK_UPDATE' | 'STATUS_CHANGE' | 'COUPON_CREATED' | 'COUPON_TOGGLED' | 'TICKET_RESOLVED' | 'STAFF_ASSIGNED' | 'TRACKING_ADDED' | 'ORDER_REFUNDED';
  entity: 'product' | 'inventory' | 'order' | 'coupon' | 'ticket' | 'setting';
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  notes?: string;
  createdAt: string;
}

export interface AdminAnalyticsSummary {
  grossSales: number;
  netRevenue: number;
  totalDiscounts: number;
  totalRefunds: number;
  totalTaxes: number;
  shippingCollected: number;
  totalOrders: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderLifecycleStatus, number>;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  topProducts: { id: string; title: string; unitsSold: number; revenue: number; image: string }[];
  inventoryHealth: {
    totalSkus: number;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

export interface SiteSettings {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  announcementText: string;
  isAnnouncementActive: boolean;
  allowGuestCheckout: boolean;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
}
