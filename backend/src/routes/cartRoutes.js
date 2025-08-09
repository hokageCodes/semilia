// routes/cartRoutes.js - Simplified version
const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCartSummary,
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Get user cart
router.get('/', getUserCart);

// Get cart summary (count, total)
router.get('/summary', getCartSummary);

// Add item to cart
router.post('/', addToCart);

// Update item quantity
router.patch('/:productId', updateCartItem);

// Remove item from cart
router.delete('/:productId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;