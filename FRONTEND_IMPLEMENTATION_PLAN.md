# Semilia Frontend Implementation Plan

## ✅ Backend Confirmation

**GUEST SHOPPING ENABLED** ✅
- Guest users can browse all products
- Guest users can checkout WITHOUT creating an account
- Guest users get order confirmation with order ID for tracking
- Registered users get additional benefits (order history, saved addresses, etc.)

---

## 🎯 Frontend Implementation Strategy

We'll build the frontend in **phases**, testing each phase thoroughly before moving to the next.

---

## 📋 Phase 1: Authentication System (START HERE)

### Components to Build:
1. **Login Page** (`/login`)
   - Email & password fields
   - Remember me checkbox
   - Forgot password link (UI only for now)
   - Link to registration
   - Error handling & validation
   - Loading states

2. **Registration Page** (`/register`)
   - Name, email, password, confirm password
   - Phone number (optional)
   - Terms & conditions checkbox
   - Link to login
   - Validation & error handling
   - Success message → auto redirect to dashboard

3. **Auth Context/Provider**
   - Store user data & token
   - Handle login/logout/register
   - Persist auth state (localStorage/cookies)
   - Auto-logout on token expiry
   - Protected route wrapper

4. **API Integration**
   - `/api/auth/login` - POST
   - `/api/auth/register` - POST
   - Token management (Bearer token in headers)

### Features:
- ✅ Form validation (client-side)
- ✅ Password strength indicator
- ✅ Error messages from backend
- ✅ Success notifications
- ✅ Loading spinners
- ✅ Redirect after login/register
- ✅ Remember me functionality
- ✅ Auto-fill suggestions

### Success Criteria:
- [ ] User can register successfully
- [ ] User can login successfully
- [ ] Token is stored and persists on refresh
- [ ] User can logout
- [ ] Protected routes work correctly
- [ ] Error messages display properly

---

## 📋 Phase 2: Product Display & Discovery

### Components to Build:
1. **Home Page** (`/`)
   - Hero section
   - Featured products carousel
   - Category cards (Women, Men)
   - Best sellers section
   - New arrivals section
   - Sale/Deals section
   - Newsletter signup
   - Footer

2. **Product Listing Page** (`/shop` or `/products`)
   - Product grid/list view toggle
   - Sidebar filters:
     - Category (Women/Men → Dresses/Tops/Pants)
     - Price range slider
     - Size filter
     - Color filter (if applicable)
     - Rating filter
   - Sort options:
     - Newest first
     - Price: Low to High
     - Price: High to Low
     - Top rated
     - Best selling
   - Pagination
   - Products per page selector
   - Search bar
   - Filter tags (showing active filters)
   - Clear all filters button

3. **Product Detail Page** (`/products/:slug` or `/products/:id`)
   - Image gallery (main image + thumbnails)
   - Product name, brand, price
   - Discount badge (if applicable)
   - Stock status
   - Size selector (if variants exist)
   - Color selector (if variants exist)
   - Quantity selector
   - Add to cart button
   - Add to wishlist button (optional)
   - Product description (tabs or accordion)
   - Product specifications
   - Size guide
   - Shipping info
   - Return policy
   - Related products section
   - Customer reviews section
   - Breadcrumbs
   - Social share buttons

4. **Category Pages** (`/women`, `/men`)
   - Category banner
   - Subcategory navigation
   - Same as product listing with pre-filtered category

5. **Search Results Page** (`/search`)
   - Search query display
   - Number of results
   - Same layout as product listing
   - Suggestions if no results

### API Integration:
- `GET /api/products` - With filters, sort, pagination
- `GET /api/products/featured`
- `GET /api/products/bestsellers`
- `GET /api/products/popular`
- `GET /api/products/sale`
- `GET /api/products/:id`
- `GET /api/products/slug/:slug`
- `GET /api/products/:id/related`
- `PATCH /api/products/:id/view` - Track views

### Success Criteria:
- [ ] All products display correctly
- [ ] Filters work properly
- [ ] Sorting works
- [ ] Pagination works
- [ ] Search functionality works
- [ ] Product details show correctly
- [ ] Images load and gallery works
- [ ] Related products display
- [ ] Mobile responsive

---

## 📋 Phase 3: Shopping Cart & Wishlist

### Components to Build:
1. **Cart Sidebar/Dropdown**
   - Mini cart preview
   - Cart item count badge
   - Quick view of items
   - Subtotal
   - "View Cart" button
   - "Checkout" button
   - Remove item option
   - Quantity update

2. **Cart Page** (`/cart`)
   - Full cart view
   - Product image, name, price
   - Quantity controls (+/-)
   - Remove item button
   - Size/color display
   - Subtotal per item
   - Cart summary:
     - Subtotal
     - Shipping (calculated or "Free")
     - Tax (if applicable)
     - Total
   - Promo code input
   - Continue shopping button
   - Proceed to checkout button
   - Empty cart state with CTA
   - Save for later option (optional)

3. **Cart Context/Provider**
   - Add to cart
   - Update quantity
   - Remove from cart
   - Clear cart
   - Calculate totals
   - Persist cart (localStorage for guests)
   - Sync with backend for logged-in users

### API Integration (for logged-in users):
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:productId`
- `DELETE /api/cart/:productId`

### For Guest Users:
- Store cart in localStorage
- Calculate totals client-side
- Sync on login (optional)

### Success Criteria:
- [ ] Can add products to cart
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart persists on refresh (localStorage)
- [ ] Cart syncs for logged-in users
- [ ] Cart badge shows correct count
- [ ] Totals calculate correctly
- [ ] Mini cart works
- [ ] Mobile responsive

---

## 📋 Phase 4: Checkout Process

### Components to Build:
1. **Checkout Page** (`/checkout`)
   - Multi-step or single-page checkout
   - **Step 1: Shipping Information**
     - Guest email field (if not logged in)
     - Full name
     - Phone number
     - Address
     - City, State
     - Postal code
     - Country (default: Nigeria)
     - "Save address" checkbox (for logged-in users)
     - Different billing address option
   
   - **Step 2: Shipping Method**
     - Standard shipping
     - Express shipping (if applicable)
     - Pickup option (if applicable)
     - Shipping cost display
   
   - **Step 3: Payment Method**
     - Cash on Delivery
     - Card Payment (integrate payment gateway)
     - Bank Transfer
     - Paystack integration (recommended for Nigeria)
     - Flutterwave integration (alternative)
   
   - **Step 4: Review & Place Order**
     - Order summary
     - All entered information review
     - Terms & conditions checkbox
     - Place order button
     - Loading state during submission

2. **Order Confirmation Page** (`/order-confirmation/:orderId`)
   - Success message
   - Order number
   - Order details
   - Shipping details
   - Payment method
   - Estimated delivery date
   - Order tracking link
   - Continue shopping button
   - Print receipt button

3. **Order Tracking Page** (`/track-order`)
   - Order ID input (for guest users)
   - Email input (for guest users)
   - Track button
   - Order status display:
     - Pending
     - Confirmed
     - Processing
     - Shipped (with tracking number)
     - Delivered
   - Order timeline
   - Contact support button

### API Integration:
- `POST /api/orders` - Create order (works for both guest & logged-in)
- `POST /api/orders/guest` - Explicit guest checkout
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/my` - Get user orders (logged-in only)

### Payment Gateway Integration:
- **Paystack** (recommended):
  - Initialize transaction
  - Verify transaction
  - Webhook for payment confirmation
- **Flutterwave** (alternative)

### Success Criteria:
- [ ] Guest users can checkout
- [ ] Logged-in users can checkout
- [ ] Shipping form validates properly
- [ ] Payment methods work
- [ ] Order is created successfully
- [ ] Order confirmation displays
- [ ] Order tracking works
- [ ] Email notifications sent (backend task)
- [ ] Mobile responsive

---

## 📋 Phase 5: User Dashboard

### Components to Build:
1. **Dashboard Layout** (`/account`)
   - Sidebar navigation:
     - Dashboard overview
     - My Orders
     - Addresses
     - Profile
     - Wishlist (optional)
     - Logout
   - Breadcrumbs
   - Mobile menu for sidebar

2. **Dashboard Overview** (`/account/dashboard`)
   - Welcome message
   - Recent orders (3-5)
   - Order statistics
   - Quick links
   - Saved addresses count
   - Wishlist count (optional)

3. **Orders Page** (`/account/orders`)
   - Order list with filters:
     - All orders
     - Pending
     - Shipped
     - Delivered
     - Cancelled
   - Order cards showing:
     - Order number
     - Date
     - Status
     - Total
     - View details button
   - Pagination

4. **Order Details Modal/Page**
   - Full order information
   - Order timeline
   - Products ordered
   - Shipping details
   - Payment details
   - Download invoice
   - Track order button
   - Cancel order (if pending)
   - Return request (if delivered)

5. **Profile Page** (`/account/profile`)
   - Edit personal information:
     - Name
     - Email (with verification)
     - Phone
     - Password change
   - Avatar upload
   - Preferences:
     - Newsletter subscription
     - Notifications
     - Language
     - Currency

6. **Addresses Page** (`/account/addresses`)
   - List of saved addresses
   - Add new address
   - Edit address
   - Delete address
   - Set default address
   - Address validation

### API Integration:
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/orders/my`
- `GET /api/orders/:id`

### Success Criteria:
- [ ] Dashboard displays user info
- [ ] Orders list shows correctly
- [ ] Can view order details
- [ ] Can update profile
- [ ] Can manage addresses
- [ ] Mobile responsive

---

## 📋 Phase 6: Admin Panel

### Components to Build:
1. **Admin Layout** (`/admin`)
   - Sidebar with navigation
   - Top bar with user menu
   - Logout
   - Dashboard stats cards
   - Charts and graphs

2. **Admin Dashboard** (`/admin/dashboard`)
   - Key metrics:
     - Total revenue
     - Total orders (today, this week, this month)
     - Total products
     - Total users
     - Conversion rate
   - Recent orders table
   - Low stock alerts
   - Top selling products
   - Revenue chart (monthly)
   - Sales by category

3. **Products Management** (`/admin/products`)
   - Products table with:
     - Image thumbnail
     - Name
     - Category
     - Price
     - Stock
     - Status
     - Actions (edit, delete, toggle featured)
   - Add new product button
   - Filters and search
   - Bulk actions
   - Export to CSV

4. **Add/Edit Product** (`/admin/products/new`, `/admin/products/:id/edit`)
   - Product form:
     - Name, description
     - Category selection
     - Price, discount
     - Stock quantity
     - Images upload (multiple)
     - Variants (sizes, colors)
     - SEO fields
     - Status (active/draft/archived)
     - Featured checkbox
     - Tags input
   - Image preview and reorder
   - Save as draft option
   - Rich text editor for description

5. **Orders Management** (`/admin/orders`)
   - Orders table with:
     - Order number
     - Customer name
     - Date
     - Total
     - Payment status
     - Order status
     - Actions
   - Advanced filters:
     - Date range
     - Status
     - Payment method
     - Customer search
   - Bulk actions (mark as shipped, etc.)
   - Export orders

6. **Order Details** (`/admin/orders/:id`)
   - Full order information
   - Update order status dropdown
   - Add tracking number
   - Admin notes textarea
   - Email customer button
   - Print invoice
   - Refund option

7. **Users Management** (`/admin/users`)
   - Users table with:
     - Name, email
     - Role
     - Status (active/inactive)
     - Total orders
     - Total spent
     - Join date
     - Actions
   - Filters and search
   - Change user role
   - Activate/deactivate users

8. **Analytics** (`/admin/analytics`)
   - Sales reports
   - Product performance
   - Customer analytics
   - Traffic sources (if Google Analytics integrated)
   - Custom date range selector
   - Export reports

### API Integration:
- `GET /api/admin/stats`
- `GET /api/admin/products`
- `POST /api/products` (create)
- `PUT /api/products/:id` (update)
- `DELETE /api/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`

### Success Criteria:
- [ ] Admin can login
- [ ] Dashboard shows statistics
- [ ] Can manage products (CRUD)
- [ ] Can upload product images
- [ ] Can manage orders
- [ ] Can update order status
- [ ] Can manage users
- [ ] Analytics display correctly
- [ ] Responsive admin panel

---

## 🎨 Design System & Shared Components

### Global Components:
1. **Layout Components**
   - Header/Navbar
   - Footer
   - Sidebar
   - Container/Wrapper

2. **Navigation**
   - Main navigation
   - Category mega menu
   - Breadcrumbs
   - Mobile menu
   - Search bar

3. **UI Components**
   - Buttons (primary, secondary, outline, link)
   - Input fields (text, email, password, number, textarea)
   - Select dropdowns
   - Checkboxes & radios
   - Toggle switches
   - Sliders (for price range)
   - Modals/Dialogs
   - Tooltips
   - Badges
   - Pills/Tags
   - Cards
   - Tabs
   - Accordion
   - Alert/Notification messages
   - Loading spinners
   - Skeleton screens
   - Pagination
   - Breadcrumbs

4. **Product Components**
   - Product card (grid view)
   - Product card (list view)
   - Product quick view modal
   - Image gallery/lightbox
   - Rating stars display
   - Price display (with discount)
   - Stock indicator
   - Add to cart button
   - Wishlist button

5. **Form Components**
   - Form wrapper with validation
   - Input with label & error
   - Select with validation
   - Checkbox group
   - Radio group
   - File upload with preview
   - Form submit button

---

## 🛠️ Tech Stack Recommendation

### Core:
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: 
  - React Context API (auth, cart)
  - OR Zustand (simpler alternative)
- **Form Handling**: React Hook Form + Zod (validation)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React or Heroicons
- **Date Handling**: date-fns

### Optional/Advanced:
- **Animation**: Framer Motion
- **Charts**: Recharts or Chart.js
- **Rich Text Editor**: Tiptap or Quill
- **Image Upload**: React Dropzone
- **Payment**: Paystack React SDK
- **Analytics**: Google Analytics 4

---

## 📁 Folder Structure

```
frontend/
├── app/
│   ├── (public)/              # Public routes
│   │   ├── page.js            # Home
│   │   ├── login/
│   │   ├── register/
│   │   ├── shop/              # Products listing
│   │   ├── products/
│   │   │   └── [id]/          # Product detail
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order-confirmation/
│   │   └── track-order/
│   │
│   ├── (authenticated)/       # Protected routes
│   │   └── account/
│   │       ├── dashboard/
│   │       ├── orders/
│   │       ├── profile/
│   │       └── addresses/
│   │
│   ├── (admin)/               # Admin routes
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── users/
│   │       └── analytics/
│   │
│   ├── layout.js              # Root layout
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   │
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   └── ...
│   │
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductFilters.jsx
│   │   ├── ProductGallery.jsx
│   │   └── ...
│   │
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSidebar.jsx
│   │   ├── CartSummary.jsx
│   │   └── ...
│   │
│   ├── checkout/
│   │   ├── CheckoutForm.jsx
│   │   ├── ShippingForm.jsx
│   │   ├── PaymentForm.jsx
│   │   └── ...
│   │
│   └── admin/
│       ├── Dashboard/
│       ├── ProductsTable.jsx
│       ├── OrdersTable.jsx
│       └── ...
│
├── contexts/
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── WishlistContext.js
│
├── lib/
│   ├── api.js                 # Axios instance & API calls
│   ├── utils.js               # Helper functions
│   └── constants.js           # Constants
│
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useProducts.js
│   └── ...
│
└── public/
    ├── images/
    └── icons/
```

---

## 🚀 Implementation Order

### Week 1: Phase 1 - Authentication ✅ (START HERE)
- Setup Next.js project
- Install dependencies
- Create basic layout
- Build auth pages (login/register)
- Implement AuthContext
- Connect to backend auth endpoints
- Test thoroughly

### Week 2: Phase 2 - Products Display
- Home page with featured products
- Products listing page with filters
- Product detail page
- Search functionality
- Test all product views

### Week 3: Phase 3 - Cart
- Cart context/state management
- Add to cart functionality
- Cart page
- Cart sidebar/mini cart
- Test cart operations

### Week 4: Phase 4 - Checkout
- Checkout page (all steps)
- Guest checkout
- Order confirmation
- Order tracking
- Payment integration
- Test complete purchase flow

### Week 5: Phase 5 - User Dashboard
- Dashboard layout
- Orders page
- Profile page
- Addresses management
- Test all user features

### Week 6: Phase 6 - Admin Panel
- Admin layout
- Dashboard with stats
- Products management
- Orders management
- Users management
- Test all admin features

### Week 7: Polish & Testing
- Mobile responsive checks
- Performance optimization
- SEO optimization
- Accessibility audit
- Bug fixes
- Final testing

---

## ✅ Ready to Start?

**Backend is confirmed with:**
- ✅ Guest checkout enabled
- ✅ All APIs working
- ✅ 58 tests passing
- ✅ Production-ready

**Next Step: Phase 1 - Authentication**

Let's build the authentication system first! 🚀

