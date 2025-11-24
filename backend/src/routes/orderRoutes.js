const express = require('express');
const {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getAllOrders,
  markOrderAsPaid,
  deleteOrder,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  confirmPayment,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Order creation (supports both authenticated and guest users)
router.post('/', optionalAuth, createOrder);

// Guest order creation (explicit route for clarity)
router.post('/guest', createGuestOrder);

// Public order tracking by order number
router.get('/track/:orderNumber', trackOrder);

// Get order by ID (for guest order tracking)
router.get('/:id', getOrderById);

// Authenticated user routes
router.get('/my', protect, getMyOrders);
router.put('/:id/pay', protect, markOrderAsPaid);

// Admin-only
router.get('/all', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/confirm-payment', protect, adminOnly, confirmPayment);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
