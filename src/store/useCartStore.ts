import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  discountAmount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      discountAmount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (itemData) => {
        const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        set((state) => {
          // If identical ready-made item with same product, size and color exists, increment qty
          if (!itemData.isCustom) {
            const existingIndex = state.items.findIndex(
              (i) => !i.isCustom && i.productId === itemData.productId && i.size === itemData.size && i.color === itemData.color
            );
            if (existingIndex > -1) {
              const updatedItems = [...state.items];
              updatedItems[existingIndex].quantity += itemData.quantity;
              return { items: updatedItems, isOpen: true };
            }
          }
          // Otherwise append as new line item (especially for custom garments)
          return {
            items: [...state.items, { ...itemData, id }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];
          return { items: updatedItems };
        });
      },

      clearCart: () => set({ items: [], couponCode: '', discountAmount: 0 }),

      applyCoupon: async (code: string) => {
        const normalized = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();
        if (!normalized) {
          return { success: false, message: 'Please enter a coupon code' };
        }

        try {
          const res = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: normalized, orderTotal: subtotal }),
          });
          const data = await res.json();
          if (res.ok && data.valid) {
            set({ couponCode: normalized, discountAmount: data.discountAmount });
            return { success: true, message: data.message || `Saved ₹${data.discountAmount.toLocaleString('en-IN')}` };
          } else {
            return { success: false, message: data.error || 'Invalid or expired coupon' };
          }
        } catch {
          // Fallback static checks if offline
          if (normalized === 'FITXXX10') {
            const discount = Math.round(subtotal * 0.10);
            set({ couponCode: normalized, discountAmount: discount });
            return { success: true, message: '10% discount applied to your order!' };
          }
          if (normalized === 'FIRSTDROP500') {
            if (subtotal < 2499) return { success: false, message: 'Minimum ₹2,499 cart required for FIRSTDROP500' };
            set({ couponCode: normalized, discountAmount: 500 });
            return { success: true, message: '₹500 flat discount applied!' };
          }
          return { success: false, message: 'Invalid or expired coupon code' };
        }
      },

      removeCoupon: () => set({ couponCode: '', discountAmount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 1999) return 0;
        return 199;
      },

      getTax: () => {
        const subtotalAfterDiscount = Math.max(0, get().getSubtotal() - get().discountAmount);
        return Math.round(subtotalAfterDiscount * 0.05); // 5% Apparel GST
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().discountAmount;
        const shipping = get().getShippingFee();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'fitxxx-cart-storage',
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode, discountAmount: state.discountAmount }),
    }
  )
);
