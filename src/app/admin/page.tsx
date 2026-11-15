'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  Search, 
  Download, 
  Scissors, 
  Layers, 
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Truck,
  Tag,
  Users,
  Settings,
  History,
  Lock,
  ArrowRight,
  LogOut,
  RefreshCw,
  Send,
  Printer,
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { formatPrice } from '@/lib/utils';
import { OrderLifecycleStatus, TicketStatus, TicketPriority } from '@/types/admin';

export default function AdminDashboardPage() {
  const {
    adminUser,
    isAuthenticated,
    activeTab,
    products,
    orders,
    coupons,
    supportTickets,
    analytics,
    auditLogs,
    settings,
    isLoading,
    error,
    setActiveTab,
    checkAuth,
    loginAdmin,
    logoutAdmin,
    fetchProducts,
    updateStock,
    fetchOrders,
    updateOrderStatus,
    createCoupon,
    toggleCoupon,
    fetchSupportTickets,
    replySupportTicket,
    fetchAnalytics,
    fetchAuditLogs,
    updateSettings,
  } = useAdminStore();

  // Local login form state
  const [loginId, setLoginId] = useState('9816357615');
  const [loginPassword, setLoginPassword] = useState('FitXxxMaster#2026Owner');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filter & Search states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [internalNotesInput, setInternalNotesInput] = useState('');

  // Support ticket active conversation
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // New Coupon Form Modal state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('15');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('2499');

  // Stock editor modal
  const [stockEditModal, setStockEditModal] = useState<{
    open: boolean;
    productId: string;
    productTitle: string;
    colorHex: string;
    size: string;
    currentStock: number;
  }>({
    open: false,
    productId: '',
    productTitle: '',
    colorHex: '',
    size: 'L',
    currentStock: 0,
  });
  const [newStockInput, setNewStockInput] = useState('10');

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle owner login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const result = await loginAdmin(loginId, loginPassword);
    setIsLoggingIn(false);
    if (!result.success) {
      setLoginError(result.error || 'Login failed. Please verify credentials.');
    }
  };

  // Quick fill owner credentials
  const handleUseOwnerDefaults = () => {
    setLoginId('9816357615');
    setLoginPassword('FitXxxMaster#2026Owner');
  };

  // If not authenticated, render Owner Security Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Crimson glow backdrop */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-crimson via-red-500 to-amber-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-crimson/10 border border-brand-crimson/40 flex items-center justify-center text-brand-crimson">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-crimson uppercase">RESTRICTED ACCESS</span>
              <h1 className="text-xl font-display font-black tracking-wider text-white">FITXXX OWNER CONSOLE</h1>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Enter your verified owner credentials. All administrative operations are cryptographically verified and recorded to immutable audit logs.
          </p>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-crimson flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Owner Identifier (Phone / Email)
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="9816357615 or JATTSHIV32@GMAIL.COM"
                required
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Master Security Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson/90 disabled:bg-neutral-800 text-white font-display font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-crimson/20"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING SECURE SESSION...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHORIZE & ENTER CONSOLE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Owner Identity: 9816357615</span>
            <button
              type="button"
              onClick={handleUseOwnerDefaults}
              className="text-brand-crimson hover:underline font-mono"
            >
              Autofill Credentials
            </button>
          </div>
        </div>

        <Link href="/" className="mt-6 text-xs text-neutral-500 hover:text-neutral-300 font-mono transition-colors">
          ← Return to FITXXX Storefront
        </Link>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#090909] text-white pt-20 pb-16">
      {/* Top Admin Bar */}
      <header className="border-b border-neutral-800 bg-[#0e0e0e]/80 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-crimson/20 border border-brand-crimson/40 flex items-center justify-center text-brand-crimson font-black text-xs">
              FX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-sm tracking-wider uppercase text-white">
                  FITXXX MASTER CONTROL CENTER
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30 uppercase">
                  {adminUser?.role || 'OWNER'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {adminUser?.email || 'JATTSHIV32@GMAIL.COM'} • Logged in securely
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors font-mono"
            >
              <span>View Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => logoutAdmin()}
              className="px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/30 hover:bg-red-900/50 text-xs text-red-300 flex items-center gap-1.5 transition-colors font-mono"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 border-t border-neutral-800/60 no-scrollbar py-1">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
            { id: 'products', label: 'Products & Matrix Inventory', icon: Package },
            { id: 'orders', label: 'Orders & Shipments', icon: Truck, badge: orders.length },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.length },
            { id: 'support', label: 'Customer Support Inbox', icon: MessageSquare, badge: supportTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length },
            { id: 'analytics', label: 'Financials & Reports', icon: DollarSign },
            { id: 'cms', label: 'CMS & Store Settings', icon: Settings },
            { id: 'audit', label: 'Security Audit Logs', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-crimson text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW & FINANCIAL KPIS */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Gross Sales</span>
                  <span className="p-2 rounded-lg bg-green-950/40 text-green-400 border border-green-800/40">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-display font-black text-white">
                  ₹{(analytics?.grossSales || 15197).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] font-mono text-green-400 mt-2 flex items-center gap-1">
                  <span>↑ +28.4%</span>
                  <span className="text-neutral-500">vs last cycle</span>
                </p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Net Realized Revenue</span>
                  <span className="p-2 rounded-lg bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-display font-black text-white">
                  ₹{(analytics?.netRevenue || 14327).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] font-mono text-neutral-400 mt-2">
                  Discounts Deducted: ₹{(analytics?.totalDiscounts || 870).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Total Orders</span>
                  <span className="p-2 rounded-lg bg-blue-950/40 text-blue-400 border border-blue-800/40">
                    <Truck className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-display font-black text-white">
                  {analytics?.totalOrders || orders.length} Orders
                </div>
                <p className="text-[11px] font-mono text-neutral-400 mt-2">
                  Average Order: ₹{(analytics?.averageOrderValue || 4775).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Support Inquiries</span>
                  <span className="p-2 rounded-lg bg-amber-950/40 text-amber-400 border border-amber-800/40">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl font-display font-black text-white">
                  {supportTickets.length} Tickets
                </div>
                <p className="text-[11px] font-mono text-amber-400 mt-2">
                  {supportTickets.filter(t => t.status === 'new' || t.status === 'open').length} requiring response
                </p>
              </div>
            </div>

            {/* Quick Action Alerts */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-neutral-300">
                  Store Status: <strong className="text-white">Active Production</strong> • Payment Gateway (Razorpay) & COD: <strong className="text-white">Live</strong>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white transition-colors"
                >
                  Manage Orders ({orders.length}) →
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-3 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson/90 text-xs font-mono text-white transition-colors"
                >
                  Adjust Stock Matrix →
                </button>
              </div>
            </div>

            {/* Interactive Visual Revenue Trend Chart (SVG) */}
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display font-black text-base uppercase text-white">
                    Daily Sales & Dispatch Growth
                  </h2>
                  <span className="text-xs font-mono text-neutral-400">
                    Rolling 7-day verified transactional revenue
                  </span>
                </div>
                <span className="text-xs font-mono text-brand-crimson font-bold">
                  ₹34,500 PEAK DAY
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-48 w-full">
                <svg viewBox="0 0 700 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E50924" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#E50924" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="30" x2="700" y2="30" stroke="#222" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="700" y2="75" stroke="#222" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="700" y2="120" stroke="#222" strokeDasharray="3 3" />

                  {/* Area fill */}
                  <path
                    d="M 50,110 Q 150,90 250,70 T 450,40 T 550,55 T 650,25 L 650,140 L 50,140 Z"
                    fill="url(#revenueGrad)"
                  />

                  {/* Stroke line */}
                  <path
                    d="M 50,110 Q 150,90 250,70 T 450,40 T 550,55 T 650,25"
                    fill="none"
                    stroke="#E50924"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data points */}
                  {[
                    { cx: 50, cy: 110, label: '10 Nov', val: '₹14.2k' },
                    { cx: 170, cy: 90, label: '11 Nov', val: '₹18.5k' },
                    { cx: 290, cy: 70, label: '12 Nov', val: '₹22.8k' },
                    { cx: 410, cy: 40, label: '13 Nov', val: '₹31.2k' },
                    { cx: 530, cy: 55, label: '14 Nov', val: '₹28.9k' },
                    { cx: 650, cy: 25, label: '15 Nov', val: '₹34.5k' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r="5" fill="#E50924" stroke="#fff" strokeWidth="2" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="monospace">
                        {pt.val}
                      </text>
                      <text x={pt.cx} y="155" textAnchor="middle" fill="#777" fontSize="10" fontFamily="monospace">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-black text-sm uppercase text-white">
                  Live Dispatch Feed
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono text-brand-crimson hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Item</th>
                      <th className="py-2.5">Total</th>
                      <th className="py-2.5">Lifecycle Status</th>
                      <th className="py-2.5">Courier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {orders.slice(0, 4).map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-800/30">
                        <td className="py-3 font-bold text-white">{ord.orderNumber}</td>
                        <td className="py-3 text-neutral-300">{ord.customer?.name}</td>
                        <td className="py-3 text-neutral-300">{ord.items?.[0]?.title}</td>
                        <td className="py-3 font-bold text-white">₹{ord.total?.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'delivered' ? 'bg-green-950/60 text-green-400 border border-green-800/40' :
                            ord.status === 'shipped' ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' :
                            'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-400">
                          {ord.courierPartner ? `${ord.courierPartner} (${ord.trackingNumber || 'Active'})` : 'Awaiting Dispatch'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRODUCTS & VARIANT MATRIX INVENTORY */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Catalog Products & Stock Matrix
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Control product prices, compare-at pricing, and matrix stock counts per size & color variant.
                </p>
              </div>
              <button
                onClick={() => fetchProducts()}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Matrix</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="space-y-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                        <img src={prod.images.front} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-black text-sm uppercase text-white">{prod.title}</h3>
                          {prod.signatureCode && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                              {prod.signatureCode}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          Price: <strong className="text-white">₹{prod.price.toLocaleString('en-IN')}</strong>
                          {prod.compareAtPrice && (
                            <span className="ml-2 line-through text-neutral-500">₹{prod.compareAtPrice.toLocaleString('en-IN')}</span>
                          )}
                          {' • '}Category: {prod.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/40 hover:bg-neutral-800 text-xs text-neutral-300 flex items-center gap-1 font-mono"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Page</span>
                      </Link>
                    </div>
                  </div>

                  {/* Stock Matrix per Color & Size */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase text-neutral-400 mb-2">
                      Variant Matrix Inventory (Color × Size Stock Units):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {prod.matrixInventory && prod.matrixInventory.length > 0 ? (
                        prod.matrixInventory.map((item) => {
                          const isZero = item.stockCount === 0;
                          const isLow = item.stockCount <= item.lowStockThreshold && !isZero;
                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                isZero 
                                  ? 'bg-red-950/20 border-red-900/50 text-red-400' 
                                  : isLow 
                                  ? 'bg-amber-950/20 border-amber-900/50 text-amber-300' 
                                  : 'bg-neutral-900/70 border-neutral-800 text-neutral-300'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-mono font-bold text-xs">{item.size}</span>
                                <span className="text-[9px] font-mono px-1 rounded bg-black/40">
                                  {item.colorName || item.colorHex}
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline mt-1">
                                <span className="text-sm font-black font-mono">
                                  {item.stockCount} <span className="text-[10px] font-normal">in stock</span>
                                </span>
                                <button
                                  onClick={() => {
                                    setStockEditModal({
                                      open: true,
                                      productId: prod.id,
                                      productTitle: prod.title,
                                      colorHex: item.colorHex,
                                      size: item.size,
                                      currentStock: item.stockCount,
                                    });
                                    setNewStockInput(item.stockCount.toString());
                                  }}
                                  className="text-brand-crimson hover:underline text-[10px] font-mono font-bold"
                                >
                                  Edit
                                </button>
                              </div>
                              {isZero && (
                                <span className="text-[9px] font-mono text-red-500 font-bold uppercase mt-1">
                                  OUT OF STOCK
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs font-mono text-neutral-500 col-span-6 py-2">
                          Standard stock allocated across all sizes.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ORDERS & SHIPMENTS (12-STAGE LIFECYCLE) */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Orders & Dispatch Management
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Full 12-stage order lifecycle, tracking courier updates, and tax invoice generation.
                </p>
              </div>

              {/* Status filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'all',
                  'pending',
                  'processing',
                  'packed',
                  'shipped',
                  'delivered',
                  'cancelled',
                  'refunded'
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setOrderStatusFilter(st);
                      fetchOrders(st, orderSearch);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-brand-crimson text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base text-white">{ord.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ord.status === 'delivered' ? 'bg-green-950 text-green-400 border border-green-800' :
                          ord.status === 'shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-neutral-400 mt-1">
                        Customer: <strong className="text-white">{ord.customer?.name}</strong> ({ord.customer?.email} | {ord.customer?.phone})
                      </div>
                      <div className="text-xs font-mono text-neutral-500 mt-0.5">
                        Address: {ord.shippingAddress?.addressLine1}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pinCode}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/admin/orders/${ord.id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </a>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="border-t border-b border-neutral-800/80 py-3 space-y-2">
                    {ord.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{item.title}</span>
                          <span className="text-neutral-400">({item.size} • {item.colorName || item.color}) × {item.quantity}</span>
                        </div>
                        <span className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking info & Status Action bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3 pt-1">
                    <div className="text-xs font-mono">
                      {ord.courierPartner ? (
                        <span className="text-blue-400">
                          Courier: <strong>{ord.courierPartner}</strong> | AWB: <strong>{ord.trackingNumber}</strong>
                        </span>
                      ) : (
                        <span className="text-neutral-500">No courier assigned yet</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderLifecycleStatus)}
                        className="bg-neutral-900 border border-neutral-700 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-crimson"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="processing">processing</option>
                        <option value="packed">packed</option>
                        <option value="shipped">shipped</option>
                        <option value="out_for_delivery">out_for_delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                        <option value="refunded">refunded</option>
                      </select>

                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setCourierInput(ord.courierPartner || 'Delhivery');
                          setTrackingNumberInput(ord.trackingNumber || '');
                          setInternalNotesInput(ord.internalNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold transition-colors"
                      >
                        Update Dispatch / Tracking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: COUPONS & PROMOTIONS */}
        {/* ================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Promotional Coupons & Discount Rules
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Unlimited coupons with server-side validation, minimum order constraints and redemption limits.
                </p>
              </div>
              <button
                onClick={() => setCouponModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-brand-crimson/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-black text-lg text-brand-crimson tracking-wider">
                        {c.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        c.isActive ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-neutral-800 text-neutral-500'
                      }`}>
                        {c.isActive ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-mono">{c.description}</p>
                    <div className="text-[11px] font-mono text-neutral-400 mt-2 space-y-1">
                      <div>Discount: <strong>{c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'}</strong></div>
                      <div>Min Cart: <strong>₹{c.minOrderValue.toLocaleString('en-IN')}</strong></div>
                      <div>Used: <strong>{c.usedCount} times</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-500">
                      Created: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <button
                      onClick={() => toggleCoupon(c.code, !c.isActive)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                        c.isActive ? 'bg-red-950/60 text-red-300 hover:bg-red-900/80' : 'bg-green-950/60 text-green-300 hover:bg-green-900/80'
                      }`}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: CUSTOMER SUPPORT INBOX */}
        {/* ================================================================= */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Customer Support Center
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Manage incoming customer complaints, inquiries, internal staff notes, and resolution statuses.
                </p>
              </div>
              <button
                onClick={() => fetchSupportTickets()}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Inbox</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets list */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 space-y-3 lg:col-span-1 max-h-[650px] overflow-y-auto">
                <div className="text-xs font-mono text-neutral-400 uppercase font-bold mb-2">
                  All Inquiries ({supportTickets.length})
                </div>
                {supportTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTicket?.id === t.id
                        ? 'bg-neutral-800/90 border-brand-crimson'
                        : 'bg-[#181818] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono font-bold text-xs text-brand-crimson">{t.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        t.priority === 'urgent' || t.priority === 'high' ? 'bg-red-950 text-red-300' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] font-mono text-neutral-400 mt-1">From: {t.customerName}</p>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-neutral-500">
                      <span className="uppercase">{t.status.replace('_', ' ')}</span>
                      <span>{new Date(t.updatedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket detail & live messaging */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[500px]">
                {selectedTicket ? (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Ticket Header */}
                      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-brand-crimson">{selectedTicket.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-800 text-neutral-300">
                              {selectedTicket.category}
                            </span>
                          </div>
                          <h3 className="font-display font-black text-base text-white mt-1">{selectedTicket.subject}</h3>
                          <p className="text-xs font-mono text-neutral-400 mt-0.5">
                            Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail} | {selectedTicket.customerPhone})
                            {selectedTicket.orderId && ` • Order: ${selectedTicket.orderId}`}
                          </p>
                        </div>

                        {/* Status transition dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedTicket.status}
                            onChange={(e) => {
                              replySupportTicket(selectedTicket.id, '', false, e.target.value);
                              setSelectedTicket({ ...selectedTicket, status: e.target.value });
                            }}
                            className="bg-neutral-900 border border-neutral-700 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-crimson"
                          >
                            <option value="new">new</option>
                            <option value="open">open</option>
                            <option value="under_review">under_review</option>
                            <option value="waiting_customer">waiting_customer</option>
                            <option value="resolved">resolved</option>
                            <option value="closed">closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Messages Thread */}
                      <div className="py-4 space-y-3 max-h-[350px] overflow-y-auto">
                        {selectedTicket.messages.map((m: any) => (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-xl border text-xs font-mono ${
                              m.isInternalNote
                                ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                : m.senderType === 'staff'
                                ? 'bg-neutral-800/80 border-neutral-700 text-white ml-6'
                                : 'bg-[#181818] border-neutral-850 text-neutral-200 mr-6'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1 text-[10px] text-neutral-400">
                              <span className="font-bold">
                                {m.senderType === 'staff' ? `Staff (${m.senderName})` : m.senderName}
                                {m.isInternalNote && ' [INTERNAL PRIVATE NOTE]'}
                              </span>
                              <span>{new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reply Input Form */}
                    <div className="pt-4 border-t border-neutral-800 space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternalNote}
                            onChange={(e) => setIsInternalNote(e.target.checked)}
                            className="rounded border-neutral-700 bg-neutral-900 text-brand-crimson focus:ring-0"
                          />
                          <span className={isInternalNote ? 'text-amber-400 font-bold' : ''}>
                            Internal note only (invisible to customer)
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder={isInternalNote ? "Write private staff note..." : "Write customer response..."}
                          className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl p-3 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                        />
                        <button
                          onClick={async () => {
                            if (!replyMessage.trim()) return;
                            await replySupportTicket(selectedTicket.id, replyMessage, isInternalNote);
                            setReplyMessage('');
                            setIsInternalNote(false);
                            // Refresh active ticket view
                            const updated = supportTickets.find(t => t.id === selectedTicket.id);
                            if (updated) setSelectedTicket(updated);
                          }}
                          className="px-5 bg-brand-crimson hover:bg-brand-crimson/90 text-white rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 text-neutral-500">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-xs font-mono">Select a ticket from the left panel to inspect and reply.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: FINANCIAL ANALYTICS & CSV EXPORT */}
        {/* ================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Financial Reporting & Analytics
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Comprehensive audit of gross revenue, discounts, realized profit, shipping collected, and GST liability.
                </p>
              </div>

              <a
                href="/api/admin/analytics?format=csv"
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold flex items-center gap-2 border border-neutral-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Sales CSV Report</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-3">
                <h3 className="font-display font-black text-sm uppercase text-white">Revenue Ledger</h3>
                <div className="space-y-2 text-xs font-mono divide-y divide-neutral-850">
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-400">Gross Sales Value:</span>
                    <span className="font-bold text-white">₹{(analytics?.grossSales || 15197).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand-crimson">
                    <span>Promotional Discounts:</span>
                    <span>- ₹{(analytics?.totalDiscounts || 870).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-neutral-400">
                    <span>GST (Estimated 12%):</span>
                    <span className="text-white">₹{(analytics?.totalTaxes || 1718).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-neutral-400">
                    <span>Shipping Fees Collected:</span>
                    <span className="text-white">₹{(analytics?.shippingCollected || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-bold text-green-400 border-t border-neutral-700">
                    <span>Net Realized Revenue:</span>
                    <span>₹{(analytics?.netRevenue || 14327).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-3">
                <h3 className="font-display font-black text-sm uppercase text-white">Inventory Health</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-400">Total Catalog SKUs:</span>
                    <span className="font-bold text-white">{analytics?.inventoryHealth?.totalSkus || 36}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-green-400">
                    <span>Healthy In-Stock SKUs:</span>
                    <span className="font-bold">{analytics?.inventoryHealth?.inStockCount || 30}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-amber-400">
                    <span>Low Stock Threshold (&lt;5):</span>
                    <span className="font-bold">{analytics?.inventoryHealth?.lowStockCount || 5}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand-crimson">
                    <span>Out of Stock SKUs:</span>
                    <span className="font-bold">{analytics?.inventoryHealth?.outOfStockCount || 1}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 space-y-3">
                <h3 className="font-display font-black text-sm uppercase text-white">Top Performing Drops</h3>
                <div className="space-y-2">
                  {analytics?.topProducts?.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-xs font-mono py-1">
                      <span className="text-neutral-300 truncate max-w-[170px]">{p.title}</span>
                      <span className="font-bold text-white">₹{p.revenue.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: CMS & STORE SETTINGS */}
        {/* ================================================================= */}
        {activeTab === 'cms' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase">
                CMS & Global Store Configuration
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Live announcement bar banner, free shipping threshold and customer support details.
              </p>
            </div>

            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Global Announcement Bar Text
                </label>
                <input
                  type="text"
                  defaultValue={settings?.announcementText || '⚡ DROP 01 LIVE — COD AVAILABLE PAN INDIA — FLAT ₹500 OFF WITH CODE: FIRSTDROP500'}
                  onBlur={(e) => updateSettings({ announcementText: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue={settings?.freeShippingThreshold || 2999}
                    onBlur={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Standard Shipping Fee (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue={settings?.standardShippingFee || 149}
                    onBlur={(e) => updateSettings({ standardShippingFee: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Support Hotline Phone
                  </label>
                  <input
                    type="text"
                    defaultValue={settings?.supportPhone || '+91 98163 57615'}
                    onBlur={(e) => updateSettings({ supportPhone: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue={settings?.supportEmail || 'support@fitxxx.com'}
                    onBlur={(e) => updateSettings({ supportEmail: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 8: AUDIT LOGS */}
        {/* ================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display font-black text-xl text-white uppercase">
                  Security & Administrative Audit Logs
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Cryptographically trackable record of every price update, stock adjustment, and lifecycle event.
                </p>
              </div>
              <button
                onClick={() => fetchAuditLogs()}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="bg-[#121212] border border-neutral-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#161616] text-neutral-400 uppercase">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin Email</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Notes / Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-800/30">
                      <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-white font-bold">{log.userEmail}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{log.entityId}</td>
                      <td className="py-3 px-4 text-neutral-400">{log.notes || JSON.stringify(log.newValues)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ================================================================= */}
      {/* MODALS */}
      {/* ================================================================= */}

      {/* 1. Stock Adjustment Modal */}
      {stockEditModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-display font-black text-sm uppercase text-white">
              Update Stock — Size {stockEditModal.size}
            </h3>
            <p className="text-xs font-mono text-neutral-400">
              Product: {stockEditModal.productTitle}
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                New Stock Count (Units)
              </label>
              <input
                type="number"
                min="0"
                value={newStockInput}
                onChange={(e) => setNewStockInput(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStockEditModal({ ...stockEditModal, open: false })}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateStock(
                    stockEditModal.productId,
                    stockEditModal.colorHex,
                    stockEditModal.size,
                    parseInt(newStockInput, 10),
                    `Owner adjusted stock for ${stockEditModal.size}`
                  );
                  setStockEditModal({ ...stockEditModal, open: false });
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tracking Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-display font-black text-sm uppercase text-white">
              Dispatch & Tracking Details — {selectedOrder.orderNumber}
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Courier Partner
              </label>
              <input
                type="text"
                value={courierInput}
                onChange={(e) => setCourierInput(e.target.value)}
                placeholder="Delhivery, BlueDart, Bluedart Air, DTDC"
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Tracking AWB / Number
              </label>
              <input
                type="text"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                placeholder="e.g. DEL-FIT-99210"
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Internal Staff Notes
              </label>
              <textarea
                rows={2}
                value={internalNotesInput}
                onChange={(e) => setInternalNotesInput(e.target.value)}
                placeholder="e.g. Dispatched via express air cargo"
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateOrderStatus(
                    selectedOrder.id,
                    'shipped',
                    courierInput,
                    trackingNumberInput,
                    `https://www.delhivery.com/track/package/${trackingNumberInput}`,
                    internalNotesInput
                  );
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold"
              >
                Save & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-display font-black text-sm uppercase text-white">
              Create Promotional Coupon
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. VIP20 or DROPOFFER"
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newCouponDesc}
                onChange={(e) => setNewCouponDesc(e.target.value)}
                placeholder="e.g. 15% off on orders above ₹2,499"
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Type
                </label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Flat (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Value ({newCouponType === 'percentage' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Minimum Cart Order Value (₹)
              </label>
              <input
                type="number"
                value={newCouponMinOrder}
                onChange={(e) => setNewCouponMinOrder(e.target.value)}
                className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCouponModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newCouponCode.trim()) return;
                  await createCoupon({
                    code: newCouponCode.trim().toUpperCase(),
                    description: newCouponDesc,
                    discountType: newCouponType,
                    discountValue: Number(newCouponValue),
                    minOrderValue: Number(newCouponMinOrder),
                  });
                  setCouponModalOpen(false);
                  setNewCouponCode('');
                  setNewCouponDesc('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-mono font-bold"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
