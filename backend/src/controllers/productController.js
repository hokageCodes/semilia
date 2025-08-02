const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, brand, price, countInStock, category } = req.body;

    let parsedCategory;
    try {
      parsedCategory = JSON.parse(category);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid category format. Should be JSON.' });
    }

    const uploadedImages = [];

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const streamUpload = (buffer) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'products' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(buffer).pipe(stream);
          });

        const result = await streamUpload(file.buffer);
        uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const product = await Product.create({
      name,
      description,
      brand,
      price,
      countInStock,
      category: parsedCategory,
      createdBy: req.user._id,
      mainImage: uploadedImages[0]?.url || '',
      images: uploadedImages,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('[Product Create Error]', err);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// @desc    Get products with search, filters, sort, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const category = req.query.category
      ? { 'category.sub': req.query.category }
      : {};

    const priceFilter = {
      price: {
        $gte: req.query.minPrice ? Number(req.query.minPrice) : 0,
        $lte: req.query.maxPrice ? Number(req.query.maxPrice) : Infinity,
      },
    };

    const rating = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    const filters = { ...keyword, ...category, ...priceFilter, ...rating };

    let sort = { createdAt: -1 };
    const sortOption = req.query.sort?.toLowerCase();
    if (sortOption === 'price-asc') sort = { price: 1 };
    else if (sortOption === 'price-desc') sort = { price: -1 };
    else if (sortOption === 'top-rated') sort = { rating: -1 };

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters).sort(sort).skip(skip).limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), products });
  } catch (err) {
    console.error('[Get Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      category,
      countInStock,
      images
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.images = images || product.images;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('[Update Product Error]', err);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('[Delete Product Error]', err);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    console.error('[Create Review Error]', err);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};
