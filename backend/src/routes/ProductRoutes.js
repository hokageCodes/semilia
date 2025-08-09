const express = require('express');
const multer = require('multer');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories,
  getFeaturedProducts,
  toggleFeatured,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories); 
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.patch('/:id/featured', protect, adminOnly, toggleFeatured); // Toggle featured status
router.delete('/:id', protect, adminOnly, deleteProduct);


module.exports = router;
