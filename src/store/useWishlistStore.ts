import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  itemIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.itemIds.includes(productId);
          return {
            itemIds: exists
              ? state.itemIds.filter((id) => id !== productId)
              : [...state.itemIds, productId],
          };
        });
      },
      isInWishlist: (productId) => get().itemIds.includes(productId),
      clearWishlist: () => set({ itemIds: [] }),
    }),
    {
      name: 'fitxxx-wishlist-storage',
    }
  )
);
