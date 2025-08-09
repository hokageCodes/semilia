const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');

router.get('/', getCategories);         // GET    /api/categories
router.post('/', createCategory);       // POST   /api/categories
router.put('/:id', updateCategory);     // PUT    /api/categories/:id
router.delete('/:id', deleteCategory);  // DELETE /api/categories/:id

module.exports = router;
