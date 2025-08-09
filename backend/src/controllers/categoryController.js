const Category = require('../models/Category');

// controllers/categoryController.js
exports.createCategory = async (req, res) => {
  try {
    const { main, image, subcategories } = req.body;

    if (!main || !Array.isArray(subcategories)) {
      return res.status(400).json({ message: 'main and subcategories[] are required' });
    }

    const category = await Category.create({ main, image, subcategories });
    res.status(201).json(category);
  } catch (err) {
    console.error('[Create Category]', err);
    res.status(500).json({ message: 'Error creating category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { main, image, subcategories } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (main) category.main = main;
    if (image) category.image = image;
    if (subcategories) category.subcategories = subcategories;

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error('[Update Category]', err);
    res.status(500).json({ message: 'Error updating category' });
  }
};
// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('[Get Categories]', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// UPDATE category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { main, subcategories } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.main = main || category.main;
    category.subcategories = subcategories || category.subcategories;

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error('[Update Category]', err);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// DELETE category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id); // Use findByIdAndDelete instead of remove()
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('[Delete Category]', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

// GET category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const Product = require('../models/Product'); // Make sure to import Product model
    
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category.main",
          totalProducts: { $sum: 1 },
          subCategories: {
            $push: "$category.sub"
          }
        }
      },
      {
        $project: {
          subCategories: {
            $reduce: {
              input: "$subCategories",
              initialValue: [],
              in: {
                $cond: [
                  { $in: ["$$this", "$$value.name"] },
                  "$$value",
                  { $concatArrays: ["$$value", [{ name: "$$this", count: 1 }]] }
                ]
              }
            }
          },
          totalProducts: 1
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    console.error("Category stats error", err);
    res.status(500).json({ message: "Server error" });
  }
};