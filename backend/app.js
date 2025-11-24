const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const errorHandler = require('./src/middleware/error');
const connectDB = require('./src/config/db');

const app = express();

// Connect to database (for Vercel serverless, connection is cached)
// This will be called on first request
if (process.env.MONGO_URI) {
  connectDB().catch(err => {
    console.error('Database connection error:', err);
  });
}

// Security middleware
app.use(helmet());
app.use(hpp());

// Rate limiting (disabled in test and development environments)
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Stricter rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
  });
  app.use('/api/auth/', authLimiter);
}

// CORS configuration
// Automatically handles local vs production based on NODE_ENV
const getFrontendUrl = () => {
  // If FRONTEND_URL is explicitly set, use it
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  
  // Otherwise, default based on environment
  if (process.env.NODE_ENV === 'production') {
    // In production, you MUST set FRONTEND_URL
    console.warn('⚠️ FRONTEND_URL not set in production! Defaulting to localhost (this will cause CORS issues)');
    return 'http://localhost:3000';
  }
  
  // Development default
  return 'http://localhost:3000';
};

app.use(cors({
  origin: getFrontendUrl(),
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory (only in development/local)
// Note: On Vercel, this won't work - use Cloudinary for all file storage
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use('/uploads', express.static('uploads'));
}

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/ProductRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/newsletter', require('./src/routes/newsletterRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.send('API is healthy 🚀');
});

// Centralized Error Handler (should be last)
app.use(errorHandler);

module.exports = app;
