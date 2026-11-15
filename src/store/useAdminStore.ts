'use client';

import { create } from 'zustand';
import { 
  AdminUser, 
  MatrixInventoryItem, 
  CouponItem, 
  SupportTicket, 
  AuditLogEntry, 
  AdminAnalyticsSummary, 
  SiteSettings,
  OrderLifecycleStatus
} from '@/types/admin';
import { Product } from '@/types';

interface AdminState {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  activeTab: 'overview' | 'products' | 'orders' | 'coupons' | 'support' | 'customers' | 'analytics' | 'cms' | 'audit';
  products: (Product & { matrixInventory?: MatrixInventoryItem[] })[];
  orders: any[];
  coupons: CouponItem[];
  supportTickets: SupportTicket[];
  analytics: AdminAnalyticsSummary | null;
  auditLogs: AuditLogEntry[];
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;

  setActiveTab: (tab: AdminState['activeTab']) => void;
  checkAuth: () => Promise<boolean>;
  loginAdmin: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  
  loadAllAdminData: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  updateStock: (productId: string, colorHex: string, size: string, newStock: number, notes?: string) => Promise<boolean>;
  
  fetchOrders: (status?: string, search?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status?: OrderLifecycleStatus, courierPartner?: string, trackingNumber?: string, trackingUrl?: string, internalNotes?: string) => Promise<boolean>;
  
  fetchCoupons: () => Promise<void>;
  createCoupon: (couponData: Partial<CouponItem>) => Promise<{ success: boolean; error?: string }>;
  toggleCoupon: (code: string, isActive: boolean) => Promise<boolean>;
  
  fetchSupportTickets: (status?: string, priority?: string) => Promise<void>;
  replySupportTicket: (ticketId: string, message: string, isInternalNote?: boolean, statusChange?: string, assignedTo?: string) => Promise<boolean>;
  
  fetchAnalytics: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  adminUser: null,
  isAuthenticated: false,
  activeTab: 'overview',
  products: [],
  orders: [],
  coupons: [],
  supportTickets: [],
  analytics: null,
  auditLogs: [],
  settings: null,
  isLoading: false,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  checkAuth: async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          set({ adminUser: data.user, isAuthenticated: true });
          get().loadAllAdminData();
          return true;
        }
      }
      set({ adminUser: null, isAuthenticated: false });
      return false;
    } catch {
      set({ adminUser: null, isAuthenticated: false });
      return false;
    }
  },

  loginAdmin: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        set({ isLoading: false, error: data.error || 'Login failed' });
        return { success: false, error: data.error || 'Login failed' };
      }

      set({ adminUser: data.user, isAuthenticated: true, isLoading: false, error: null });
      get().loadAllAdminData();
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Network error' });
      return { success: false, error: err.message || 'Network error' };
    }
  },

  logoutAdmin: async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      set({ adminUser: null, isAuthenticated: false });
    }
  },

  loadAllAdminData: async () => {
    set({ isLoading: true });
    await Promise.allSettled([
      get().fetchProducts(),
      get().fetchOrders(),
      get().fetchCoupons(),
      get().fetchSupportTickets(),
      get().fetchAnalytics(),
      get().fetchAuditLogs(),
      get().fetchSettings(),
    ]);
    set({ isLoading: false });
  },

  fetchProducts: async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products) set({ products: data.products });
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  },

  updateStock: async (productId, colorHex, size, newStock, notes) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STOCK',
          productId,
          colorHex,
          size,
          newStock,
          notes,
        }),
      });
      if (res.ok) {
        await get().fetchProducts();
        await get().fetchAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchOrders: async (status, search) => {
    try {
      let url = '/api/admin/orders';
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.orders) set({ orders: data.orders });
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  },

  updateOrderStatus: async (orderId, status, courierPartner, trackingNumber, trackingUrl, internalNotes) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status,
          courierPartner,
          trackingNumber,
          trackingUrl,
          internalNotes,
        }),
      });
      if (res.ok) {
        await get().fetchOrders();
        await get().fetchAnalytics();
        await get().fetchAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchCoupons: async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) set({ coupons: data.coupons });
      }
    } catch (e) {
      console.error('Error fetching coupons:', e);
    }
  },

  createCoupon: async (couponData) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await get().fetchCoupons();
        await get().fetchAuditLogs();
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to create coupon' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  toggleCoupon: async (code, isActive) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, isActive }),
      });
      if (res.ok) {
        await get().fetchCoupons();
        await get().fetchAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchSupportTickets: async (status, priority) => {
    try {
      let url = '/api/admin/support';
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (priority) params.set('priority', priority);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.tickets) set({ supportTickets: data.tickets });
      }
    } catch (e) {
      console.error('Error fetching support tickets:', e);
    }
  },

  replySupportTicket: async (ticketId, message, isInternalNote, statusChange, assignedTo) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message,
          isInternalNote,
          statusChange,
          assignedTo,
        }),
      });
      if (res.ok) {
        await get().fetchSupportTickets();
        await get().fetchAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.analytics) set({ analytics: data.analytics });
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    }
  },

  fetchAuditLogs: async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) set({ auditLogs: data.logs });
      }
    } catch (e) {
      console.error('Error fetching audit logs:', e);
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) set({ settings: data.settings });
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        await get().fetchSettings();
        await get().fetchAuditLogs();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
