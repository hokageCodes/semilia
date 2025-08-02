const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/error');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/ProductRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.send('API is healthy 🚀');
});

// Centralized Error Handler (should be last)
app.use(errorHandler);

module.exports = app;
