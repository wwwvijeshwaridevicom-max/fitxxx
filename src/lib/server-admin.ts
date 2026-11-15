import crypto from 'crypto';
import { 
  AdminRole,
  AdminUser, 
  OrderLifecycleStatus, 
  MatrixInventoryItem, 
  CouponItem, 
  SupportTicket, 
  SupportMessage, 
  AuditLogEntry, 
  AdminAnalyticsSummary,
  SiteSettings 
} from '@/types/admin';
import { ALL_PRODUCTS } from '@/data/products';

// CONFIGURATION
const OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || 'JATTSHIV32@GMAIL.COM').toUpperCase();
const OWNER_PHONE = process.env.ADMIN_OWNER_PHONE || '9816357615';
const BOOTSTRAP_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'FitXxxMaster#2026Owner';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fitxxx_jwt_secret_secure_key_master_9816357615_2026';

// Rate Limiting Map (IP / identifier -> attempts, lockUntil)
const rateLimitMap = new Map<string, { attempts: number; lockUntil?: number }>();

// SECURE PASSWORD HASHING USING PBKDF2
export function hashPassword(password: string, salt = 'fitxxx_salt_2026'): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function verifyPassword(provided: string, expectedHash: string, salt = 'fitxxx_salt_2026'): boolean {
  try {
    const hash = hashPassword(provided, salt);
    const bufHash = Buffer.from(hash);
    const bufExpected = Buffer.from(expectedHash);
    if (bufHash.length !== bufExpected.length) return false;
    return crypto.timingSafeEqual(bufHash, bufExpected);
  } catch {
    return false;
  }
}

// DYNAMIC OWNER PASSWORD VERIFICATION
function checkOwnerPassword(providedPassword: string): boolean {
  const envPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  
  if (process.env.NODE_ENV === 'production' && !envPassword) {
    console.error('CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_BOOTSTRAP_PASSWORD is not set in production!');
    return false;
  }

  const currentExpectedPassword = (envPassword || 'FitXxxMaster#2026Owner').trim();
  const currentHash = hashPassword(currentExpectedPassword);
  
  if (verifyPassword(providedPassword.trim(), currentHash)) return true;
  if (process.env.NODE_ENV !== 'production' && verifyPassword(providedPassword.trim(), hashPassword('FitXxxMaster#2026Owner'))) {
    return true;
  }
  return false;
}

// SESSION TOKEN UTILS
export function createAdminToken(user: AdminUser): string {
  return createTokenForRole(user.id, user.email, user.role);
}

export function createTokenForRole(userId: string, email: string, role: AdminRole): string {
  const payload = {
    userId,
    email,
    role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token: string): { valid: boolean; user?: { userId: string; email: string; role: AdminRole } } {
  if (!token) return { valid: false };
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };
    const [encodedPayload, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.expiresAt < Date.now()) {
      return { valid: false }; // Expired
    }
    return { valid: true, user: payload };
  } catch {
    return { valid: false };
  }
}

// UNIFIED RBAC ACCESS VERIFICATION HELPER
export function verifyAdminAccess(
  req: { cookies: { get: (name: string) => { value: string } | undefined }; headers: { get: (name: string) => string | null } },
  allowedRoles: AdminRole[]
): { authorized: boolean; user?: { userId: string; email: string; role: AdminRole }; error?: string; status: number } {
  const token = req.cookies.get('fitxxx-admin-token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return { authorized: false, error: 'Authentication required. No admin session token provided.', status: 401 };
  }

  const { valid, user } = verifyAdminToken(token);
  if (!valid || !user) {
    return { authorized: false, error: 'Invalid or expired admin session token.', status: 401 };
  }

  // Universal owner privileges
  if (user.role === 'OWNER') {
    return { authorized: true, user, status: 200 };
  }

  // Check RBAC permission list
  if (!allowedRoles.includes(user.role)) {
    return { 
      authorized: false, 
      error: `Access Denied: Role '${user.role}' lacks permission for this endpoint. Required roles: [${allowedRoles.join(', ')}].`, 
      status: 403 
    };
  }

  return { authorized: true, user, status: 200 };
}

// IN-MEMORY SINGLETON STORAGE FOR PERSISTENT STATE ACROSS CALLS
interface BackendStore {
  inventory: Map<string, MatrixInventoryItem>;
  coupons: Map<string, CouponItem>;
  orders: Map<string, any>;
  tickets: Map<string, SupportTicket>;
  auditLogs: AuditLogEntry[];
  settings: SiteSettings;
  ticketSequence: number;
}

// Declare global to survive hot module reload in dev mode
const globalForAdmin = global as unknown as { __fitxxx_admin_store?: BackendStore };

function initBackendStore(): BackendStore {
  const store: BackendStore = {
    inventory: new Map(),
    coupons: new Map(),
    orders: new Map(),
    tickets: new Map(),
    auditLogs: [],
    settings: {
      storeName: 'FITXXX Streetwear Official',
      supportPhone: '+91 98163 57615',
      supportEmail: 'support@fitxxx.com',
      freeShippingThreshold: 2999,
      standardShippingFee: 149,
      taxRatePercent: 12,
      announcementText: '⚡ DROP 01 LIVE — COD AVAILABLE PAN INDIA — FLAT ₹500 OFF WITH CODE: FIRSTDROP500',
      isAnnouncementActive: true,
      allowGuestCheckout: true,
      heroBannerTitle: 'DESIGN. WEAR. OWN IT.',
      heroBannerSubtitle: 'Premium Korean-inspired oversized streetwear and custom apparel.',
    },
    ticketSequence: 10001,
  };

  // Seed Matrix Inventory for All Catalog Products
  const SIZES: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  ALL_PRODUCTS.forEach(product => {
    product.colors.forEach(color => {
      SIZES.forEach(size => {
        const id = `${product.id}-${color.hex}-${size}`;
        // Realistic stock variation: XL and L have good stock, XS/XXL lower
        let initialStock = 18;
        if (size === 'XS') initialStock = 4;
        if (size === 'XXL') initialStock = 6;
        if (product.id === 'PRODUCT_006' && size === 'XXL') initialStock = 0; // Test out of stock

        store.inventory.set(id, {
          id,
          productId: product.id,
          colorHex: color.hex,
          colorName: color.name,
          size,
          stockCount: initialStock,
          reservedCount: 0,
          lowStockThreshold: 5,
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });

  // Seed Initial Strategic Coupons
  const seedCoupons: CouponItem[] = [
    {
      id: 'cpn-1',
      code: 'FIRSTDROP500',
      description: 'Flat ₹500 off on orders above ₹2,499',
      discountType: 'fixed',
      discountValue: 500,
      minOrderValue: 2499,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      maxUses: 1000,
      usedCount: 142,
      perCustomerLimit: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cpn-2',
      code: 'FITXXX10',
      description: '10% instant discount on all orders',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 1999,
      maxDiscountAmount: 1000,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      maxUses: 5000,
      usedCount: 389,
      perCustomerLimit: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cpn-3',
      code: 'FOUNDERVIP',
      description: 'Founder VIP exclusive 20% off on signature combo sets',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 4999,
      maxDiscountAmount: 2000,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      maxUses: 200,
      usedCount: 47,
      perCustomerLimit: 1,
      isActive: true,
      applicableCategories: ['combos', 'combo-sets'],
      createdAt: new Date().toISOString(),
    },
  ];
  seedCoupons.forEach(c => store.coupons.set(c.code, c));

  // Seed Production Orders across realistic lifecycle stages
  const seedOrders = [
    {
      id: 'ord-1001',
      orderNumber: 'FITXXX-1001',
      customer: { name: 'Aarav Singhania', email: 'aarav.fits@gmail.com', phone: '+91 98200 12345' },
      shippingAddress: {
        fullName: 'Aarav Singhania',
        phone: '+91 98200 12345',
        email: 'aarav.fits@gmail.com',
        addressLine1: 'Penthouse 12B, Lodha Bellissimo, Mahalaxmi',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400011',
        country: 'India',
      },
      items: [
        {
          id: 'item-101',
          productId: 'PRODUCT_005',
          title: 'BLACK DRAGON × RED FLAME COMBO SET',
          size: 'L',
          color: '#090909',
          colorName: 'Jet Black / Crimson Red',
          price: 6999,
          quantity: 1,
          image: '/Clothes images/RED COMBO DISPLAY.png',
        }
      ],
      subtotal: 6999,
      discount: 500,
      shipping: 0,
      tax: 779,
      total: 6499,
      status: 'shipped' as OrderLifecycleStatus,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      courierPartner: 'Delhivery',
      trackingNumber: 'DEL-FIT-88291039',
      trackingUrl: 'https://www.delhivery.com/track/package/DEL-FIT-88291039',
      internalNotes: 'VIP customer, prioritized air dispatch.',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-1002',
      orderNumber: 'FITXXX-1002',
      customer: { name: 'Pooja Verma', email: 'pooja.style@outlook.com', phone: '+91 97110 98765' },
      shippingAddress: {
        fullName: 'Pooja Verma',
        phone: '+91 97110 98765',
        email: 'pooja.style@outlook.com',
        addressLine1: 'Tower 4, Flat 901, DLF Phase 5',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122002',
        country: 'India',
      },
      items: [
        {
          id: 'item-102',
          productId: 'PRODUCT_006',
          title: 'ANGEL WINGS OVERSIZED SWEATSHIRT – DUSTY PINK',
          size: 'M',
          color: '#C48B9F',
          colorName: 'Dusty Rose Pink',
          price: 3699,
          quantity: 1,
          image: '/Clothes images/men model red lower side and back look.png',
        }
      ],
      subtotal: 3699,
      discount: 370,
      shipping: 0,
      tax: 399,
      total: 3329,
      status: 'processing' as OrderLifecycleStatus,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      internalNotes: 'Pink edition initial batch print verified.',
      createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-1003',
      orderNumber: 'FITXXX-1003',
      customer: { name: 'Karan Malhotra', email: 'karan.m@syndicate.in', phone: '+91 99880 44556' },
      shippingAddress: {
        fullName: 'Karan Malhotra',
        phone: '+91 99880 44556',
        email: 'karan.m@syndicate.in',
        addressLine1: 'House 88, Sector 18',
        city: 'Chandigarh',
        state: 'Punjab',
        pinCode: '160018',
        country: 'India',
      },
      items: [
        {
          id: 'item-103',
          productId: 'PRODUCT_001',
          title: 'CHOCOLATE BROWN HOODIE',
          size: 'XL',
          color: '#493024',
          colorName: 'Chocolate Brown',
          price: 4499,
          quantity: 1,
          image: '/Clothes images/Chocolate brown hoodie.png',
        }
      ],
      subtotal: 4499,
      discount: 0,
      shipping: 0,
      tax: 540,
      total: 4499,
      status: 'delivered' as OrderLifecycleStatus,
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      courierPartner: 'BlueDart',
      trackingNumber: 'BD-884920199',
      trackingUrl: 'https://www.bluedart.com/tracking/BD-884920199',
      internalNotes: 'Delivered and cash collected.',
      createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    }
  ];
  seedOrders.forEach(o => store.orders.set(o.id, o));

  // Seed Initial Support Tickets
  const ticket1Id = 'FIT-SUPPORT-10001';
  store.tickets.set(ticket1Id, {
    id: ticket1Id,
    customerName: 'Aarav Singhania',
    customerEmail: 'aarav.fits@gmail.com',
    customerPhone: '+91 98200 12345',
    orderId: 'FITXXX-1001',
    subject: 'Requesting tracking courier details for Black Dragon Combo',
    category: 'delivery',
    status: 'under_review',
    priority: 'high',
    assignedTo: 'admin-owner',
    assignedToName: 'Owner Shiv',
    messages: [
      {
        id: 'msg-1',
        ticketId: ticket1Id,
        senderType: 'customer',
        senderName: 'Aarav Singhania',
        senderEmail: 'aarav.fits@gmail.com',
        message: 'Hi FitXxx team, I ordered the Black Dragon Combo set yesterday. Could you let me know when Delhivery will deliver in Mumbai?',
        isInternalNote: false,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        ticketId: ticket1Id,
        senderType: 'staff',
        senderName: 'FITXXX Support Staff',
        message: 'Internal check: Package dispatched via Delhivery Air priority. AWB: DEL-FIT-88291039.',
        isInternalNote: true,
        createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
      {
        id: 'msg-3',
        ticketId: ticket1Id,
        senderType: 'staff',
        senderName: 'FITXXX Team',
        message: 'Hello Aarav! Your package has been dispatched via Delhivery Express Air (Tracking DEL-FIT-88291039). Expected delivery is tomorrow evening.',
        isInternalNote: false,
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  });

  // Seed Audit Logs
  store.auditLogs.push(
    {
      id: 'log-1',
      userId: 'owner-root',
      userEmail: OWNER_EMAIL,
      action: 'STOCK_UPDATE',
      entity: 'inventory',
      entityId: 'PRODUCT_005',
      oldValues: { stock: 12 },
      newValues: { stock: 36 },
      notes: 'Initial production batch arrival Black Dragon Combo',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-2',
      userId: 'owner-root',
      userEmail: OWNER_EMAIL,
      action: 'COUPON_CREATED',
      entity: 'coupon',
      entityId: 'FIRSTDROP500',
      newValues: { discount: 500, minOrder: 2499 },
      notes: 'Launch campaign coupon activated',
      createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    }
  );

  return store;
}

export const adminStore = globalForAdmin.__fitxxx_admin_store || (globalForAdmin.__fitxxx_admin_store = initBackendStore());

// AUTHENTICATION CONTROLLER
export async function authenticateAdmin(identifier: string, password: string): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
  const cleanId = identifier.trim().toUpperCase();
  const isMatch = (cleanId === OWNER_PHONE || cleanId === OWNER_EMAIL || cleanId === OWNER_EMAIL.toLowerCase());

  // Check rate limit
  const attempts = rateLimitMap.get(cleanId);
  if (attempts && attempts.lockUntil && attempts.lockUntil > Date.now()) {
    const minsLeft = Math.ceil((attempts.lockUntil - Date.now()) / 60000);
    return { success: false, error: `Too many login attempts. Locked for ${minsLeft} minutes.` };
  }

  if (!isMatch) {
    recordFailedAttempt(cleanId);
    return { success: false, error: 'Invalid admin identifier. Owner credentials required.' };
  }

  // Verify password hash
  const isValid = checkOwnerPassword(password);
  if (!isValid) {
    recordFailedAttempt(cleanId);
    return { success: false, error: 'Invalid password. Check ADMIN_BOOTSTRAP_PASSWORD.' };
  }

  // Clear rate limits on success
  rateLimitMap.delete(cleanId);

  const user: AdminUser = {
    id: 'owner-master-shiv',
    email: OWNER_EMAIL,
    phone: OWNER_PHONE,
    fullName: 'SHIV (FITXXX OWNER)',
    role: 'OWNER',
    isOwner: true,
    lastLoginAt: new Date().toISOString(),
  };

  const token = createAdminToken(user);
  return { success: true, user, token };
}

function recordFailedAttempt(id: string) {
  const current = rateLimitMap.get(id) || { attempts: 0 };
  current.attempts += 1;
  if (current.attempts >= 5) {
    current.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
  }
  rateLimitMap.set(id, current);
}

// LOG AN AUDIT ACTION
export function logAuditAction(action: AuditLogEntry['action'], entity: AuditLogEntry['entity'], entityId: string, oldValues?: any, newValues?: any, notes?: string, userEmail = OWNER_EMAIL) {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: 'owner-master-shiv',
    userEmail,
    action,
    entity,
    entityId,
    oldValues,
    newValues,
    notes,
    createdAt: new Date().toISOString(),
  };
  adminStore.auditLogs.unshift(entry);
  if (adminStore.auditLogs.length > 200) {
    adminStore.auditLogs.pop();
  }
}

// GET ANALYTICS SUMMARY
export function calculateAnalytics(): AdminAnalyticsSummary {
  const orders = Array.from(adminStore.orders.values());
  let grossSales = 0;
  let totalDiscounts = 0;
  let totalRefunds = 0;
  let totalTaxes = 0;
  let shippingCollected = 0;

  const statusBreakdown: Record<OrderLifecycleStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    packed: 0,
    shipped: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
    return_requested: 0,
    returned: 0,
    refund_processing: 0,
    refunded: 0,
  };

  orders.forEach(order => {
    grossSales += Number(order.subtotal || 0);
    totalDiscounts += Number(order.discount || 0);
    totalTaxes += Number(order.tax || 0);
    shippingCollected += Number(order.shipping || 0);
    if (order.status === 'refunded') {
      totalRefunds += Number(order.total || 0);
    }
    if (statusBreakdown[order.status as OrderLifecycleStatus] !== undefined) {
      statusBreakdown[order.status as OrderLifecycleStatus] += 1;
    }
  });

  const netRevenue = grossSales - totalDiscounts - totalRefunds;
  const averageOrderValue = orders.length > 0 ? Math.round(netRevenue / orders.length) : 0;

  // Inventory Health
  const inventoryItems = Array.from(adminStore.inventory.values());
  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  inventoryItems.forEach(item => {
    if (item.stockCount <= 0) outOfStockCount++;
    else if (item.stockCount <= item.lowStockThreshold) lowStockCount++;
    else inStockCount++;
  });

  // Top products
  const topProducts = ALL_PRODUCTS.slice(0, 4).map((p, idx) => ({
    id: p.id,
    title: p.title,
    unitsSold: 28 - idx * 6,
    revenue: (28 - idx * 6) * p.price,
    image: p.images.front,
  }));

  // Daily revenue points
  const dailyRevenue = [
    { date: '10 Nov', revenue: 14200, orders: 3 },
    { date: '11 Nov', revenue: 18500, orders: 4 },
    { date: '12 Nov', revenue: 22800, orders: 5 },
    { date: '13 Nov', revenue: 31200, orders: 7 },
    { date: '14 Nov', revenue: 28900, orders: 6 },
    { date: '15 Nov', revenue: 34500, orders: 8 },
  ];

  const monthlyRevenue = [
    { month: 'Sep', revenue: 180000, orders: 42 },
    { month: 'Oct', revenue: 295000, orders: 68 },
    { month: 'Nov', revenue: 412000, orders: 94 },
  ];

  return {
    grossSales,
    netRevenue,
    totalDiscounts,
    totalRefunds,
    totalTaxes,
    shippingCollected,
    totalOrders: orders.length,
    averageOrderValue,
    statusBreakdown,
    dailyRevenue,
    monthlyRevenue,
    topProducts,
    inventoryHealth: {
      totalSkus: inventoryItems.length,
      inStockCount,
      lowStockCount,
      outOfStockCount,
    },
  };
}


// ATOMIC INVENTORY DEDUCTION (CONCURRENT PURCHASES SAFEGUARD)
export function deductInventoryAtomic(
  items: { productId: string; colorHex?: string; size: string; quantity: number; title?: string }[],
  orderNumber?: string
): { success: boolean; error?: string; updatedItems?: MatrixInventoryItem[] } {
  // Pass 1: Verify all items have sufficient stock
  for (const item of items) {
    // If colorHex is missing, search matching variant for product and size
    let invItem: MatrixInventoryItem | undefined;
    if (item.colorHex) {
      invItem = adminStore.inventory.get(`${item.productId}-${item.colorHex}-${item.size}`);
    } else {
      for (const [key, val] of Array.from(adminStore.inventory.entries())) {
        if (val.productId === item.productId && val.size === item.size) {
          invItem = val;
          break;
        }
      }
    }

    if (invItem && invItem.stockCount < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${item.title || item.productId} (Size: ${item.size}). Requested: ${item.quantity}, Available: ${invItem.stockCount}.`,
      };
    }
  }

  // Pass 2: Deduct stock atomically
  const updated: MatrixInventoryItem[] = [];
  for (const item of items) {
    let key = item.colorHex ? `${item.productId}-${item.colorHex}-${item.size}` : '';
    let invItem = key ? adminStore.inventory.get(key) : undefined;
    if (!invItem) {
      for (const [k, val] of Array.from(adminStore.inventory.entries())) {
        if (val.productId === item.productId && val.size === item.size) {
          invItem = val;
          key = k;
          break;
        }
      }
    }

    if (invItem && key) {
      const oldStock = invItem.stockCount;
      invItem.stockCount = Math.max(0, invItem.stockCount - item.quantity);
      invItem.updatedAt = new Date().toISOString();
      adminStore.inventory.set(key, invItem);
      updated.push(invItem);

      logAuditAction(
        'STOCK_UPDATE',
        'inventory',
        `${item.productId} [${item.size}]`,
        { stock: oldStock },
        { stock: invItem.stockCount },
        `Purchased ${item.quantity} units in order ${orderNumber || 'Online Checkout'}`,
        'system-checkout'
      );
    }
  }

  return { success: true, updatedItems: updated };
}

// RECORD VERIFIED PAID ORDER
export function recordPaidOrder(orderData: {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: any;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  couponCode?: string;
}): any {
  const newOrder = {
    ...orderData,
    status: 'confirmed' as OrderLifecycleStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.orders.set(newOrder.id, newOrder);

  // Increment coupon usage count if coupon applied
  if (orderData.couponCode) {
    const coupon = adminStore.coupons.get(orderData.couponCode.toUpperCase());
    if (coupon) {
      coupon.usedCount += 1;
      adminStore.coupons.set(coupon.code, coupon);
    }
  }

  logAuditAction(
    'STATUS_CHANGE',
    'order',
    newOrder.orderNumber,
    null,
    { status: 'confirmed', total: newOrder.total },
    `New order verified & registered via ${orderData.paymentMethod}`,
    orderData.customer.email
  );

  return newOrder;
}
