# FITXXX — Production Deployment & Cloud Infrastructure Guide

This guide details the steps to deploy the **FitXxx** e-commerce platform and 3D custom studio to production on **Vercel**, **Supabase**, and **Razorpay**.

---

## 1. Architecture Overview

- **Frontend & Edge API:** Next.js 14+ App Router hosted on **Vercel**
- **3D Engine:** Client-side Three.js & React Three Fiber with WebGL canvas compositing
- **Database & Auth:** **Supabase** PostgreSQL with Row Level Security (RLS)
- **Payment Processing:** **Razorpay** with HMAC SHA256 cryptographic verification
- **Asset Storage:** Supabase Storage bucket (`custom-artworks`) for high-res customer vector uploads

---

## 2. Environment Variables Configuration

Create `.env.production` or configure these environment variables in your **Vercel Project Settings > Environment Variables**:

```env
# Application URL
NEXT_PUBLIC_SITE_URL=https://fitxxx.com

# Supabase Production Backend
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your_service_role_key

# Razorpay Indian Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_key

# Admin Secret Key (Optional Server Guard)
ADMIN_SECRET_KEY=fitxxx_vault_secret_2026
```

---

## 3. Database Setup (Supabase)

1. Open your Supabase Dashboard: [https://database.new](https://database.new)
2. Navigate to the **SQL Editor**.
3. Copy and run the entire SQL migration script located at:
   `supabase/migrations/20261114_init_fitxxx_schema.sql`
4. This creates:
   - All 19 core tables (`users`, `products`, `orders`, `custom_designs`, `artworks`, etc.)
   - UUID primary keys, foreign key constraints, and performance indexes
   - Row Level Security (RLS) policies ensuring customers only read/write their own orders and designs
   - Supabase Storage bucket permissions for artwork uploads

---

## 4. Razorpay Gateway Setup

1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate API Keys in **Settings > API Keys**:
   - Save the **Key ID** to `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
   - Save the **Key Secret** to `RAZORPAY_KEY_SECRET`.
3. Set up Webhooks in **Settings > Webhooks**:
   - URL: `https://your-domain.com/api/payment/verify`
   - Active Events: `order.paid`, `payment.captured`, `payment.failed`
   - Secret: Add your secret to `RAZORPAY_WEBHOOK_SECRET`.

---

## 5. Deploying to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Link and deploy
vercel
vercel --prod
```

### Option B: Via GitHub Repository

1. Push the code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: fitxxx production release"
   git branch -M main
   git remote add origin https://github.com/your-org/fitxxx.git
   git push -u origin main
   ```
2. Import the repository in the [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Next.js**
4. Paste the Environment Variables from Section 2.
5. Click **Deploy**.

---

## 6. Verification Checklist After Deployment

- [ ] Visit `https://your-domain.com` — verify 3D mannequin spins with lighting and piping.
- [ ] Launch `/customize` — customize garment, apply a preset, select placement zone, and download high-res PNG.
- [ ] Test `/track?id=FITXXX-9921A` — verify production timeline and courier radar.
- [ ] Visit `/admin` — confirm redirection to `/?auth=admin-required` when not authenticated.
- [ ] Complete a test checkout with Razorpay test credentials — verify receipt and status advancement.
- [ ] Test PWA manifest at `/manifest.webmanifest` and dynamic icon at `/icon`.
