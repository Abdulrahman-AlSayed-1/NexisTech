# Nexis Tech — Electronics & Hardware E-Commerce Platform

Welcome to the **Nexis Tech** e-commerce project repository. This project is built as part of the SEF Academy Frontend Training Program, consisting of two interconnected React applications communicating with a live Express/MongoDB REST API.

---

## Monorepo Structure

```text
ecommerce-project/
├── .env                   # Single shared environment file (VITE_API_URL)
├── .env.example           # Shared environment template
├── .gitignore             # Root gitignore (ignores .env, node_modules, dist)
├── package.json           # Root workspace script runner
├── README.md              # Shared project documentation
├── shared/                # Shared datasets & resources
│   └── data/
│       └── electronicsProducts.json
├── admin-dashboard/       # Enterprise Admin Control Panel (Port 5174)
│   ├── src/
│   │   ├── api/           # API service layer (auth, orders, products, carts, users, axios)
│   │   ├── components/    # Modular component library
│   │   │   ├── common/    # Reusable UI primitives (Badge, Button, Dropdown, Input, Logo, Modal, Pagination)
│   │   │   ├── layout/    # Shell components (Navbar, Sidebar, AppLayout, AuthLayout)
│   │   │   ├── dashboard/ # Executive dashboard cards (Header, KpiGrid, StatusBreakdown, TopProducts, RecentOrders, Skeletons)
│   │   │   ├── products/  # ProductCard, ProductForm, ProductDetails, ProductQuickEditModal
│   │   │   ├── orders/    # OrderDetailPanel, OrderStatusModal, etc.
│   │   │   └── carts/     # CartCard, CartStats, CartDetailModal, CartItemRow, CartFilters
│   │   ├── constants/     # Allowed categories, subcategories & catalog validation rules (categories.js)
│   │   ├── pages/         # Application page views
│   │   │   ├── auth/      # Login.jsx (with instant demo credentials fill)
│   │   │   ├── dashboard/ # DashboardOverview.jsx (Executive real-time metrics & feeds)
│   │   │   ├── products/  # Products.jsx, AddProduct.jsx, EditProduct.jsx
│   │   │   ├── orders/    # OrdersPage.jsx (Order tracking & status pipeline)
│   │   │   ├── users/     # UserList.jsx (User & administrator directory)
│   │   │   ├── carts/     # Carts.jsx (Customer carts & abandoned checkout monitor)
│   │   │   ├── settings/  # SettingsPage.jsx (Theme, currency, density, toasts, landing view)
│   │   │   └── error/     # NotFound.jsx (404 error page)
│   │   ├── routes/        # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── store/         # Redux Toolkit store & slices (auth, products, orders, carts, users, dashboard, ui)
│   │   ├── utils/         # Utility modules: formatters.js, orderNotes.js, storeCatalog.js
│   │   ├── index.css      # Tailwind v4 theme, Nexis Tech design tokens & fonts
│   │   └── main.jsx       # App entry (Redux Provider, BrowserRouter, ToastContainer)
│   └── vite.config.js     # Port 5174, @ alias, Tailwind v4
│
└── store/                 # Customer-Facing Storefront (Port 5173)
    ├── src/
    │   ├── api/           # API service layer (auth, orders, products, carts, axios)
    │   ├── components/    # Modular component library
    │   │   ├── common/    # Reusable UI primitives (Badge, Button, Counter, Dropdown, Input, Logo, Modal, OtpInput, Pagination, Rating)
    │   │   ├── layout/    # Layout shells (MainLayout, AuthLayout, Navbar, Footer)
    │   │   ├── home/      # CategorySection, FeaturedProductsSection, OrderStepsSection, SubscribeSection
    │   │   ├── auth/      # LoginForm, RegisterForm, VerifyOtpForm, ForgotPasswordForm, AuthCard
    │   │   ├── products/  # ProductCard, ProductGrid, ProductFilters, ProductSort
    │   │   ├── cart/      # CartItemRow, CartSummary, CartCouponBox
    │   │   ├── checkout/  # AddressForm, PaymentMethods, OrderSuccessCard
    │   │   ├── orders/    # OrderCard, OrderSummaryCard, OrderProgressStepper, CancelOrderModal
    │   │   ├── profile/   # PersonalInfoTab, AddressesTab, SecurityTab
    │   │   └── wishlist/  # WishlistCard
    │   ├── constants/     # Electronics categories & catalog rules (categories.js)
    │   ├── pages/         # Application page views
    │   │   ├── home/      # HomePage.jsx (Route page)
    │   │   ├── products/  # ProductsPage.jsx, ProductDetailPage.jsx
    │   │   ├── cart/      # CartPage.jsx
    │   │   ├── wishlist/  # WishlistPage.jsx
    │   │   ├── checkout/  # CheckoutPage.jsx, PaymentPage.jsx, OrderSuccessPage.jsx
    │   │   ├── orders/    # OrdersPage.jsx, OrderDetailPage.jsx
    │   │   ├── profile/   # ProfilePage.jsx
    │   │   ├── auth/      # LoginPage.jsx, RegisterPage.jsx, VerifyOtpPage.jsx, ForgotPasswordPage.jsx
    │   │   └── NotFoundPage.jsx # Standalone full-screen 404 page
    │   ├── routes/        # AppRoutes.jsx, GuestRoute.jsx, ProtectedRoute.jsx
    │   ├── store/         # Redux store & domain slices (auth, products, cart, wishlist, orders, checkout, ui)
    │   ├── utils/         # formatters.js, productUtils.js, addressManager.js
    │   ├── index.css      # Tailwind v4 theme, Nexis Tech design tokens & fonts
    │   └── main.jsx       # App entry (Redux Provider, BrowserRouter, ToastContainer)
    └── vite.config.js     # Port 5173, @ alias, Tailwind v4
```

---

## Quick Start & Development

### Prerequisites
- Node.js `v18+` (recommended: `v20+` or `v24+`)
- npm `v9+`

### Installation
Run `npm install` inside both project directories:
```bash
# In admin-dashboard
cd admin-dashboard && npm install

# In store
cd ../store && npm install
```

### Running the Development Servers

You can run both projects from the **workspace root** using shortcut scripts:

```bash
# Run Admin Dashboard (http://localhost:5174)
npm run dev:admin

# Run Customer Store (http://localhost:5173)
npm run dev:store

# Build Admin Dashboard for Production
npm run build:admin

# Build Customer Store for Production
npm run build:store
```

Or navigate to each folder directly:
```bash
# Admin Dashboard
cd admin-dashboard
npm run dev      # or npm run build

# Online Store
cd store
npm run dev      # or npm run build
```

### Dedicated Ports:
| App | Local URL | Port |
| :--- | :--- | :--- |
| **Online Store** | `http://localhost:5173` | `5173` |
| **Admin Dashboard** | `http://localhost:5174` | `5174` |

---

## Application Routes & Screens Map

### Customer Storefront (`store`)
| Path | Screen Name | Layout | Access | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Home Page** | `MainLayout` | Public | Hero banner, hardware subcategory shortcuts, featured electronics showcase, 4-step delivery pipeline, Tech Club newsletter |
| `/products` | **Shop / Catalog** | `MainLayout` | Public | Electronics isolation, subcategory pills, multi-criteria filtering (brand, price, rating, in-stock), search & pagination |
| `/products/:id` | **Product Details** | `MainLayout` | Public | Interactive multi-angle image gallery, live stock indicators, technical specs table, review submission form, instant Add-to-Cart |
| `/cart` | **Shopping Cart** | `MainLayout` | Protected | Quantity adjusters with stock clamping, coupon code engine, real-time totals (EGP) with free shipping progress bar |
| `/wishlist` | **Saved Wishlist** | `MainLayout` | Protected | Favorite electronics grid, one-click transfer to cart, instant removal |
| `/checkout` | **Shipping Checkout** | `MainLayout` | Protected | Saved address selector, new delivery address form, order delivery notes, total summary |
| `/checkout/payment`| **Payment Gateway** | `MainLayout` | Protected | Payment method selector (Cash on Delivery vs. Credit Card), order placement trigger |
| `/order-success` | **Order Success** | `MainLayout` | Protected | Live confirmation receipt, generated order reference ID, fast link to order tracking |
| `/profile` | **Profile & Security** | `MainLayout` | Protected | Profile editor (name, phone, avatar), saved delivery address manager, password update with 6-digit OTP confirmation |
| `/profile/orders` | **Order History** | `MainLayout` | Protected | Chronological order cards, slide-down line item preview drawers, status badges |
| `/profile/orders/:id`| **Order Tracking**| `MainLayout` | Protected | 5-stage fulfillment progress stepper, complete price breakdown, customer order cancellation modal |
| `/login` | **Customer Sign In** | `AuthLayout` | Guest Only | Email/password sign-in, redirect-destination memory, instant Guest Access bypass button |
| `/register` | **Registration** | `AuthLayout` | Guest Only | Account creation form with immediate transition to 6-digit OTP verification |
| `/verify-otp` | **Email Verification** | `AuthLayout` | Guest Only | 6-slot numerical OTP input (`OtpInput.jsx`), countdown resend timer |
| `/forgot-password` | **Password Recovery** | `AuthLayout` | Guest Only | 2-step password reset with OTP confirmation and auto-redirect to login |
| `*` | **404 Not Found** | Standalone | Public | Full-viewport centered layout (`h-screen overflow-hidden`), theme toggle, direct navigation links |

### Admin Control Panel (`admin-dashboard`)
| Path | Screen Name | Layout | Access | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| `/` or `/dashboard` | **Executive Overview** | `AppLayout` | Protected | 6-KPI metrics grid (Revenue, Orders, Products, Carts, Users, Avg Order), fulfillment pipeline donut, top 5 best sellers, live recent orders |
| `/products` | **Inventory Catalog** | `AppLayout` | Protected | Grid & table views, active/draft visibility tabs, multi-column search, category filters, quick edit modal |
| `/products/add` | **Add New Product** | `AppLayout` | Protected | Modular 6-component form, client-side HTML5 canvas image compression (≤500KB), Cloudinary image upload, readiness checklist |
| `/products/edit/:id`| **Edit Product** | `AppLayout` | Protected | Full product editor with pre-populated values and tag array validation |
| `/orders` | **Order Pipeline** | `AppLayout` | Protected | Store-isolated orders list, fulfillment status updater (`pending` → `delivered`), customer details drawer, persistent admin order notes |
| `/users` | **User Directory** | `AppLayout` | Protected | Customer & administrator table, role toggle actions, search by name/email, pagination |
| `/carts` | **Abandoned Carts** | `AppLayout` | Protected | Real-time customer cart monitor, abandoned cart value analytics, item drawer |
| `/settings` | **Preferences** | `AppLayout` | Protected | Theme switch (Dark Forest / Sage Mist), catalog currency selection (`EGP`, `USD`, `EUR`, `GBP`), table density, toast positioning |
| `/login` | **Admin Authentication** | `AuthLayout` | Public | Secure JWT login with validation, show/hide password, instant Quick Fill Demo Credentials |
| `*` | **404 Error Page** | `AppLayout` | Protected | Clean in-dashboard 404 message with quick return to `/dashboard` |

---

## Design System & Branding

### 1. Typography
- **Heading Font**: **Plus Jakarta Sans** (`300` - `800`) — Applied across headings, titles, and KPI counters via `font-heading`.
- **Body Font**: **Inter** (`100` - `900`) — Applied globally across body copy, tables, forms, and metadata via `--font-sans`.
- **Fallback**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

### 2. Nexis Tech Signature Palette (Tailwind CSS v4 `@theme`)
Configured dynamically in `admin-dashboard/src/index.css`:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--color-primary-dark` | `#2F4842` | Deep Pine Forest — Master buttons, active states, dark borders |
| `--color-primary-medium` | `#44635B` | Medium Sage — Subtle button hovers, badges, icon backgrounds |
| `--color-accent-gold` | `#DDA136` | Warm Gold — Revenue metrics, star ratings, primary accent highlights |
| `--color-accent-gold-hover`| `#C58C2B` | Deep Amber Gold — Interactive hover states for accent buttons |
| `--color-bg-main` | `#E1E8E6` | Sage Mist Canvas — Light mode application background |
| `--color-bg-card` | `#FFFFFF` | Pure White Surface — Light mode cards, modals, and tables |
| `--color-bg-input` | `#D5DDD9` | Input Field Tint — Form inputs and dropdown surfaces |
| `--color-text-primary` | `#2B3332` | Charcoal Primary — Primary headings, titles, and body text |
| `--color-text-secondary` | `#6B7B76` | Muted Sage Slate — Subtitles, table headers, and timestamp labels |
| `--color-dark-bg-main` | `#1D2826` | Obsidian Forest Canvas — Dark mode main application background |
| `--color-dark-bg-card` | `#253531` | Deep Emerald Card — Dark mode cards, modals, and navigation surfaces |

### 3. Reusable Vector Logo Component
Both apps include an SVG `Logo` component representing the Nexis Tech brand mark:
- Location: `src/components/common/Logo.jsx`
- **Usage Example**:
  ```jsx
  import Logo from '@/components/common/Logo';

  // Light variant (for dark backgrounds like sidebar or dark headers)
  <Logo variant="light" size="sm" />

  // Dark variant (for white backgrounds or light headers)
  <Logo variant="dark" size="md" />

  // Icon only without text
  <Logo variant="dark" size="sm" showText={false} />
  ```

### 4. Common UI Primitives (`components/common/`)
To eliminate duplicate code and enforce unified design standards across all pages, common UI primitives are centralized in both `admin-dashboard/src/components/common/` and `store/src/components/common/`:

- **`Badge.jsx`**: Semantic status pills and taxonomy tags.
  - Standardized color variants: `success`, `warning`, `danger`, `info`, `purple`, `gold`, `default`/`neutral`, and `outline`.
  - Configurable sizes (`sm`, `md`), optional pulsing dot indicators, and full dark-mode compatibility.
- **`Button.jsx`**: Universal design-system interactive button.
  - 7 stylistic variants: `primary`, `secondary`, `outline`, `gold`, `danger`, `ghost`, and `subtle`/`success`.
  - Built-in loading state with animated SVG spinner, left/right icon injection, disabled state enforcement, and size variants (`sm`, `md`, `lg`).
- **`Dropdown.jsx`**: Accessible custom select dropdown with keyboard support (`Escape`, outside-click dismiss), replacing unstylable native `<select>` elements.
- **`Modal.jsx`**: Accessible dialog overlay with backdrop blur, scroll locking, Escape key listener, and modular header, body, and action footer slots.
- **`Input.jsx`**: Standardized form inputs with floating/stacked labels, helper text, error states, and left/right Lucide icon slots.
- **`OtpInput.jsx`** *(Store)*: Accessible 6-slot numerical OTP PIN input primitive featuring auto-focus progression, backspace regression, arrow navigation, and multi-digit clipboard paste parsing.
- **`Pagination.jsx`**: Universal responsive pagination bar with active slice counters (`Showing X to Y of Z items`), boundary clamping, and sliding window page buttons.
- **`Rating.jsx`** *(Store)*: Star rating display supporting fractional values (e.g. 4.8 / 5.0), optional numeric badge, review counts, and interactive review submission mode.
- **`Counter.jsx`** *(Store)*: Micro-interaction animated number counter powered by `react-countup` with currency formatting (`EGP`, `USD`) for totals and milestones.
- **`Logo.jsx`**: Centralized SVG vector brand emblem supporting `auto`, `light`, and `dark` color adaptations.

---

## State Management (Redux Toolkit)

Both projects are wired to centralized Redux Toolkit stores wrapped at the entry point (`main.jsx`).

### `admin-dashboard/src/store/` (Production Architecture)
- **`dashboardSlice`**: 
  - **Unified Orchestrator (`fetchDashboardData`)**: Implements a **cache-first** pattern checking `getState()` to eliminate redundant network requests on route navigation.
  - **Strict Store Isolation & Single Source of Truth**: Computes real-time revenue, order fulfillment pipelines, and top-selling electronics directly from the store-scoped domain slices.
  - **Memoized Reselect Selectors**: Employs `createSelector` for zero-re-render computation of order pipelines, top sellers, customer counts, and revenues.
- **`productsSlice`**: 
  - **Single Source of Truth**: Manages inventory items, multi-criteria filters (category, brand, search query), pagination state, and CRUD operations.
  - **Memoized Catalog Stats Selector (`selectProductCatalogStats`)**: Uses `createSelector` to derive catalog totals, in-stock, out-of-stock, featured, and draft counts in a single memoized pass for `ProductStats.jsx` and `Products.jsx`.
  - **Pure Live API Catalog (Active & Draft/Inactive)**: Products (both active and draft/inactive) are retrieved directly from the live MongoDB API (`GET /products`), with zero `localStorage` mock workarounds. The client isolates draft products seamlessly by evaluating the native `isActive` boolean response property.
- **`ordersSlice`**: Customer orders list, order status filter pills, status update pipeline (`pending`, `processing`, `confirmed`, `shipped`, `delivered`, `cancelled`), and selected order inspection.
- **`cartsSlice`**: Active customer carts directory, abandoned cart analytics, and live cart contents drawer.
- **`usersSlice`**: Complete user directory, administrator vs customer role toggles, search, and pagination.
- **`uiSlice`**: Responsive sidebar state (desktop collapse & mobile drawer), dark/light theme persistence, and user preferences (`currency`, `defaultLanding`, `defaultPageSize`, `toastPosition`, `toastDuration`).
- **`authSlice`**: Admin JWT token management, automatic `localStorage` synchronization, role validation, designated admin email resilience (`admin@nexis.com`, `admin@koda.com`), and offline demo fallback.

### `store/src/store/` (Customer Store Architecture)
- **`authSlice`**: Customer authentication state (`token`, `user`, `isAuthenticated`), session restore from `localStorage`, login/register/logout actions, and role checking.
- **`productsSlice`**: Catalog products list, active filters (`category`, `priceRange`, `searchQuery`, `brand`, `sortBy`), pagination state, and featured product selectors.
  - **Memoized Category Counts Selector (`selectCategoryCounts`)**: Uses `createSelector` to compute product counts per category in a single memoized pass.
- **`cartSlice`**: Customer shopping cart management (`items`, `loading`, `error`), coupon application, and persistent local storage sync.
  - **Memoized Cart Totals Selector (`selectCartTotals`)**: Computes `itemCount`, `subtotal`, `discountAmount`, `shippingFee` (free shipping threshold over 5,000 EGP), and `finalTotal` with zero redundant re-renders.
- **`wishlistSlice`**: Saved products array, toggle actions (`addToWishlist`, `removeFromWishlist`), and memoized fast `Set`/array lookup selector (`selectWishlistIds`).
- **`ordersSlice`**: Customer order history (`myOrders`), active order tracking, and order placement status.
  - **Memoized Order Stats Selector (`selectOrderStats`)**: Computes total placed orders, delivered counts, and aggregate spend.
- **`filterSlice`**: Multi-dimensional filtering state for catalog navigation (categories, price sliders, in-stock only, ratings).
- **`uiSlice`**: Global UI preferences including theme persistence (`dark` vs `light`), search drawer state, and mobile navigation toggles.

---

## Store Architecture: Dual Layouts & Route Protection

The customer storefront (`store/`) implements a clean dual-layout separation aligned with the **SEF Academy 3.3 Screens Overview**:

### 1. Dual Layouts
- **`MainLayout`**: Standard storefront browsing shell wrapping the lightweight `Navbar` placeholder, dynamic `<Outlet />`, and production-ready `Footer`. Listens to Redux theme state (`ui.theme`) for immediate dark mode synchronization.
- **`AuthLayout`**: Isolated, centered layout designed strictly for authentication flows (`/register`, `/verify-otp`, `/login`, `/forgot-password`). It deliberately excludes store navigation and footer for distraction-free user authentication.

### 2. Route Guards
- **`GuestRoute`**: Restricts authentication screens to unauthenticated visitors. If an authenticated customer navigates to `/login` or `/register`, they are redirected directly to the home screen (`/`).
- **`ProtectedRoute`**: Restricts user account and checkout screens (`/cart`, `/wishlist`, `/checkout`, `/checkout/payment`, `/order-success`, `/profile`, `/profile/orders`, `/profile/orders/:id`). Unauthenticated users are redirected to `/login`, preserving the attempted destination in `location.state.from`.

---

## Business Logic, Utilities & Catalog Constants

Because the application communicates with a shared training backend hosting multiple projects, dedicated constants and high-performance utilities ensure **strict store isolation** and **data integrity**:

### 1. Catalog Scope & Constants (`src/constants/categories.js`)
- **`ALLOWED_CATEGORIES`**: Strictly limited to `['electronics', 'hardware']`.
- **`ALLOWED_SUBCATEGORIES`**: `laptops`, `smartphones`, `tablets`, `audio`, `gaming`, `wearables`, `cameras`, `accessories`.
- **`isElectronicsOrHardwareProduct(product)`**: Validates incoming products against official categories, subcategories, and tags to prevent cross-contamination from non-electronics records.

### 2. Store Catalog Isolation Utilities (`src/utils/storeCatalog.js`)
- **`buildStoreCatalogLookup(reduxProducts)`**: Generates high-performance `Set` lookups (`ids`, `names`) derived directly from live products in Redux state (`state.products.items`).
- **`isStoreItem(item, lookup)`**: Validates whether a line item belongs to Nexis Tech's electronics catalog.
- **`isStoreOrder(order, lookup)` & `filterStoreOrder(order, lookup)`**: Filters platform orders to isolate Nexis Tech items, recalculating store subtotal, taxes, shipping fees, and accurate gross/net revenue.
- **`isStoreCart(cart, lookup)` & `filterStoreCart(cart, lookup)`**: Filters active carts to calculate accurate abandoned cart values specifically for Nexis Tech merchandise.

### 3. Client-Side Image Compression (`src/utils/imageCompression.js`)
- **`compressImageFile(file, maxSizeKB = 500)`**: Framework-agnostic HTML5 Canvas compression pipeline that dynamically resizes high-resolution camera uploads to max 1600x1600 and compresses to JPEG (quality 0.85). Guarantees files remain below 500 KB to eliminate Vercel 4.5MB payload limit errors (`413 Payload Too Large`).

### 4. Modular Product Form Architecture (`src/components/products/form/`)
The monolithic product form was cleanly refactored from a 987-line file into a focused orchestrator (`ProductForm.jsx`) with 6 modular subcomponents:
- **`ProductGeneralInfo`**: Title, brand, short description, and rich specifications textarea.
- **`ProductMediaGallery`**: Drag-and-drop cover photo and multi-image upload grid with instant canvas compression.
- **`ProductPricingInventory`**: Base price, discount price, stock count, SKU, and barcode.
- **`ProductStatusCard`**: Real-time publish status toggle (`Active in Store` vs `Draft / Hidden`) and featured showcase switch.
- **`ProductOrganizationCard`**: Category and subcategory selectors with interactive tag management.
- **`ProductReadinessChecklist`**: Dynamic quality indicator validating complete listing readiness before publishing.
- **Multer Tag Array Guarantee**: Enforces $\ge 2$ tags during `FormData` serialization, preventing Express/Joi validator rejection caused by single-item string collapse.

### 5. Universal Formatters (`src/utils/formatters.js`)
- **`formatCurrency(amount, currency = 'USD')`**: Centralized, locale-safe currency formatting supporting `EGP`, `USD`, `EUR`, and `GBP` with graceful numeric fallbacks.
- **`formatDate(dateString, options)`**: Standardized human-readable date and time formatting across order histories, table timestamps, and user registration dates.

### 6. Multi-Key Persistent Order Notes (`src/utils/orderNotes.js`)
- **`getOrderNotes(orderId)` / `saveOrderNotes(orderId, notes)`**: High-reliability admin note persistence in `localStorage` supporting both raw MongoDB `_id` and normalized `orderId` keys for seamless order fulfillment tracking.

### 7. Store Isolation & Resilient Pagination Architecture
The admin dashboard implements a unified client-side pagination pattern across all primary catalog views (`Products.jsx`, `OrdersPage.jsx`, `carts.jsx`, `UserList.jsx`):
- **Store-Scoped Range Calculation**: Item counts and page boundaries are computed directly from the store-scoped dataset (`scopedItems.length`) rather than raw platform arrays. This prevents "ghost" empty pages (e.g. browsing to page 5 when Nexis Tech only has 2 records).
- **Boundary Clamping (`safePage`)**: Dynamic page clamping via `Math.min(currentPage, totalPages || 1)` ensures that adjusting filters or switching stores automatically clamps out-of-bounds pagination indices back to valid ranges.
- **Global Preferences Sync**: Initial rows-per-page defaults are tied directly to the Redux UI preferences slice (`defaultPageSize`), controllable via the **Settings** page (`10`, `25`, `50`, or `100` rows).

### 8. Live MongoDB Backend Seeding (Zero Local Mocks)
To ensure the dashboard is immediately vibrant, operational, and accurately displays realistic metrics before customer storefront transactions begin, the live MongoDB backend was seeded directly via the REST API:
- **Customer Accounts**: 9 distinct customer accounts registered in MongoDB with valid credentials and customer profiles.
- **Electronics Orders**: Real orders placed via `POST /orders` using live seeded electronics products (MacBook Pro 16, iPhone 18 Pro Max, Sony WH-1000XM5, Belkin charging docks, OLED monitors) with complete shipping addresses.
- **Order Lifecycle States**: Orders updated via `PATCH /orders/admin/:id/status` across varied fulfillment states (`delivered`, `shipped`, `processing`, `confirmed`, `pending`) with realistic admin operational notes.
- **Active Shopping Carts**: Customer sessions populated with electronics items via `POST /carts/items` for live abandoned cart monitoring.
- **100% Pure Live Architecture**: Zero mock data or fallback files exist in the client codebase—the admin dashboard communicates directly and strictly with the live MongoDB database.

---

## Backend API & Authentication

Both apps communicate with the SEF Academy training backend:
- **API Base URL**: `https://e-commerce-api-3wara.vercel.app`
- **Swagger Documentation**: `https://e-commerce-api-3wara.vercel.app/api-docs`
- **Environment Variable**: `VITE_API_URL` (defined in `.env`)

### Test Admin Credentials:
- **Email**: `admin@nexis.com` or `admin@koda.com`
- **Password**: `admin1212`
- *(The Admin Login screen includes an instant **Quick Fill Demo Credentials** button).*

### Test Customer Credentials:
- **Email**: `customer@koda.com`
- **Password**: `customer1212`

### Important API Technical Notes:
1. **JWT Authentication**:
   - The token is stored in `localStorage.getItem('admin_token')`.
   - `src/api/axios.js` automatically attaches `Authorization: Bearer <token>` to every request via an Axios request interceptor.
   - A response interceptor catches `401 Unauthorized` responses and cleans up credentials.
2. **Product Image Uploads (Cloudinary)**:
   - `POST /products` and `PUT /products/:id` support `multipart/form-data` with binary image files (`images`).
3. **Array Fields in FormData**:
   - When sending `tags`, append each tag individually to FormData:
     ```js
     tags.forEach(tag => formData.append('tags', tag));
     ```

---

## Electronics Reference Dataset
A catalog of **52 realistic electronics products** (MacBooks, iPhones, Sony headphones, PS5 consoles, OLED monitors, Keychron keyboards) is available for reference and sample inputs at:
- `shared/data/electronicsProducts.json`

---

## Project Status & Completed Milestones

### Admin Dashboard (`admin-dashboard`) — **100% COMPLETE & PRODUCTION-AUDITED**
- ✅ **Authentication**: Secure JWT login with validation, show/hide password, and offline demo mode.
- ✅ **Executive Dashboard Overview**: Live 6-KPI metrics grid, interactive fulfillment status breakdown, top 5 best sellers leaderboard linking to product edit forms, latest customer orders feed, and real-time live MongoDB synchronization.
- ✅ **Product Inventory**: Full catalog view (grid & table), multi-filter search (including Drafts & Inactive), high-contrast status badges, modular 6-component product form, client-side canvas image compression (≤500KB), Cloudinary image upload, and quick edit modal.
- ✅ **Order Fulfillment**: Complete order management, lifecycle status updater (`pending` → `delivered`), customer lookup, and order detail drawer.
- ✅ **User Administration**: Role assignment, active customer counts, search, and pagination.
- ✅ **Active Carts & Abandoned Checkouts**: Live customer cart tracking and items drawer.
- ✅ **Settings & Preferences**: Live theme switcher (Dark Forest & Light), catalog currency formatter (`EGP`, `USD`, `EUR`, `GBP`), table row density presets, landing page router, and notification toast positioning.
- ✅ **Engineering & Quality Assurance**: 
  - Zero hardcoded colors (strict design tokens & Tailwind v4 `@theme`).
  - Centralized UI primitive library (`Badge`, `Pagination`, `Button`, `Dropdown`, `Modal`, `Input`, `Logo`).
  - Resilient store-isolated pagination architecture with dynamic safe-page clamping.
  - Multi-key persistent admin order notes (`localStorage`).
  - 100% memoized selectors (`createSelector`).
  - Cache-first zero-latency navigation.
  - Zero lint warnings (`oxlint`).
  - Production build in <200ms (`vite build`).
  - Mobile responsive from 360px up to 4K displays.

### Customer Store (`store`) — **100% COMPLETE & PRODUCTION-AUDITED**
- ✅ **Authentication & Account Lifecycle**:
  - Secure customer registration with 6-digit verification code sent via live backend API (`POST /auth/register/verify-otp`) and countdown resend timer.
  - Two-step Forgot Password & Reset Password flow with automatic post-reset redirection.
  - Customer login with instant prefill from registration/password reset.
  - Dedicated **"Access as Guest"** bypass button with intelligent destination fallback (prevents infinite redirect loops).
  - Protected account security tab with live password change and OTP confirmation.
- ✅ **Guest User Authorization & Access Control**:
  - Full unauthenticated browsing of hardware products, categories, and technical specifications.
  - Cart and Wishlist actions gated with friendly informational toasts guiding guests to sign in.
  - Dynamic Navbar gating: automatically hides Cart, Wishlist, My Orders, and notification badges for guest users, displaying only Home, Shop, Search, Theme, and Login.
- ✅ **Interactive Navigation & Responsive Shell**:
  - Fixed, scroll-reactive Navbar (`fixed top-0 inset-x-0 z-40`) smoothly transitioning from `h-16` to `h-14` with `backdrop-blur-md`.
  - Responsive search bar (in-navbar expansion on desktop, full-width input inside mobile drawer).
  - Real-time cart item and wishlist favorite counter badges.
  - Content-sized mobile slide-down drawer with clean backdrop overlay.
  - Responsive brand logo without mobile clipping.
- ✅ **Hardware & Electronics Product Catalog**:
  - Nexis Tech electronics catalog isolation (`isElectronicsOrHardwareProduct` filter).
  - Dynamic subcategory chips (Laptops, Smartphones, Audio, Gaming, Wearables, Tablets, Cameras, Accessories) with real-time product counters.
  - Interactive multi-criteria sorting, search querying, and pagination.
  - Product detail page featuring multi-image gallery with zoom/navigation, stock indicators, specs table, and authentic customer reviews submission.
- ✅ **Shopping Cart & Checkout Pipeline**:
  - Dual-mode cart (live MongoDB sync via `/carts` + persistent local storage fallback).
  - Quantity increment/decrement with stock boundary enforcement.
  - Promo coupon redemption engine with discount deduction and free shipping thresholds (>5,000 EGP).
  - Multi-step checkout pipeline: saved customer addresses selector, custom delivery details form, payment method selector (Cash on Delivery vs. Credit Card), order notes, and order success receipt screen.
- ✅ **Order Tracking & Fulfillment**:
  - Chronological order history grouped by date with complete timestamp fallback resolution (`orderDate`, `date`, `createdAt`, `created_at`).
  - Compact order cards with interactive slide-down item drawers.
  - Order details page with 5-stage fulfillment stepper (`Pending` → `Delivered`), itemized price breakdown (subtotal, shipping, VAT, discounts, total), and customer order cancellation modal.
- ✅ **Customer Profile & Address Book**:
  - Personal information manager with username, phone, email, and avatar updates.
  - Address book manager extracting saved delivery locations from customer order history with default address selection.
  - Security tab powered by the centralized `OtpInput` primitive for verified password changes.
- ✅ **Standalone 404 Not Found Page**:
  - Independent full-screen layout (`*` route) outside `MainLayout` eliminating footer overflow.
  - Mathematically centered layout with brand logo, live theme toggle, bold 404 typography, and quick navigation links.
- ✅ **Engineering & Code Quality**:
  - Zero hardcoded colors across all views (100% Tailwind v4 `@theme` tokens and dark mode variants).
  - Centralized atomic component library in `components/common/` (`Badge`, `Button`, `Counter`, `Dropdown`, `Input`, `Logo`, `Modal`, `OtpInput`, `Pagination`, `Rating`).
  - Separation of concerns: home section components isolated in `components/home/`.
  - Redux Toolkit single source of truth with memoized selectors (`createSelector`).
  - Clean production build in <250ms (`vite build`) with 0 errors.

