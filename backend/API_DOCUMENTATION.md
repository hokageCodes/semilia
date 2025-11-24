# Semilia E-commerce API Documentation

## Overview
This is a comprehensive REST API for the Semilia e-commerce platform built with Node.js, Express, and MongoDB.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Response Format
Successful responses typically follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+2348012345678",
  "address": {
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "100001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+2348012345678",
      "address": { ... }
    },
    "token": "jwt_token"
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

### Register Admin
**POST** `/auth/register-admin`

Register a new admin account (requires admin secret).

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "adminSecret": "your_admin_secret"
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Get paginated list of products with filtering options.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `keyword` (string): Search term
- `category` (string): Filter by subcategory
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `rating` (number): Minimum rating filter
- `featured` (boolean): Filter featured products
- `sort` (string): Sort option (price-asc, price-desc, top-rated, featured)

**Response:**
```json
{
  "total": 50,
  "page": 1,
  "pages": 5,
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 2500,
      "countInStock": 10,
      "brand": "Brand Name",
      "category": {
        "main": "Women",
        "sub": "Dresses"
      },
      "rating": 4.5,
      "numReviews": 10,
      "isFeatured": true,
      "mainImage": "image_url",
      "images": [
        {
          "url": "image_url",
          "public_id": "cloudinary_id"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Featured Products
**GET** `/products/featured`

Get featured products.

**Query Parameters:**
- `limit` (number): Number of products to return (default: 8)

### Get Single Product
**GET** `/products/:id`

Get detailed information about a specific product.

### Get Product Categories
**GET** `/products/categories`

Get all available product categories.

### Create Product (Admin Only)
**POST** `/products`

Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 2500,
  "countInStock": 10,
  "brand": "Brand Name",
  "category": "{\"main\":\"Women\",\"sub\":\"Dresses\"}",
  "isFeatured": "true"
}
```

**Note:** Images should be uploaded as multipart/form-data with the field name `images`.

### Update Product (Admin Only)
**PUT** `/products/:id`

Update an existing product.

### Toggle Featured Status (Admin Only)
**PATCH** `/products/:id/featured`

Toggle the featured status of a product.

### Delete Product (Admin Only)
**DELETE** `/products/:id`

Delete a product.

### Add Product Review
**POST** `/products/:id/reviews`

Add a review to a product.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

---

## Cart Endpoints

### Get User Cart
**GET** `/cart`

Get the current user's cart.

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 2500,
        "mainImage": "image_url"
      },
      "quantity": 2,
      "addedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPrice": 5000,
  "totalItems": 2,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Add Item to Cart
**POST** `/cart`

Add a product to the cart.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

### Update Cart Item Quantity
**PATCH** `/cart/:productId`

Update the quantity of an item in the cart.

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
**DELETE** `/cart/:productId`

Remove an item from the cart.

### Clear Cart
**DELETE** `/cart/clear`

Remove all items from the cart.

### Get Cart Summary
**GET** `/cart/summary`

Get cart summary (total items and price).

---

## Order Endpoints

### Create Order
**POST** `/orders`

Create a new order.

**Request Body:**
```json
{
  "orderItems": [
    {
      "name": "Product Name",
      "qty": 2,
      "image": "image_url",
      "price": 2500,
      "product": "product_id"
    }
  ],
  "shippingInfo": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "100001",
    "phone": "+2348012345678"
  },
  "paymentMethod": "Cash on Delivery",
  "taxPrice": 0,
  "shippingPrice": 0
}
```

### Get User Orders
**GET** `/orders/my`

Get the current user's orders.

### Get All Orders (Admin Only)
**GET** `/orders`

Get all orders in the system.

### Mark Order as Paid
**PUT** `/orders/:id/pay`

Mark an order as paid.

**Request Body:**
```json
{
  "id": "payment_id",
  "status": "completed",
  "update_time": "2024-01-01T00:00:00.000Z",
  "email_address": "customer@example.com"
}
```

### Delete Order (Admin Only)
**DELETE** `/orders/:id`

Delete an order.

---

## User Endpoints

### Get User Profile
**GET** `/users/profile`

Get the current user's profile.

### Update User Profile
**PUT** `/users/profile`

Update the current user's profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+2348012345678",
  "address": {
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "100001"
  }
}
```

---

## Admin Endpoints

### Get Admin Dashboard Stats
**GET** `/admin/stats`

Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 100,
      "activeUsers": 95,
      "totalOrders": 250,
      "totalProducts": 50,
      "totalRevenue": 125000,
      "paidOrders": 200,
      "deliveredOrders": 180,
      "conversionRate": 25
    },
    "monthlySales": [
      {
        "month": "Jan 2024",
        "total": 15000,
        "count": 25
      }
    ],
    "topCustomers": [
      {
        "_id": "user_id",
        "totalSpent": 5000,
        "orderCount": 5,
        "name": "Customer Name",
        "email": "customer@example.com",
        "lastLogin": "2024-01-01T00:00:00.000Z"
      }
    ],
    "categoryStats": [
      {
        "_id": "Women",
        "count": 30,
        "totalValue": 75000
      }
    ],
    "recentOrders": [...],
    "recentUsers": [...],
    "lowStockProducts": [...],
    "alerts": {
      "lowStockCount": 5,
      "pendingOrders": 10,
      "inactiveUsers": 5
    }
  }
}
```

### Get All Users (Admin Only)
**GET** `/admin/users`

Get paginated list of users with filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `role` (string): Filter by role
- `isActive` (boolean): Filter by active status

### Update User Status (Admin Only)
**PATCH** `/admin/users/:id/status`

Update user status or role.

**Request Body:**
```json
{
  "isActive": false,
  "role": "banned"
}
```

---

## Category Endpoints

### Get All Categories
**GET** `/categories`

Get all product categories.

### Create Category
**POST** `/categories`

Create a new category.

**Request Body:**
```json
{
  "main": "Women",
  "image": "category_image_url",
  "subcategories": [
    {
      "name": "Dresses",
      "image": "subcategory_image_url"
    }
  ]
}
```

### Update Category
**PUT** `/categories/:id`

Update a category.

### Delete Category
**DELETE** `/categories/:id`

Delete a category.

---

## Upload Endpoints

### Upload Images
**POST** `/upload`

Upload images to Cloudinary.

**Request:** Multipart form data with field name `images`

**Response:**
```json
{
  "images": [
    "https://cloudinary_url_1",
    "https://cloudinary_url_2"
  ]
}
```

---

## Health Check

### API Health
**GET** `/health`

Check if the API is running.

**Response:**
```
API is healthy 🚀
```

---

## Error Codes

- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `423` - Locked (account temporarily locked)
- `500` - Internal Server Error

---

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- XSS protection
- CORS configuration
- Helmet security headers
- Account lockout after failed login attempts

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/semilia
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

---

## Testing

Run tests with:
```bash
npm test
```

Test files:
- `auth.test.js` - Authentication tests
- `product.test.js` - Product management tests
- `cart.test.js` - Shopping cart tests
- `order.test.js` - Order management tests
- `admin.test.js` - Admin functionality tests
- `health.test.js` - Health check tests
