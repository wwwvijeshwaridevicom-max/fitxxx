'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  description: string;
}

interface CouponState {
  appliedCoupon: AppliedCoupon | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  applyCoupon: (code: string, orderTotal: number) => Promise<{ success: boolean; error?: string; discount?: number }>;
  removeCoupon: () => void;
  clearMessages: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      appliedCoupon: null,
      isLoading: false,
      error: null,
      successMessage: null,

      applyCoupon: async (code, orderTotal) => {
        if (!code.trim()) {
          set({ error: 'Please enter a coupon code', successMessage: null });
          return { success: false, error: 'Please enter a coupon code' };
        }

        set({ isLoading: true, error: null, successMessage: null });
        try {
          const res = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, orderTotal }),
          });
          const data = await res.json();

          if (!res.ok || !data.valid) {
            set({ isLoading: false, error: data.error || 'Invalid coupon code' });
            return { success: false, error: data.error || 'Invalid coupon code' };
          }

          const applied: AppliedCoupon = {
            code: data.code,
            discountAmount: data.discountAmount,
            description: data.description,
          };

          set({
            appliedCoupon: applied,
            isLoading: false,
            error: null,
            successMessage: data.message || `Saved ₹${data.discountAmount.toLocaleString('en-IN')}`,
          });

          return { success: true, discount: data.discountAmount };
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Failed to validate coupon' });
          return { success: false, error: err.message || 'Failed to validate coupon' };
        }
      },

      removeCoupon: () => set({ appliedCoupon: null, error: null, successMessage: null }),
      clearMessages: () => set({ error: null, successMessage: null }),
    }),
    {
      name: 'fitxxx-applied-coupon',
    }
  )
);
