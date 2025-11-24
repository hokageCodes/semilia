const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest orders
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],

    shippingInfo: {
      fullName: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, default: 'Nigeria' },
      postalCode: { type: String },
      phone: { type: String },
    },

    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Card', 'Transfer', 'Paystack', 'Flutterwave'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    
    // Order tracking
    orderStatus: {
      type: String,
      enum: [
        'pending',           // Order received, awaiting confirmation
        'confirmed',         // Order confirmed, payment verified
        'processing',        // Order being prepared
        'quality_check',     // Quality control check
        'packaging',         // Order being packaged
        'ready_to_ship',    // Ready for pickup by courier
        'shipped',          // Order dispatched
        'in_transit',       // Order in transit
        'out_for_delivery', // Out for delivery
        'delivered',        // Successfully delivered
        'cancelled',        // Order cancelled
        'returned',         // Order returned
        'refunded'          // Order refunded
      ],
      default: 'pending',
    },
    trackingNumber: String,
    estimatedDeliveryDate: Date,
    
    // Order status history for tracking
    statusHistory: [{
      status: {
        type: String,
        enum: [
          'pending', 'confirmed', 'processing', 'quality_check', 'packaging',
          'ready_to_ship', 'shipped', 'in_transit', 'out_for_delivery',
          'delivered', 'cancelled', 'returned', 'refunded'
        ],
        required: true
      },
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: { type: String, default: 'system' } // 'system', 'admin', 'customer'
    }],
    
    // Order notes and communication
    notes: String,
    adminNotes: String,
    
    // Refund information
    refundRequested: { type: Boolean, default: false },
    refundReason: String,
    refundAmount: Number,
    refundedAt: Date,
    
    // Order source and analytics
    source: { type: String, default: 'website' }, // website, mobile, admin
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ totalPrice: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ refundRequested: 1 });
orderSchema.index({ source: 1 });

// Virtual for order status
orderSchema.virtual('status').get(function() {
  if (this.orderStatus === 'cancelled') return 'cancelled';
  if (this.orderStatus === 'returned') return 'returned';
  if (this.isDelivered) return 'delivered';
  if (this.orderStatus === 'shipped') return 'shipped';
  if (this.orderStatus === 'processing') return 'processing';
  if (this.orderStatus === 'confirmed') return 'confirmed';
  if (this.isPaid) return 'paid';
  return 'pending';
});

// Instance method to calculate total items
orderSchema.methods.getTotalItems = function() {
  return this.orderItems.reduce((total, item) => total + item.qty, 0);
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  const query = {};
  switch (status) {
    case 'pending':
      query.isPaid = false;
      break;
    case 'paid':
      query.isPaid = true;
      query.isDelivered = false;
      break;
    case 'delivered':
      query.isDelivered = true;
      break;
  }
  return this.find(query).populate('user', 'name email');
};

// Static method to get revenue by date range
orderSchema.statics.getRevenueByDateRange = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        isPaid: true
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status) {
  const query = {};
  switch (status) {
    case 'pending':
      query.orderStatus = 'pending';
      break;
    case 'confirmed':
      query.orderStatus = 'confirmed';
      break;
    case 'processing':
      query.orderStatus = 'processing';
      break;
    case 'shipped':
      query.orderStatus = 'shipped';
      break;
    case 'delivered':
      query.isDelivered = true;
      break;
    case 'cancelled':
      query.orderStatus = 'cancelled';
      break;
    case 'returned':
      query.orderStatus = 'returned';
      break;
  }
  return this.find(query).populate('user', 'name email');
};

// Static method to get orders requiring attention
orderSchema.statics.getOrdersRequiringAttention = function() {
  return this.find({
    $or: [
      { orderStatus: 'pending', createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Pending for more than 24 hours
      { refundRequested: true },
      { orderStatus: 'cancelled' },
      { paymentStatus: 'failed' }
    ]
  }).populate('user', 'name email');
};

// Static method to get daily sales summary
orderSchema.statics.getDailySalesSummary = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        isPaid: true
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$totalPrice' }
      }
    }
  ]);
};

// Pre-save middleware to add status history and generate order number
orderSchema.pre('save', function(next) {
  // Generate order number if it doesn't exist
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}-${randomNum}`;
  }

  // Only add to history if orderStatus has changed
  if (this.isModified('orderStatus')) {
    // Add new status to history
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: this.adminNotes || '',
      updatedBy: this.updatedBy || 'system'
    });
  }
  
  // Set isDelivered and deliveredAt when status is 'delivered'
  if (this.orderStatus === 'delivered' && !this.isDelivered) {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
