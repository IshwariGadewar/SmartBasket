const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Alert = require('../models/Alert');

const router = express.Router();

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    // Check if user is admin (you can add an isAdmin field to User model)
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Get analytics dashboard data
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalAlerts,
      proUsers,
      recentSearches,
      platformStats,
      userGrowth,
      searchTrends
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Alert.countDocuments(),
      User.countDocuments({ isPro: true }),
      Product.aggregate([
        { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Product.aggregate([
        { $group: { _id: '$platform', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$scrapedAt' },
              month: { $month: '$scrapedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ])
    ]);

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalAlerts,
        proUsers,
        conversionRate: totalUsers > 0 ? (proUsers / totalUsers * 100).toFixed(2) : 0
      },
      recentSearches,
      platformStats,
      userGrowth,
      searchTrends
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Analytics fetch failed' });
  }
});

// Get user management data
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (make admin, toggle pro status, etc.)
router.put('/users/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isPro, isAdmin, isActive } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (isPro !== undefined) user.isPro = isPro;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get product analytics
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, platform, category } = req.query;
    
    const query = {};
    if (platform) query.platform = platform;
    if (category) query.category = category;
    
    const products = await Product.find(query)
      .sort({ scrapedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    // Get price statistics
    const priceStats = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalProducts: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      priceStats: priceStats[0] || {}
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get alert analytics
router.get('/alerts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status === 'active') query.isActive = true;
    if (status === 'triggered') query.triggeredAt = { $exists: true };
    
    const alerts = await Alert.find(query)
      .populate('userId', 'name email')
      .populate('productId', 'name platform price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Alert.countDocuments(query);
    
    // Get alert statistics
    const alertStats = await Alert.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$alertType',
          count: { $sum: 1 },
          triggered: {
            $sum: { $cond: [{ $ifNull: ['$triggeredAt', false] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      alerts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      alertStats
    });
  } catch (error) {
    console.error('Alerts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Get search trends
router.get('/search-trends', adminAuth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const trends = await Product.aggregate([
      {
        $match: {
          scrapedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$scrapedAt' } },
            platform: '$platform'
          },
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          platforms: {
            $push: {
              platform: '$_id.platform',
              count: '$count',
              avgPrice: '$avgPrice'
            }
          },
          totalSearches: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ trends });
  } catch (error) {
    console.error('Search trends error:', error);
    res.status(500).json({ error: 'Failed to fetch search trends' });
  }
});

// Get platform performance
router.get('/platform-performance', adminAuth, async (req, res) => {
  try {
    const performance = await Product.aggregate([
      {
        $group: {
          _id: '$platform',
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
          avgDeliveryTime: { $avg: { $toDouble: '$deliveryTime' } },
          uniqueSearches: { $addToSet: '$searchQuery' }
        }
      },
      {
        $project: {
          platform: '$_id',
          totalProducts: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          avgRating: { $round: ['$avgRating', 2] },
          uniqueSearches: { $size: '$uniqueSearches' }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);
    
    res.json({ performance });
  } catch (error) {
    console.error('Platform performance error:', error);
    res.status(500).json({ error: 'Failed to fetch platform performance' });
  }
});

// System health check
router.get('/health', adminAuth, async (req, res) => {
  try {
    const [
      dbConnection,
      userCount,
      productCount,
      alertCount
    ] = await Promise.all([
      User.db.db.admin().ping(),
      User.countDocuments(),
      Product.countDocuments(),
      Alert.countDocuments()
    ]);
    
    res.json({
      status: 'healthy',
      database: dbConnection ? 'connected' : 'disconnected',
      stats: {
        users: userCount,
        products: productCount,
        alerts: alertCount
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    });
  }
});

module.exports = router;