# Semilia E-commerce Backend

A robust, secure, and scalable backend API for the Semilia e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Management** - CRUD operations with image uploads via Cloudinary
- **Shopping Cart** - Persistent cart with real-time updates
- **Order Management** - Complete order lifecycle management
- **Admin Dashboard** - Comprehensive admin panel with analytics
- **User Management** - Admin tools for user account management

### Security Features
- **Rate Limiting** - Prevents abuse with configurable limits
- **Input Validation** - Comprehensive validation using express-validator
- **Password Security** - bcrypt hashing with salt rounds
- **Account Lockout** - Automatic lockout after failed login attempts
- **XSS Protection** - Cross-site scripting prevention
- **CORS Configuration** - Secure cross-origin resource sharing
- **Helmet Security** - Security headers for protection

### Performance Optimizations
- **Database Indexing** - Optimized MongoDB queries
- **Pagination** - Efficient data loading
- **Image Optimization** - Cloudinary integration for image handling
- **Caching Ready** - Structure prepared for Redis caching

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd semilia-by-tgf/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/semilia
   JWT_SECRET=your_super_secret_jwt_key_here
   ADMIN_SECRET=your_admin_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific test files
npm test -- auth.test.js
npm test -- product.test.js
npm test -- admin.test.js
```

### Test Coverage
- **Authentication Tests** - Login, registration, admin creation
- **Product Tests** - CRUD operations, filtering, search
- **Cart Tests** - Add, update, remove items
- **Order Tests** - Order creation, status updates
- **Admin Tests** - Dashboard stats, user management
- **Health Tests** - API health checks

## 📚 API Documentation

Comprehensive API documentation is available in `API_DOCUMENTATION.md`. Key endpoints include:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration

### Products
- `GET /api/products` - Get products with filtering
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:productId` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders` - Get all orders (Admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users/:id/status` - Update user status

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── adminController.js # Admin functionality
│   │   ├── authController.js  # Authentication logic
│   │   ├── cartController.js  # Shopping cart logic
│   │   ├── orderController.js # Order management
│   │   ├── productController.js # Product management
│   │   ├── userController.js  # User profile management
│   │   └── uploadController.js # Image upload handling
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   └── error.js          # Error handling middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Product.js        # Product schema
│   │   ├── Order.js          # Order schema
│   │   ├── Cart.js           # Cart schema
│   │   └── Category.js       # Category schema
│   ├── routes/
│   │   ├── adminRoutes.js    # Admin routes
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── cartRoutes.js     # Cart routes
│   │   ├── orderRoutes.js    # Order routes
│   │   ├── ProductRoutes.js  # Product routes
│   │   ├── userRoutes.js     # User routes
│   │   ├── categoryRoutes.js # Category routes
│   │   └── uploadRoutes.js   # Upload routes
│   ├── tests/
│   │   ├── auth.test.js      # Authentication tests
│   │   ├── product.test.js   # Product tests
│   │   ├── cart.test.js      # Cart tests
│   │   ├── order.test.js     # Order tests
│   │   ├── admin.test.js     # Admin tests
│   │   └── health.test.js    # Health check tests
│   └── utils/
│       └── cloudinary.js     # Cloudinary configuration
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── package.json              # Dependencies and scripts
├── jest.config.js           # Jest test configuration
├── API_DOCUMENTATION.md     # Comprehensive API docs
└── README.md                # This file
```

## 🔧 Configuration

### Database
The application uses MongoDB with Mongoose ODM. Connection is configured in `src/config/db.js`.

### Security
- **JWT Secret**: Must be a strong, random string
- **Admin Secret**: Used for admin registration
- **Rate Limiting**: Configurable per endpoint
- **CORS**: Configured for frontend domain

### Cloudinary
Image uploads are handled via Cloudinary. Configure your credentials in the environment variables.

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/semilia
JWT_SECRET=your_production_jwt_secret
ADMIN_SECRET=your_production_admin_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure MongoDB Atlas or production database
- [ ] Set up Cloudinary account
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🔍 Monitoring & Logging

The application includes comprehensive logging:
- **Error Logging**: Detailed error information in development
- **Security Logging**: Authentication attempts and failures
- **Performance Logging**: Database query performance
- **Access Logging**: API endpoint access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test files for usage examples

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added comprehensive admin dashboard
- **v1.2.0** - Enhanced security features and testing
- **v1.3.0** - Performance optimizations and documentation

---

**Built with ❤️ for Semilia E-commerce Platform**
