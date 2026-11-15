'use client';

import { create } from 'zustand';
import { SupportTicket, TicketCategory } from '@/types/admin';

interface SupportState {
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  isLoading: boolean;
  isCreateModalOpen: boolean;
  error: string | null;

  setCreateModalOpen: (open: boolean) => void;
  setActiveTicket: (ticket: SupportTicket | null) => void;
  fetchCustomerTickets: (email: string) => Promise<void>;
  createTicket: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderId?: string;
    subject: string;
    category: TicketCategory;
    message: string;
    attachments?: { name: string; url: string }[];
  }) => Promise<{ success: boolean; ticket?: SupportTicket; error?: string }>;
  sendCustomerReply: (ticketId: string, message: string, senderName: string, senderEmail: string) => Promise<{ success: boolean; error?: string }>;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  tickets: [],
  activeTicket: null,
  isLoading: false,
  isCreateModalOpen: false,
  error: null,

  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setActiveTicket: (ticket) => set({ activeTicket: ticket }),

  fetchCustomerTickets: async (email) => {
    if (!email) return;
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/support/tickets?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tickets) {
          set({ tickets: data.tickets, isLoading: false });
          // If active ticket is open, update it
          const currentActive = get().activeTicket;
          if (currentActive) {
            const updated = data.tickets.find((t: SupportTicket) => t.id === currentActive.id);
            if (updated) set({ activeTicket: updated });
          }
        }
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  createTicket: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        set({ isLoading: false, error: result.error || 'Failed to submit complaint' });
        return { success: false, error: result.error || 'Failed to submit complaint' };
      }

      const newTicket = result.ticket;
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
        activeTicket: newTicket,
        isCreateModalOpen: false,
        isLoading: false,
      }));
      return { success: true, ticket: newTicket };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  sendCustomerReply: async (ticketId, message, senderName, senderEmail) => {
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, message, senderName, senderEmail }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Update store
        const updatedTicket = result.ticket;
        set((state) => ({
          activeTicket: state.activeTicket?.id === ticketId ? updatedTicket : state.activeTicket,
          tickets: state.tickets.map(t => t.id === ticketId ? updatedTicket : t),
        }));
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to send message' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
}));
