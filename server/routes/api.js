const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { scrapeProductData } = require('../services/scraper');
const { 
  matchProducts, 
  processChatbotQuery, 
  extractProductInfo,
  generateSearchSuggestions,
  analyzePriceTrends 
} = require('../services/nlp');
const { auth, optionalAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const Alert = require('../models/Alert');
const User = require('../models/User');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, pincode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      name,
      pincode
    });
    
    await user.save();
    
    // Generate token
    const token = user.generateToken();
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        pincode: user.pincode,
        isPro: user.isPro
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = user.generateToken();
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        pincode: user.pincode,
        isPro: user.isPro
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedProducts')
      .populate('alerts');
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        pincode: user.pincode,
        isPro: user.isPro,
        savedProducts: user.savedProducts,
        alerts: user.alerts,
        preferences: user.preferences,
        searchHistory: user.searchHistory.slice(-10) // Last 10 searches
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, pincode, preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (pincode) user.pincode = pincode;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Product search
router.post('/search', optionalAuth, async (req, res) => {
  try {
    const { query, pincode, platforms } = req.body;
    
    if (!query || !pincode || !platforms || platforms.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Extract product info using NLP
    const productInfo = await extractProductInfo(query);
    
    // Scrape products from selected platforms
    const scrapeResult = await scrapeProductData(query, platforms, pincode);
    
    // Match equivalent products
    const matchedProducts = await matchProducts(query, scrapeResult.products);
    
    // Analyze price trends
    const priceAnalysis = await analyzePriceTrends(scrapeResult.products);
    
    // Save products to database
    const savedProducts = await Product.insertMany(scrapeResult.products);
    
    // Update user search history if authenticated
    if (req.user) {
      req.user.searchHistory.push({
        query,
        timestamp: new Date()
      });
      await req.user.save();
    }
    
    res.json({
      products: scrapeResult.products,
      matchedProducts,
      priceAnalysis,
      availablePlatforms: scrapeResult.availablePlatforms,
      unavailablePlatforms: scrapeResult.unavailablePlatforms,
      productInfo
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const suggestions = await generateSearchSuggestions(query);
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Save product to user's list
router.post('/save-product', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user.savedProducts.includes(productId)) {
      user.savedProducts.push(productId);
      await user.save();
    }
    
    res.json({ message: 'Product saved successfully' });
  } catch (error) {
    console.error('Save product error:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Remove product from user's list
router.delete('/save-product/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.savedProducts = user.savedProducts.filter(id => id.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Remove product error:', error);
    res.status(500).json({ error: 'Failed to remove product' });
  }
});

// Create price alert
router.post('/alert', auth, async (req, res) => {
  try {
    const { productId, targetPrice, alertType = 'price_drop', customMessage } = req.body;
    
    const alert = new Alert({
      userId: req.user._id,
      productId,
      targetPrice,
      alertType,
      customMessage
    });
    
    await alert.save();
    
    // Add alert to user's alerts
    const user = await User.findById(req.user._id);
    user.alerts.push(alert._id);
    await user.save();
    
    res.json({ message: 'Alert created successfully', alertId: alert._id });
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Get user's alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Delete alert
router.delete('/alert/:alertId', auth, async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = await Alert.findOneAndDelete({
      _id: alertId,
      userId: req.user._id
    });
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Remove from user's alerts
    const user = await User.findById(req.user._id);
    user.alerts = user.alerts.filter(id => id.toString() !== alertId);
    await user.save();
    
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Chatbot endpoint
router.post('/chatbot', optionalAuth, async (req, res) => {
  try {
    const { message } = req.body;
    
    const context = req.user ? {
      userId: req.user._id,
      pincode: req.user.pincode,
      isPro: req.user.isPro
    } : {};
    
    const reply = await processChatbotQuery(message, context);
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chatbot failed' });
  }
});

// Get saved products
router.get('/saved-products', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProducts');
    res.json({ products: user.savedProducts });
  } catch (error) {
    console.error('Get saved products error:', error);
    res.status(500).json({ error: 'Failed to get saved products' });
  }
});

// Check pincode availability
router.get('/pincode/:pincode/availability', async (req, res) => {
  try {
    const { pincode } = req.params;
    const platforms = ['Amazon', 'Blinkit', 'Zepto', 'Instamart'];
    
    const availability = {};
    for (const platform of platforms) {
      availability[platform] = await checkPincodeAvailability(platform, pincode);
    }
    
    res.json({ availability });
  } catch (error) {
    console.error('Pincode availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

module.exports = router;