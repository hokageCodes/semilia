const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, brand, price, countInStock, category, isFeatured } = req.body;

let parsedCategory;
try {
  parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
} catch (error) {
  return res.status(400).json({ message: 'Invalid category format. Should be JSON.' });
}

    const uploadedImages = [];

    // Only upload to Cloudinary if credentials are configured
    if (req.files?.length > 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('☁️ Cloudinary configured, uploading images...');
      console.log('🔑 Cloudinary Config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
        api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
      });
      
      // Ensure Cloudinary is properly configured before upload
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log('✅ Cloudinary config re-applied');
      } else {
        throw new Error('Cloudinary credentials incomplete');
      }
      
      console.log('📁 Files to upload:', req.files.length);
      
      try {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          console.log(`📤 Uploading file ${i + 1}/${req.files.length}: ${file.originalname} (${file.size} bytes)`);
          
          const streamUpload = (buffer) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { 
                  folder: 'products',
                  resource_type: 'image',
                  transformation: [{ quality: 'auto', fetch_format: 'auto' }]
                },
                (error, result) => {
                  if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    reject(error);
                  } else if (result) {
                    console.log('✅ Cloudinary upload success:', {
                      secure_url: result.secure_url,
                      public_id: result.public_id,
                      format: result.format,
                      width: result.width,
                      height: result.height
                    });
                    resolve(result);
                  } else {
                    reject(new Error('No result and no error from Cloudinary'));
                  }
                }
              );
              streamifier.createReadStream(buffer).pipe(stream);
            });

          const result = await streamUpload(file.buffer);
          
          if (!result || !result.secure_url) {
            throw new Error('Cloudinary upload returned invalid result');
          }
          
          uploadedImages.push({ 
            url: result.secure_url, 
            public_id: result.public_id 
          });
          console.log('✅ Image added to upload array:', result.secure_url);
        }
        console.log('✅ All images uploaded to Cloudinary successfully');
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        console.warn('⚠️ Falling back to local storage:', uploadError.message);
        // Fall back to local storage if Cloudinary fails
        const fs = require('fs');
        const path = require('path');
        
        // Create uploads directory if it doesn't exist (backend/uploads/products)
        const uploadsDir = path.join(__dirname, '../../uploads/products');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          // Sanitize filename: replace spaces with underscores and remove special characters
          const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
          const fileName = `product_${Date.now()}_${i}_${sanitizedOriginalName}`;
          const filePath = path.join(uploadsDir, fileName);
          
          // Save file to local directory
          fs.writeFileSync(filePath, file.buffer);
          
          // Use full URL for frontend access - URL encode the filename
          const encodedFileName = encodeURIComponent(fileName);
          const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/products/${encodedFileName}`;
          uploadedImages.push({ 
            url: imageUrl, 
            public_id: fileName 
          });
          console.log('💾 Image saved locally (Cloudinary fallback):', imageUrl);
          console.log('📁 File saved to:', filePath);
        }
      }
    } else if (req.files?.length > 0) {
      // No Cloudinary configured
      // On Vercel, local file storage is not available (read-only filesystem)
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return res.status(500).json({
          success: false,
          message: 'Cloudinary must be configured for image uploads in production. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'
        });
      }
      
      // Local file storage (development only)
      console.warn('⚠️ Cloudinary not configured, saving images locally (development only)');
      const fs = require('fs');
      const path = require('path');
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../../../uploads/products');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        // Sanitize filename: replace spaces with underscores and remove special characters
        const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `product_${Date.now()}_${i}_${sanitizedOriginalName}`;
        const filePath = path.join(uploadsDir, fileName);
        
        // Save file to local directory
        fs.writeFileSync(filePath, file.buffer);
        
        // Use full URL for frontend access - URL encode the filename
        const encodedFileName = encodeURIComponent(fileName);
        const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/products/${encodedFileName}`;
        uploadedImages.push({ 
          url: imageUrl, 
          public_id: fileName 
        });
        console.log('💾 Image saved locally:', imageUrl);
        console.log('📁 File saved to:', filePath);
      }
    }

    console.log('📸 Uploaded images array:', uploadedImages);
    console.log('🖼️ Main image URL:', uploadedImages[0]?.url || 'No image');

    const product = await Product.create({
      name,
      description,
      brand,
      price,
      countInStock,
      category: parsedCategory,
      isFeatured: isFeatured === 'true' || isFeatured === true, // Handle string/boolean
      createdBy: req.user._id,
      mainImage: uploadedImages[0]?.url || '',
      images: uploadedImages,
    });

    console.log('✅ Product created with images:', {
      mainImage: product.mainImage,
      imagesCount: product.images?.length || 0,
      images: product.images
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

    // Category filter - support both main and sub categories (case-insensitive)
    let category = {};
    if (req.query.category) {
      const categoryRegex = new RegExp(req.query.category, 'i');
      if (req.query.subcategory) {
        // If subcategory is specified, filter by both main and sub
        const subcategoryRegex = new RegExp(req.query.subcategory, 'i');
        category = {
          $and: [
            { 'category.main': categoryRegex },
            { 'category.sub': subcategoryRegex }
          ]
        };
      } else {
        // If only main category is specified, filter by main category
        category = {
          'category.main': categoryRegex
        };
      }
    }

    const priceFilter = {
      price: {
        $gte: req.query.minPrice ? Number(req.query.minPrice) : 0,
        $lte: req.query.maxPrice ? Number(req.query.maxPrice) : Infinity,
      },
    };

    const rating = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Featured filter
    const featured = req.query.featured === 'true' ? { isFeatured: true } : {};

    // Status filter (only show active products to public, unless admin requests all)
    const statusFilter = req.query.includeAll === 'true' ? {} : { status: 'active' };
    
    // Additional status filter if specific status is requested
    const specificStatus = req.query.status ? { status: req.query.status } : {};
    
    const filters = { ...keyword, ...category, ...priceFilter, ...rating, ...featured, ...statusFilter, ...specificStatus };

    // Sorting - support both sortBy/order format and legacy sort format
    let sort = { createdAt: -1 };
    if (req.query.sortBy && req.query.order) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    } else {
      const sortOption = req.query.sort?.toLowerCase();
      if (sortOption === 'price-asc') sort = { price: 1 };
      else if (sortOption === 'price-desc') sort = { price: -1 };
      else if (sortOption === 'top-rated') sort = { rating: -1 };
      else if (sortOption === 'featured') sort = { isFeatured: -1, createdAt: -1 };
    }

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters).sort(sort).skip(skip).limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), products });
  } catch (err) {
    console.error('[Get Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // Default to 8 featured products
    
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name price mainImage images rating numReviews category');

    res.json({
      count: featuredProducts.length,
      products: featuredProducts
    });
  } catch (err) {
    console.error('[Get Featured Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch featured products' });
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
      images,
      isFeatured
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
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('[Update Product Error]', err);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/products/:id/featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isFeatured = !product.isFeatured;
    const updated = await product.save();
    
    res.json({
      message: `Product ${updated.isFeatured ? 'added to' : 'removed from'} featured products`,
      product: updated
    });
  } catch (err) {
    console.error('[Toggle Featured Error]', err);
    res.status(500).json({ message: 'Server error while toggling featured status' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne(); // Updated from remove() to deleteOne()
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

// @desc    Get unique product categories
// @route   GET /api/products/categories
// @access  Public
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: {
            main: "$category.main",
            sub: "$category.sub",
          },
        },
      },
      {
        $project: {
          _id: 0,
          main: "$_id.main",
          sub: "$_id.sub",
        },
      },
    ]);

    res.json(categories);
  } catch (err) {
    console.error("[Get Categories Error]", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// @desc    Get best selling products
// @route   GET /api/products/bestsellers
// @access  Public
exports.getBestSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const bestSellingProducts = await Product.getBestSellingProducts(limit);

    res.json({
      count: bestSellingProducts.length,
      products: bestSellingProducts
    });
  } catch (err) {
    console.error('[Get Best Selling Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch best selling products' });
  }
};

// @desc    Get popular products (by views)
// @route   GET /api/products/popular
// @access  Public
exports.getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const popularProducts = await Product.getPopularProducts(limit);

    res.json({
      count: popularProducts.length,
      products: popularProducts
    });
  } catch (err) {
    console.error('[Get Popular Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch popular products' });
  }
};

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
exports.getProductsOnSale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const saleProducts = await Product.getProductsOnSale(limit);

    res.json({
      count: saleProducts.length,
      products: saleProducts
    });
  } catch (err) {
    console.error('[Get Products On Sale Error]', err);
    res.status(500).json({ message: 'Failed to fetch products on sale' });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const limit = parseInt(req.query.limit) || 4;
    const relatedProducts = await Product.getRelatedProducts(
      req.params.id, 
      product.category, 
      limit
    );

    res.json({
      count: relatedProducts.length,
      products: relatedProducts
    });
  } catch (err) {
    console.error('[Get Related Products Error]', err);
    res.status(500).json({ message: 'Failed to fetch related products' });
  }
};

// @desc    Increment product view count
// @route   PATCH /api/products/:id/view
// @access  Public
exports.incrementViewCount = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ 
      success: true, 
      message: 'View count updated',
      viewCount: product.viewCount 
    });
  } catch (err) {
    console.error('[Increment View Count Error]', err);
    res.status(500).json({ message: 'Failed to update view count' });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    console.log('🔍 Looking for product with slug:', req.params.slug);
    
    const product = await Product.findOne({ 
      slug: req.params.slug,
      status: 'active'
    });
    
    console.log('📦 Found product:', product ? product.name : 'NOT FOUND');
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('[Get Product By Slug Error]', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch product' 
    });
  }
};