const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Amazon', 'Blinkit', 'Zepto', 'Instamart']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: 'unit'
  },
  deliveryCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  deliveryTime: {
    type: String,
    default: '1-2 days'
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  searchQuery: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  priceHistory: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  tags: [String],
  category: {
    type: String,
    default: 'General'
  }
});

// Index for efficient queries
productSchema.index({ searchQuery: 1, platform: 1, pincode: 1 });
productSchema.index({ scrapedAt: -1 });

// Virtual for total price
productSchema.virtual('totalPrice').get(function() {
  return this.price + this.deliveryCharges;
});

// Method to update price history
productSchema.methods.updatePrice = function(newPrice) {
  this.priceHistory.push({
    price: this.price,
    timestamp: new Date()
  });
  
  // Keep only last 30 price entries
  if (this.priceHistory.length > 30) {
    this.priceHistory = this.priceHistory.slice(-30);
  }
  
  this.price = newPrice;
  
  // Calculate discount if original price exists
  if (this.originalPrice && this.originalPrice > newPrice) {
    this.discount = Math.round(((this.originalPrice - newPrice) / this.originalPrice) * 100);
  }
};

module.exports = mongoose.model('Product', productSchema);