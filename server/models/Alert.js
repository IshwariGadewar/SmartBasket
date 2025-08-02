const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  targetPrice: {
    type: Number,
    required: true,
    min: 0
  },
  alertType: {
    type: String,
    enum: ['price_drop', 'price_increase', 'stock_available', 'custom'],
    default: 'price_drop'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  triggeredAt: {
    type: Date
  },
  notificationHistory: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms']
    },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending'
    }
  }],
  customMessage: {
    type: String,
    maxlength: 200
  },
  frequency: {
    type: String,
    enum: ['immediate', 'daily', 'weekly'],
    default: 'immediate'
  }
});

// Index for efficient queries
alertSchema.index({ userId: 1, isActive: 1 });
alertSchema.index({ lastChecked: 1 });

// Method to check if alert should be triggered
alertSchema.methods.shouldTrigger = function(currentPrice) {
  if (!this.isActive) return false;
  
  switch (this.alertType) {
    case 'price_drop':
      return currentPrice <= this.targetPrice;
    case 'price_increase':
      return currentPrice >= this.targetPrice;
    default:
      return false;
  }
};

// Method to mark alert as triggered
alertSchema.methods.trigger = function() {
  this.triggeredAt = new Date();
  this.notificationSent = true;
  this.isActive = false; // Deactivate after triggering
};

module.exports = mongoose.model('Alert', alertSchema);