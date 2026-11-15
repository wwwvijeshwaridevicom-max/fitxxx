import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, CustomDesignConfig, ShippingAddress } from '@/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => void;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveDesignToProfile: (design: CustomDesignConfig) => void;
  removeSavedDesign: (designId: string) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-syndicate-001',
  email: 'creator@fitxxx.com',
  name: 'Alex Vance',
  role: 'customer',
  createdAt: new Date().toISOString(),
  savedDesigns: [],
  savedAddresses: [
    {
      fullName: 'Alex Vance',
      email: 'creator@fitxxx.com',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 402, Neo Heights, Indiranagar 100ft Rd',
      addressLine2: 'Near 12th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      country: 'India',
    }
  ]
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: 'login',

      openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, authModalTab: tab }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      login: async (identifier, password) => {
        const cleanId = identifier.trim();
        const isOwnerId = cleanId.toLowerCase() === 'jattshiv32@gmail.com' || cleanId === '9816357615';

        if (isOwnerId) {
          // Server-side authentication for owner
          try {
            const res = await fetch('/api/admin/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier: cleanId, password: password || '' }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              return { success: false, error: data.error || 'Invalid owner credentials' };
            }

            const ownerProfile: UserProfile = {
              id: 'owner-master-shiv',
              email: 'JATTSHIV32@GMAIL.COM',
              name: 'SHIV (FITXXX OWNER)',
              role: 'admin',
              createdAt: new Date().toISOString(),
              savedDesigns: get().user?.savedDesigns || [],
              savedAddresses: get().user?.savedAddresses || [],
            };
            set({ user: ownerProfile, isAuthenticated: true, isAuthModalOpen: false });
            return { success: true };
          } catch (err: any) {
            return { success: false, error: err.message || 'Authentication error' };
          }
        }

        // Regular customer authentication
        const user: UserProfile = {
          id: `usr-${Date.now().toString(36)}`,
          email: cleanId,
          name: cleanId.includes('@') ? cleanId.split('@')[0].toUpperCase() : 'FITXXX VIP',
          role: 'customer',
          createdAt: new Date().toISOString(),
          savedDesigns: get().user?.savedDesigns || [],
          savedAddresses: get().user?.savedAddresses || [],
        };
        set({ user, isAuthenticated: true, isAuthModalOpen: false });
        return { success: true };
      },

      loginAsDemoAdmin: () => {
        const adminUser: UserProfile = {
          id: 'admin-fitxxx-root',
          email: 'admin@fitxxx.com',
          name: 'FitXxx Director',
          role: 'admin',
          createdAt: new Date().toISOString(),
          savedDesigns: [],
          savedAddresses: [],
        };
        set({ user: adminUser, isAuthenticated: true, isAuthModalOpen: false });
        // Set lightweight admin session cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = 'fitxxx-admin-session=1; path=/; max-age=86400; SameSite=Lax';
        }
      },

      register: async (name, email, _password) => {
        const user: UserProfile = {
          id: `usr-${Date.now().toString(36)}`,
          email,
          name,
          role: 'customer',
          createdAt: new Date().toISOString(),
          savedDesigns: [],
          savedAddresses: [],
        };
        set({ user, isAuthenticated: true, isAuthModalOpen: false });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof document !== 'undefined') {
          document.cookie = 'fitxxx-admin-session=; path=/; max-age=0';
        }
      },

      saveDesignToProfile: (design) => {
        const currentUser = get().user || DEFAULT_DEMO_USER;
        const existing = currentUser.savedDesigns || [];
        const updatedDesigns = [design, ...existing.filter((d) => d.id !== design.id)];
        set({
          user: {
            ...currentUser,
            savedDesigns: updatedDesigns,
          },
          isAuthenticated: true,
        });
      },

      removeSavedDesign: (designId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = (currentUser.savedDesigns || []).filter((d) => d.id !== designId);
        set({
          user: {
            ...currentUser,
            savedDesigns: updated,
          },
        });
      },

      saveShippingAddress: (address) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const addresses = currentUser.savedAddresses || [];
        set({
          user: {
            ...currentUser,
            savedAddresses: [address, ...addresses],
          },
        });
      },
    }),
    {
      name: 'fitxxx-auth-storage',
    }
  )
);
