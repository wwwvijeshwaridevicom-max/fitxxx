# FITXXX — Premium International Streetwear & 3D Custom Clothing Platform

> **DESIGN. WEAR. OWN IT.**  
> International unisex streetwear atelier engineered with 450 GSM French Terry and real-time 3D garment customization.

---

## 1. Brand Identity & Visual Language

- **Brand Name:** FitXxx
- **Positioning:** Premium unisex streetwear, Korean-inspired oversized silhouettes, custom-designed clothing, comfortable everyday wear.
- **Color Palette:**
  - **Matte Black:** `#090909`
  - **Charcoal:** `#171717`
  - **Crimson Red:** `#E50924`
  - **Warm Ivory:** `#F0E6D8`
  - **Pure White:** `#FFFFFF`
  - **Muted Grey:** `#929292`
- **Typography:** Modern, minimal, bold, editorial (`Syne`, `Inter`, `JetBrains Mono`). Full dynamic dark/light theme switching with local storage persistence.

---

## 2. Technology Stack

- **Framework:** Next.js 14+ with App Router & Server Components
- **Language:** TypeScript with strict type checking
- **Styling:** Tailwind CSS with custom FitXxx color tokens and dark mode classes
- **3D Visualization:** Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`), dynamic 2D HTML5 canvas texture baking for multi-zone UV print projection
- **State Management:** Zustand with persistent `localStorage` synchronization (`useCartStore`, `useCustomizerStore`, `useWishlistStore`, `useAuthStore`)
- **Database & Auth:** Supabase PostgreSQL schema with 19 tables, Row Level Security (RLS), and offline mock fallback
- **Payments:** Razorpay API with server-side order calculation and HMAC SHA256 signature verification (`/api/payment/create-order` & `/api/payment/verify`)
- **Deployment:** Vercel & Supabase production readiness

---

## 3. Approved Signature Silhouettes Preserved

FitXxx's 3 approved signature design concepts are preserved as the foundational core:

1. **PRODUCT 001 — CHOCOLATE BROWN HOODIE (`prod-001-chocolate-hoodie`)**
   - Chocolate brown oversized fit with 450 GSM French Terry.
   - Ivory piping across drop shoulders and outer sleeves.
   - White FitXxx embroidered chest logo.
   - Custom antique metal drawstring aglets and kangaroo pocket.
2. **PRODUCT 002 — IVORY × BROWN LOWER (`prod-002-ivory-brown-lower`)**
   - Warm ivory base in voluminous Korean balloon-leg cut.
   - Curved chocolate-brown side panels with subtle dark piping.
   - Small embroidered star emblem and heavy metal drawstring tips.
3. **PRODUCT 003 — BLACK DRAGON HOODIE (`prod-003-black-dragon-hoodie`)**
   - Jet-black brushed fleece hoodie with crimson red accents.
   - Massive metallic silver/slate dragon screen-print dominating the back.
   - Three-line manifesto typography: `DISCIPLINE / GRIND / EVOLVE`.

---

## 4. Interactive 3D Customization Studio (USP)

Accessible at `/customize` or directly from any product detail page:
- **Base Garment Silhouettes:** Oversized Hoodie, Korean Lower/Sweatpants, Heavy Boxy Tee, Crewneck Sweatshirt, Tactical Cyber Bomber Jacket.
- **Colorways:** Jet Black, Warm Ivory, Chocolate Brown, Charcoal Grey, Olive Green, Crimson Red, and Custom HEX Color Picker.
- **Print Placement Zones:** Front Chest, Large Back, Left Sleeve, Right Sleeve, Lower Leg, Front Thigh. The 3D camera rig automatically pivots to face the active print zone upon selection!
- **Categorized Vector Artwork Library (10 Categories):**
  1. Dragons & Serpents
  2. Streetwear Flames
  3. Cyber Butterflies
  4. Korean Starbursts
  5. Abstract Glitch Graphics
  6. Korean Typography (`서울`, `과부하`, `반역`, `해방`)
  7. Minimal Monograms & Barcodes
  8. Anime & Cyber Ronin Graphics
  9. Geometric Wiregrids & Cubes
  10. Manifesto Typography
- **Custom Text Engine:** Font selector (Display, Sans, Gothic, Mono, Korean), size slider, color swatch, alignment, and letter spacing.
- **Custom Image Upload:** PNG, JPG, and transparent PNG support with client-side 10MB validation.
- **Layer Transform Controls:** Scale (0.3x to 2.5x), Rotation (-180° to 180°), Position X/Y sliders, Duplicate layer, and Remove layer.
- **Undo / Redo History Stack:** Multi-step history stack for safe experimenting.
- **360° Viewing Controls:** Front, Back, Left, Right view presets, 360° auto-orbit, zoom, and high-res design preview download.

---

## 5. E-Commerce Pipeline & Payments

- **Shopping Bag:** Slide-over drawer and full cart review page with line items, quantity modifiers, and custom 3D configuration previews.
- **Promotions Engine:** Coupon code system (`FITXXX10` for 10% off, `SYNDICATE` for ₹500 off).
- **Checkout:** Indian shipping address with 6-digit PIN code validation and automatic city/state lookup.
- **Server-Side Security:** Total amount recalculated on server (`/api/payment/create-order`) — never trusts client input. HMAC SHA256 signature verification (`/api/payment/verify`) ensures no fraudulent confirmations.
- **Manufacturing Workflow:** Tracks status from `Order Received` → `Design Review` → `Approved` → `In Production` → `Quality Check` → `Shipped` → `Delivered`.

---

## 6. Admin Command Center (`/admin`)

- **Role-Based Access Control:** Secure server authorization via Next.js Edge Middleware (`src/middleware.ts`) enforcing `fitxxx-admin-session` cookies with 1-click Demo Admin toggle for evaluation.
- **Live Metrics:** Total revenue, order volume, 3D custom creation percentage, and pending artwork approvals.
- **Production Pipeline Inspector:** View and inspect customer 3D customizations, print zone coordinates, and download print packages.
- **Catalog & Artwork Management:** Inspect storefront items and sticker asset repositories.

---

## 7. API Architecture

- `POST /api/payment/create-order`: Server-side recalculation of cart totals, coupons, shipping, and GST. Returns Razorpay order details.
- `POST /api/payment/verify`: Cryptographic HMAC SHA256 signature verification preventing fraud.
- `POST /api/newsletter/subscribe`: Ingests and deduplicates emails for Syndicate drop releases.
- `POST /api/contact`: Direct concierge client inquiry submission with automatic ticket ID generation.
- `GET /api/contact`: Admin inspection endpoint for customer messages.

---

## 8. Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
