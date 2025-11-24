const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: String,

    category: {
      main: {
        type: String,
        enum: ['Women', 'Men', 'Accessories', 'Kids'],
        required: true,
      },
      sub: {
        type: String,
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Price must be a positive number'
      }
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // Featured product flag
    isFeatured: {
      type: Boolean,
      default: false,
      index: true, // Add index for faster queries
    },
    // Product status
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft', 'archived'],
      default: 'active',
    },
    // SEO fields
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: String,
    metaDescription: String,
    // Product variants (size, color, etc.)
    variants: [{
      name: { type: String, required: true }, // e.g., "Size", "Color"
      options: [{ type: String, required: true }], // e.g., ["S", "M", "L"] or ["Red", "Blue"]
      required: { type: Boolean, default: false }
    }],
    // Inventory tracking
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
    // Analytics
    viewCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 },
    // Product tags
    tags: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    mainImage: {
      type: String,
      default: '',
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String },
        rating: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for better performance
productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ 'category.main': 1, 'category.sub': 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search
productSchema.index({ countInStock: 1 }); // For low stock queries
productSchema.index({ createdAt: -1 }); // For recent products
productSchema.index({ status: 1 }); // For status filtering
// Slug already has unique: true, so no need for separate index
productSchema.index({ tags: 1 }); // For tag-based queries
productSchema.index({ viewCount: -1 }); // For popular products
productSchema.index({ purchaseCount: -1 }); // For best sellers

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Update mainImage if not set
  if (this.images && this.images.length > 0 && !this.mainImage) {
    this.mainImage = this.images[0].url;
  }
  
  // Generate slug from name if not provided
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  
  // Calculate discount percentage if originalPrice is set
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  next();
});

// Instance method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.countInStock >= quantity;
};

// Static method to get low stock products
productSchema.statics.getLowStockProducts = function(threshold = 10) {
  return this.find({ countInStock: { $lte: threshold } });
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 8) {
  return this.find({ isFeatured: true, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name price mainImage images rating numReviews category slug discount');
};

// Static method to get best selling products
productSchema.statics.getBestSellingProducts = function(limit = 8) {
  return this.find({ status: 'active' })
    .sort({ purchaseCount: -1 })
    .limit(limit)
    .select('name price mainImage images rating numReviews category slug discount');
};

// Static method to get popular products (by views)
productSchema.statics.getPopularProducts = function(limit = 8) {
  return this.find({ status: 'active' })
    .sort({ viewCount: -1 })
    .limit(limit)
    .select('name price mainImage images rating numReviews category slug discount');
};

// Static method to get products on sale
productSchema.statics.getProductsOnSale = function(limit = 8) {
  return this.find({ 
    status: 'active',
    discount: { $gt: 0 }
  })
    .sort({ discount: -1 })
    .limit(limit)
    .select('name price originalPrice discount mainImage images rating numReviews category slug');
};

// Static method to get related products
productSchema.statics.getRelatedProducts = function(productId, category, limit = 4) {
  return this.find({
    _id: { $ne: productId },
    'category.main': category.main,
    'category.sub': category.sub,
    status: 'active'
  })
    .sort({ rating: -1 })
    .limit(limit)
    .select('name price mainImage images rating numReviews category slug discount');
};

module.exports = mongoose.model('Product', productSchema);