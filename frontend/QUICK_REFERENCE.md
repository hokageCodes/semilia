# 🚀 Semilia Frontend - Quick Reference

## 📍 All Routes

### **Public Pages** (No Auth Required)
```
/ ................................. Home/Landing Page
/shop ............................. Product Listing (with filters)
/products/[slug] .................. Product Detail Page
/categories/[slug] ................ Category Page (dresses, tops, adire, men)
/search?q=query ................... Search Results
```

### **Auth Pages**
```
/login ............................ Login Page
/register ......................... Register Page
/verify-email?email=xxx ........... Email Verification Page
```

### **Cart & Checkout** (Phase 3 - Coming Soon)
```
/cart ............................. Shopping Cart
/checkout ......................... Checkout Flow
/orders/[id] ...................... Order Confirmation
```

### **User Account** (Phase 5 - Coming Soon)
```
/account/profile .................. User Profile
/account/orders ................... Order History
/account/wishlist ................. Wishlist
```

### **Admin** (Phase 6 - Coming Soon)
```
/admin/dashboard .................. Admin Dashboard
/admin/products ................... Product Management
/admin/orders ..................... Order Management
/admin/users ...................... User Management
```

---

## 🎨 Landing Page Sections (Home `/`)

1. **HeroSection** - Full-height hero with 2 CTAs
2. **FeaturesSection** - Instagram stories-style features
3. **CategoriesSection** - Asymmetric grid (4 categories)
4. **NewArrivalsSection** - Masonry layout with products
5. **AboutSection** - Brand story (2 columns)
6. **TestimonialsSection** - Customer reviews (2 columns)
7. **FAQSection** - Accordion FAQs (2 columns)
8. **NewsletterSection** - Email signup
9. **Footer** - Links and logo

---

## 🛍️ Product Features

### **Shop Page** (`/shop`)
- ✅ Grid/List view toggle
- ✅ Category filter (radio)
- ✅ Price range filter (min/max)
- ✅ Sort by: Newest, Price, Name
- ✅ Mobile filter panel
- ✅ Loading & empty states

### **Product Detail** (`/products/[slug]`)
- ✅ Image gallery (main + thumbnails)
- ✅ Size & color selectors
- ✅ Quantity selector (+/-)
- ✅ Add to Cart & Buy Now buttons
- ✅ Related products
- ✅ Breadcrumb navigation
- ✅ Stock availability
- ✅ Discount badge
- ✅ Features icons (shipping, payment, returns)

### **Category Pages** (`/categories/[slug]`)
- ✅ Hero banner with category image
- ✅ Product grid (filtered by category)
- ✅ Sort options
- ✅ Results count

### **Search** (`/search`)
- ✅ Search in navbar (dropdown)
- ✅ Search results page
- ✅ Product grid
- ✅ Empty state

---

## 🎨 Color Theme

```css
/* Primary Colors */
--black: #000000;        /* Navbar, buttons, text */
--cream: #f8eae6;        /* Page backgrounds */
--yellow: #ffcf04;       /* Accents, CTAs, hover */
--white: #FFFFFF;        /* Cards, text */

/* Grays */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

---

## 📦 Key Components

### **Layout**
- `Navbar` - Dark navbar with logo center, search, cart, auth
- `Footer` - 4-column footer with logo image

### **Sections** (Landing Page)
- `HeroSection`
- `FeaturesSection`
- `CategoriesSection`
- `NewArrivalsSection`
- `AboutSection`
- `TestimonialsSection`
- `FAQSection`
- `NewsletterSection`

### **Modals**
- `NewsletterModal` - Pops up after 45s

### **UI Components**
- `Input` - Reusable input with validation
- `Button` - Button with loading states

---

## 🔌 API Integration

### **Base URL:**
```
http://localhost:5000/api
```

### **Product Endpoints:**
```javascript
// Get all products (with filters)
GET /products?category=dresses&minPrice=1000&sortBy=price&order=asc

// Get product by slug
GET /products/slug/:slug

// Get related products
GET /products/related/:id

// Search products
GET /products?search=dress
```

### **Auth Endpoints:**
```javascript
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/resend-verification
```

---

## 🏃‍♂️ Quick Start

### **1. Install Dependencies:**
```bash
cd frontend
npm install
```

### **2. Create `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### **3. Run Dev Server:**
```bash
npm run dev
# Visit http://localhost:3000
```

### **4. Make Sure Backend is Running:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large desktops
```

### **Grid Behavior:**
- **Mobile:** 1 column
- **Tablet (sm):** 2 columns
- **Desktop (lg):** 3-4 columns

---

## 🎯 Common Tasks

### **Update Product Images:**
Place images in `/public/assets/` and reference as:
```jsx
<Image src="/assets/your-image.jpg" ... />
```

### **Add New Section to Landing Page:**
1. Create component in `components/sections/NewSection.jsx`
2. Export from `components/sections/index.js`
3. Import and add to `app/page.js`

### **Modify Colors:**
Update `tailwind.config.js`:
```javascript
colors: {
  black: '#000000',
  cream: '#f8eae6',
  yellow: '#ffcf04',
}
```

### **Add API Endpoint:**
Update `lib/api.js`:
```javascript
export const productsAPI = {
  // ... existing
  newEndpoint: async () => {
    const response = await api.get('/products/new-endpoint');
    return response.data;
  },
};
```

---

## 🐛 Troubleshooting

### **Products not loading:**
1. Check backend is running (`http://localhost:5000`)
2. Check `.env.local` has correct API URL
3. Check browser console for errors
4. Check Network tab in DevTools

### **Images not showing:**
1. Check image path (relative to `/public/`)
2. Use Next.js `<Image>` component
3. Add `unoptimized` prop if external URLs
4. Check image exists in `/public/assets/`

### **Styling not working:**
1. Restart dev server
2. Check Tailwind class names
3. Check `globals.css` is imported
4. Clear `.next` cache: `rm -rf .next`

### **Search not working:**
1. Check navbar search dropdown opens
2. Check form submission redirects to `/search?q=...`
3. Check search page renders
4. Check API endpoint returns results

---

## 📊 Phase 2 Complete! ✅

**What's Built:**
- ✅ Landing Page (9 sections)
- ✅ Product Listing (with filters)
- ✅ Product Detail (with gallery)
- ✅ Category Pages (dynamic)
- ✅ Search Results
- ✅ Navbar (with search)
- ✅ Footer (with logo)
- ✅ Newsletter Modal (45s popup)

**Next:** Phase 3 - Shopping Cart & Checkout

---

**Need Help?** Check `PHASE2_COMPLETE.md` for full documentation.

