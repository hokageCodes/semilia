const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addToCart,
  getUserCart,
  removeFromCart,
  getCartTotal, // ✅ Add this
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', protect, getUserCart);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.get('/total', protect, getCartTotal); // ✅ Proper placement

module.exports = router;
