const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  markOrderAsPaid,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.put('/:id/pay', protect, markOrderAsPaid);

// Admin-only
router.get('/', protect, adminOnly, getAllOrders);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
