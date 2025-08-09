// models/Cart.js - Simplified version
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    
    items: [cartItemSchema],
    
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
  }
);

// Pre-save middleware to update lastActivity
cartSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Virtual for total price calculation
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtuals are included in JSON output
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);