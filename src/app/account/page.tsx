'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Sparkles, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Trash2, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  MessageSquare,
  Send,
  Plus,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Copy,
  Check
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { useSupportStore } from '@/store/useSupportStore';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { TicketCategory } from '@/types/admin';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, openAuthModal, removeSavedDesign } = useAuthStore();
  const { loadDesignConfig } = useCustomizerStore();
  const { 
    tickets, 
    activeTicket, 
    fetchCustomerTickets, 
    createTicket, 
    sendCustomerReply, 
    setActiveTicket 
  } = useSupportStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'support' | 'designs' | 'addresses' | 'coupons'>('orders');

  // New Ticket Form State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketOrder, setTicketOrder] = useState('');
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>('order_status');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);

  // Customer Reply State
  const [customerReplyText, setCustomerReplyText] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from API or local fallback
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {
        const stored = JSON.parse(localStorage.getItem('fitxxx-orders') || '[]');
        setOrders(stored);
      });

    if (user?.email) {
      fetchCustomerTickets(user.email);
    }
  }, [user?.email, fetchCustomerTickets]);

  const handleOpenDesignInStudio = (design: any) => {
    loadDesignConfig(design);
    router.push('/customize');
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || !user) return;

    setTicketSubmitting(true);
    setTicketError(null);

    const result = await createTicket({
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.savedAddresses?.[0]?.phone || '',
      orderId: ticketOrder || undefined,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      message: ticketMessage.trim(),
    });

    setTicketSubmitting(false);
    if (result.success) {
      setShowNewTicketModal(false);
      setTicketSubject('');
      setTicketMessage('');
      setTicketOrder('');
    } else {
      setTicketError(result.error || 'Failed to submit ticket');
    }
  };

  const handleSendCustomerReply = async (ticketId: string) => {
    if (!customerReplyText.trim() || !user) return;
    await sendCustomerReply(ticketId, customerReplyText.trim(), user.name, user.email);
    setCustomerReplyText('');
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-charcoal border border-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-2xl text-white">SIGN IN TO ACCESS YOUR ACCOUNT</h1>
        <p className="text-xs text-neutral-400">
          Track production progress, contact 24/7 concierge support, and manage your custom 3D pieces.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-colors shadow-lg"
        >
          SIGN IN TO FITXXX
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-neutral-900 dark:text-white">
      
      {/* USER PROFILE HEADER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-crimson/20 border border-brand-crimson text-brand-crimson flex items-center justify-center font-display font-black text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-white tracking-wide">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  OWNER / ADMIN
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">{user.email}</p>
            <p className="text-[11px] font-mono text-neutral-500 mt-1">MEMBER SINCE // 2026 • VIP STATUS</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>OWNER CONSOLE</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-brand-black border border-neutral-800 hover:border-brand-crimson text-neutral-400 hover:text-brand-crimson text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-brand-surface-borderDark no-scrollbar">
        {[
          { id: 'orders', label: 'My Orders & Tracking', icon: Package, count: orders.length },
          { id: 'support', label: 'Help & Complaints', icon: MessageSquare, count: tickets.length },
          { id: 'designs', label: 'Saved 3D Designs', icon: Sparkles, count: user.savedDesigns?.length || 0 },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'coupons', label: 'Exclusive Offers', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-crimson text-white shadow-md'
                  : 'bg-brand-charcoal text-neutral-400 hover:text-white border border-brand-surface-borderDark'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl text-white uppercase">Order History & Tracking</h2>
            <Link href="/track" className="text-xs font-mono text-brand-crimson hover:underline">
              Live Courier Tracker →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
              <Package className="w-10 h-10 text-neutral-500 mx-auto" />
              <p className="text-sm font-bold text-white">No orders placed yet</p>
              <Link href="/shop" className="inline-block px-5 py-2.5 bg-brand-crimson text-white text-xs font-bold rounded-xl">
                EXPLORE CATALOG
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-6 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-white">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-green-950 text-green-400 border border-green-800' :
                          order.status === 'shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/admin/orders/${order.id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white transition-colors"
                      >
                        Invoice (PDF)
                      </a>
                      <Link
                        href={`/track?orderId=${order.orderNumber}`}
                        className="px-3 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson/90 text-xs font-mono text-white transition-colors"
                      >
                        Track Shipment
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-neutral-800 border-t border-b border-neutral-800 py-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center py-2 text-xs font-mono">
                        <div>
                          <span className="text-white font-bold">{item.title}</span>
                          <span className="text-neutral-400 ml-2">({item.size} • {item.colorName || item.color}) × {item.quantity}</span>
                        </div>
                        <span className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dispatch summary */}
                  <div className="flex flex-wrap justify-between items-center text-xs font-mono text-neutral-400">
                    <div>
                      {order.courierPartner ? (
                        <span>Dispatched via <strong className="text-white">{order.courierPartner}</strong> (AWB: <span className="text-blue-400">{order.trackingNumber}</span>)</span>
                      ) : (
                        <span>Status: Order confirmed, preparing for hand-crafted batch tailoring.</span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-white">
                      Total: ₹{order.total?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HELP & COMPLAINTS (CUSTOMER SUPPORT SYSTEM) */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase">
                FitXxx Concierge Support & Complaints
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Direct two-way channel with our production specialists and logistics concierge.
              </p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-brand-crimson/20"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Support Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets list */}
            <div className="bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl p-4 space-y-3 lg:col-span-1 max-h-[600px] overflow-y-auto">
              <div className="text-xs font-mono text-neutral-400 uppercase font-bold mb-2">
                Your Tickets ({tickets.length})
              </div>

              {tickets.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs font-mono">
                  No support tickets raised. Need assistance with an order or custom piece? Click 'Raise Support Ticket' above.
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      activeTicket?.id === t.id
                        ? 'bg-neutral-800 border-brand-crimson'
                        : 'bg-brand-black border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono font-bold text-xs text-brand-crimson">{t.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        t.status === 'resolved' ? 'bg-green-950 text-green-300' : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{t.subject}</h4>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-neutral-500">
                      <span>Category: {t.category}</span>
                      <span>{new Date(t.updatedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Live Message Thread Pane */}
            <div className="bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[480px]">
              {activeTicket ? (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Header */}
                    <div className="pb-4 border-b border-brand-surface-borderDark flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-brand-crimson">{activeTicket.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
                            {activeTicket.category}
                          </span>
                        </div>
                        <h3 className="font-display font-black text-base text-white mt-1">{activeTicket.subject}</h3>
                        {activeTicket.orderId && (
                          <span className="text-xs font-mono text-neutral-400">Order: {activeTicket.orderId}</span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        activeTicket.status === 'resolved' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {activeTicket.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="py-4 space-y-3 max-h-[320px] overflow-y-auto">
                      {activeTicket.messages?.map((m: any) => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-xl border text-xs font-mono ${
                            m.senderType === 'staff'
                              ? 'bg-neutral-800/80 border-neutral-700 text-white ml-6'
                              : 'bg-brand-black border-neutral-800 text-neutral-200 mr-6'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1 text-[10px] text-neutral-400">
                            <span className="font-bold text-brand-crimson">
                              {m.senderType === 'staff' ? 'FITXXX SUPPORT SPECIALIST' : 'YOU'}
                            </span>
                            <span>{new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer reply box */}
                  <div className="pt-4 border-t border-brand-surface-borderDark flex gap-2">
                    <input
                      type="text"
                      value={customerReplyText}
                      onChange={(e) => setCustomerReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendCustomerReply(activeTicket.id);
                      }}
                      placeholder="Type your response to support team..."
                      className="flex-1 bg-brand-black border border-neutral-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                    />
                    <button
                      onClick={() => handleSendCustomerReply(activeTicket.id)}
                      className="px-5 bg-brand-crimson hover:bg-brand-crimson/90 text-white rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 text-neutral-500">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-xs font-mono">Select a ticket from the left panel to view the conversation history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED 3D CUSTOM DESIGNS */}
      {activeTab === 'designs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl text-white uppercase">Saved Custom Pieces</h2>
            <Link
              href="/customize"
              className="px-4 py-2 bg-brand-crimson text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open 3D Studio</span>
            </Link>
          </div>

          {(!user.savedDesigns || user.savedDesigns.length === 0) ? (
            <div className="p-12 text-center rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
              <Sparkles className="w-10 h-10 text-neutral-500 mx-auto" />
              <p className="text-sm font-bold text-white">No custom designs saved yet</p>
              <p className="text-xs text-neutral-400">Launch the 3D Customizer to project graphics, text and personal emblems.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.savedDesigns.map((d) => (
                <div key={d.id} className="p-5 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-black text-sm uppercase text-white">{d.title}</h4>
                      <span className="text-[11px] font-mono text-neutral-400">Garment: {d.garmentType} ({d.colorName})</span>
                    </div>
                    <button
                      onClick={() => removeSavedDesign(d.id)}
                      className="text-neutral-500 hover:text-brand-crimson p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenDesignInStudio(d)}
                    className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-crimson" />
                    <span>Edit in 3D Studio</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6 max-w-2xl">
          <h2 className="font-display font-black text-xl text-white uppercase">Saved Delivery Addresses</h2>
          <div className="p-5 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <span className="text-brand-crimson font-bold uppercase">PRIMARY SHIPPING ADDRESS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-green-950 text-green-400">VERIFIED</span>
            </div>
            <div className="text-white font-bold">{user.savedAddresses?.[0]?.fullName || user.name}</div>
            <div className="text-neutral-300">{user.savedAddresses?.[0]?.addressLine1 || 'Flat 402, Neo Heights, Indiranagar'}</div>
            <div className="text-neutral-400">
              {user.savedAddresses?.[0]?.city || 'Bengaluru'}, {user.savedAddresses?.[0]?.state || 'Karnataka'} - {user.savedAddresses?.[0]?.pinCode || '560038'}
            </div>
            <div className="text-neutral-400">Phone: {user.savedAddresses?.[0]?.phone || '+91 98163 57615'}</div>
          </div>
        </div>
      )}

      {/* TAB 5: EXCLUSIVE OFFERS & COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase">Member Promotional Offers</h2>
            <p className="text-xs font-mono text-neutral-400">Apply these verified promo codes at checkout for instant discounts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'FIRSTDROP500', desc: 'Flat ₹500 off on orders above ₹2,499', tag: 'LAUNCH SPECIAL' },
              { code: 'FITXXX10', desc: '10% instant discount on all orders', tag: 'ALL DROPS' },
              { code: 'FOUNDERVIP', desc: 'Exclusive 20% off on signature combo sets', tag: 'VIP EXCLUSIVE' },
            ].map((c) => (
              <div key={c.code} className="p-5 rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-black text-base text-brand-crimson">{c.code}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-800 text-neutral-300">
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-300">{c.desc}</p>
                </div>

                <button
                  onClick={() => copyToClipboard(c.code)}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCoupon === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Promo Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAISE SUPPORT TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-display font-black text-base uppercase text-white">
              Raise a Support Inquiry / Complaint
            </h3>

            {ticketError && (
              <div className="p-3 rounded-lg bg-red-950 text-red-300 text-xs font-mono">
                {ticketError}
              </div>
            )}

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Inquiry Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                >
                  <option value="order_status">Order Status & Dispatch</option>
                  <option value="delivery">Delivery Delay or Courier Issue</option>
                  <option value="sizing">Sizing & Fit Advice</option>
                  <option value="custom_design">Custom 3D Artwork Assistance</option>
                  <option value="payment">Payment Verification</option>
                  <option value="return_refund">Return or Exchange Request</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Inquiring on delivery date for order FITXXX-1001"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Related Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={ticketOrder}
                  onChange={(e) => setTicketOrder(e.target.value)}
                  placeholder="e.g. FITXXX-1001"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Detailed Message / Concern
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please describe your query in detail..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold"
                >
                  {ticketSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
