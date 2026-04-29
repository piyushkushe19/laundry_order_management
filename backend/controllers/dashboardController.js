const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      totalRevenueResult,
      statusCounts,
      todayOrders,
      todayRevenueResult,
      last7Days,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const statusMap = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
    statusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenueResult[0]?.total || 0,
        todayOrders,
        todayRevenue: todayRevenueResult[0]?.total || 0,
        statusBreakdown: statusMap,
        last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
