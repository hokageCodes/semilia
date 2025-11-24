const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Get comprehensive admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      activeUsers,
      orders,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ isActive: true }),
      Order.find(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ countInStock: { $lte: 10 } }).select('name countInStock price')
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const paidOrders = orders.filter(order => order.isPaid);
    const deliveredOrders = orders.filter(order => order.isDelivered);

    // Monthly sales for the last 12 months
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Top customers
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          lastLogin: '$userInfo.lastLogin'
        },
      },
    ]);

    // Product category stats
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category.main',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$countInStock'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt lastLogin');

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalOrders,
          totalProducts,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          paidOrders: paidOrders.length,
          deliveredOrders: deliveredOrders.length,
          conversionRate: totalUsers > 0 ? Math.round((paidOrders.length / totalUsers) * 100) : 0
        },
        monthlySales: monthlySales.map((m) => ({
          month: new Date(m._id.year, m._id.month - 1).toLocaleString('default', {
            month: 'short',
            year: 'numeric'
          }),
          total: Math.round(m.total * 100) / 100,
          count: m.count
        })),
        topCustomers,
        categoryStats,
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          totalPrice: order.totalPrice,
          isPaid: order.isPaid,
          isDelivered: order.isDelivered,
          createdAt: order.createdAt,
          user: order.user
        })),
        recentUsers,
        lowStockProducts,
        alerts: {
          lowStockCount: lowStockProducts.length,
          pendingOrders: orders.filter(o => !o.isPaid).length,
          inactiveUsers: totalUsers - activeUsers
        }
      }
    });
  } catch (err) {
    console.error('[Admin Stats Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin stats',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const isActive = req.query.isActive;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    // Only apply isActive filter if explicitly set to 'true' or 'false'
    if (isActive !== undefined && isActive !== '' && isActive !== null) {
      filter.isActive = isActive === 'true';
    }

    // Debug logging
    console.log('🔍 Get Users - Filter:', filter);
    const totalInDb = await User.countDocuments();
    console.log('📊 Total users in DB:', totalInDb);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    console.log('✅ Found users:', users.length, 'Total matching filter:', total);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (err) {
    console.error('[Get All Users Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Update user status (activate/deactivate/ban)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from modifying other admins
    if (user.role === 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other admin accounts'
      });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role && ['user', 'admin', 'banned'].includes(role)) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (err) {
    console.error('[Update User Status Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

// @desc    Get all orders with advanced filtering and pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const {
      status,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) {
      if (status === 'delivered') {
        filter.isDelivered = true;
      } else {
        filter.orderStatus = status;
      }
    }
    
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { 'shippingInfo.fullName': { $regex: search, $options: 'i' } },
        { 'shippingInfo.email': { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'name price images')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (err) {
    console.error('[Get All Orders Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, adminNotes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    if (orderStatus) {
      order.orderStatus = orderStatus;
      
      // Set delivery date when status changes to delivered
      if (orderStatus === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (adminNotes) order.adminNotes = adminNotes;

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (err) {
    console.error('[Update Order Status Error]', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};