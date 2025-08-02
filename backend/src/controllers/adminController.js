const User = require('../models/User');
const Order = require('../models/Order');

exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' },
        },
      },
      { $sort: { '_id': -1 } },
    ]);

    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
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
          name: '$userInfo.name',
          email: '$userInfo.email',
        },
      },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      monthlySales: monthlySales.map((m) => ({
        month: new Date(2025, m._id - 1).toLocaleString('default', {
          month: 'short',
        }),
        total: m.total,
      })),
      topCustomers,
    });
  } catch (err) {
    console.error('[Admin Stats Error]', err);
    res.status(500).json({
      message: 'Server error while fetching admin stats',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};
