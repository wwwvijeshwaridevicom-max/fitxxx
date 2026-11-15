-- FITXXX MASTER E-COMMERCE DATABASE SCHEMA MIGRATION
-- Generated: 2026-11-15
-- System: Owner Admin Console, Matrix Inventory, Customer Support & Business Management

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('OWNER', 'ADMIN', 'SUPPORT_STAFF', 'INVENTORY_MANAGER', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. ORDER STATUS ENUM (12-Stage Lifecycle)
DO $$ BEGIN
    CREATE TYPE order_lifecycle_status AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'return_requested',
        'returned',
        'refund_processing',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. SUPPORT TICKET STATUS & PRIORITY
DO $$ BEGIN
    CREATE TYPE ticket_status_enum AS ENUM (
        'new',
        'open',
        'under_review',
        'waiting_customer',
        'resolved',
        'closed'
    );
    CREATE TYPE ticket_priority_enum AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'CUSTOMER' NOT NULL,
    is_phone_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. USER ROLES & PERMISSIONS TABLE (RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, role)
);

-- 7. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    fabric_details TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
    garment_type TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    is_published BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_bestseller BOOLEAN DEFAULT false NOT NULL,
    is_new_arrival BOOLEAN DEFAULT false NOT NULL,
    signature_code TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    view_type TEXT NOT NULL, -- 'front', 'back', 'detail', 'model', 'modelWomen', 'display', 'gallery'
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    size TEXT NOT NULL, -- 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'CUSTOM'
    sku TEXT UNIQUE,
    price_override NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. MATRIX INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    color_hex TEXT NOT NULL,
    size TEXT NOT NULL,
    stock_count INT DEFAULT 0 NOT NULL CHECK (stock_count >= 0),
    reserved_count INT DEFAULT 0 NOT NULL CHECK (reserved_count >= 0),
    low_stock_threshold INT DEFAULT 5 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(product_id, color_hex, size)
);

-- 13. INVENTORY MOVEMENTS AUDIT
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
    quantity_delta INT NOT NULL,
    reason TEXT NOT NULL, -- 'restock', 'order_reserved', 'order_fulfilled', 'damaged', 'adjustment'
    reference_id TEXT, -- order_id or batch_id
    performed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    max_discount_amount NUMERIC(10, 2),
    starts_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    max_uses INT,
    used_count INT DEFAULT 0 NOT NULL,
    per_customer_limit INT DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    applicable_categories TEXT[] DEFAULT '{}',
    applicable_products TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. COUPON REDEMPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_id TEXT NOT NULL,
    discount_applied NUMERIC(10, 2) NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status order_lifecycle_status DEFAULT 'pending' NOT NULL,
    payment_method TEXT NOT NULL, -- 'razorpay', 'cod'
    payment_status TEXT NOT NULL, -- 'pending', 'paid', 'failed', 'refunded'
    courier_partner TEXT, -- 'Delhivery', 'BlueDart', 'DTDC', 'Xpressbees', 'Bluedart Air'
    tracking_number TEXT,
    tracking_url TEXT,
    internal_notes TEXT,
    estimated_delivery DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    size TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    is_custom BOOLEAN DEFAULT false NOT NULL,
    custom_design_data JSONB,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 18. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'razorpay', 'cod'
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT NOT NULL, -- 'authorized', 'captured', 'failed', 'refunded'
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 19. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY, -- e.g. 'FIT-SUPPORT-10001'
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL, -- 'order_status', 'sizing', 'custom_design', 'payment', 'delivery', 'return_refund', 'product_defect', 'other'
    status ticket_status_enum DEFAULT 'new' NOT NULL,
    priority ticket_priority_enum DEFAULT 'normal' NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 20. SUPPORT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id TEXT REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'staff')),
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 21. CUSTOMER REVIEWS & MODERATION TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT false NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 22. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL, -- 'PRICE_CHANGE', 'STOCK_UPDATE', 'STATUS_CHANGE', 'COUPON_CREATED', 'TICKET_RESOLVED', etc.
    entity TEXT NOT NULL, -- 'product', 'inventory', 'order', 'coupon', 'ticket', 'setting'
    entity_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 23. SITE SETTINGS & CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES public.profiles(id)
);

-- 24. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_inventory_lookup ON public.inventory(product_id, color_hex, size);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON public.support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- 25. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous / Customer read access to published products
CREATE POLICY "Public read published products" ON public.products 
    FOR SELECT USING (is_published = true);

-- Public can view active coupons
CREATE POLICY "Public read active coupons" ON public.coupons 
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Customers can view their own orders
CREATE POLICY "Customers view own orders" ON public.orders 
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

-- Customers can insert their own orders
CREATE POLICY "Customers insert own orders" ON public.orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email OR customer_email IS NOT NULL);

-- Order items policies
CREATE POLICY "Customers read own order items" ON public.order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_items.order_id 
            AND (o.user_id = auth.uid() OR o.customer_email = auth.jwt() ->> 'email')
        )
    );
CREATE POLICY "Customers insert own order items" ON public.order_items 
    FOR INSERT WITH CHECK (true);

-- Customers can view their own support tickets
CREATE POLICY "Customers view own tickets" ON public.support_tickets 
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

-- Customers can create support tickets
CREATE POLICY "Customers create own tickets" ON public.support_tickets 
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email OR customer_email IS NOT NULL);

-- Customers can read non-internal support messages on their tickets
CREATE POLICY "Customers read non-internal messages" ON public.support_messages 
    FOR SELECT USING (
        is_internal_note = false AND 
        EXISTS (
            SELECT 1 FROM public.support_tickets st 
            WHERE st.id = support_messages.ticket_id 
            AND (st.user_id = auth.uid() OR st.customer_email = auth.jwt() ->> 'email')
        )
    );

-- Customers can reply to their tickets (never as internal note)
CREATE POLICY "Customers insert reply messages" ON public.support_messages 
    FOR INSERT WITH CHECK (
        is_internal_note = false AND 
        sender_type = 'customer' AND
        EXISTS (
            SELECT 1 FROM public.support_tickets st 
            WHERE st.id = support_messages.ticket_id 
            AND (st.user_id = auth.uid() OR st.customer_email = auth.jwt() ->> 'email')
        )
    );

-- Owner / Admin full access policies
CREATE POLICY "Owner/Admin full access profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN'))
);
CREATE POLICY "Owner/Admin full access products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN', 'INVENTORY_MANAGER'))
);
CREATE POLICY "Owner/Admin full access inventory" ON public.inventory FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN', 'INVENTORY_MANAGER'))
);
CREATE POLICY "Owner/Admin full access orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN', 'SUPPORT_STAFF'))
);
CREATE POLICY "Owner/Admin full access tickets" ON public.support_tickets FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN', 'SUPPORT_STAFF'))
);
CREATE POLICY "Owner/Admin full access messages" ON public.support_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN', 'SUPPORT_STAFF'))
);
CREATE POLICY "Owner/Admin full access coupons" ON public.coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN'))
);
CREATE POLICY "Owner/Admin read audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('OWNER', 'ADMIN'))
);

-- INITIAL BOOTSTRAP OWNER SEED (Safe execution with unique constraints)
INSERT INTO public.profiles (email, phone, full_name, role, is_phone_verified, is_email_verified)
VALUES (
    'JATTSHIV32@GMAIL.COM',
    '9816357615',
    'FITXXX OWNER',
    'OWNER',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET 
    phone = '9816357615',
    role = 'OWNER',
    updated_at = NOW();

-- Assign OWNER role in user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'OWNER' FROM public.profiles WHERE email = 'JATTSHIV32@GMAIL.COM'
ON CONFLICT (user_id, role) DO NOTHING;
