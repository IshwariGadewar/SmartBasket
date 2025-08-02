const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Scheduled tasks
// Check and trigger price alerts every hour
cron.schedule('0 * * * *', async () => {
  try {
    const Alert = require('./models/Alert');
    const Product = require('./models/Product');
    
    const activeAlerts = await Alert.find({ isActive: true }).populate('productId');
    
    for (const alert of activeAlerts) {
      if (alert.productId) {
        const currentPrice = alert.productId.price;
        
        if (alert.shouldTrigger(currentPrice)) {
          alert.trigger();
          await alert.save();
          
          // Here you would send notifications (email, push, etc.)
          console.log(`Alert triggered for product: ${alert.productId.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Alert check error:', error);
  }
});

// Clean up old products (older than 30 days)
cron.schedule('0 2 * * *', async () => {
  try {
    const Product = require('./models/Product');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await Product.deleteMany({
      scrapedAt: { $lt: thirtyDaysAgo }
    });
    
    console.log(`Cleaned up ${result.deletedCount} old products`);
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SmartCart AI Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});