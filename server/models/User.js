const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: 'Pincode must be 6 digits'
    }
  },
  savedProducts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  alerts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Alert' 
  }],
  isPro: { 
    type: Boolean, 
    default: false 
  },
  searchHistory: [{
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],
  preferences: {
    defaultPlatforms: {
      type: [String],
      default: ['Amazon', 'Blinkit', 'Zepto', 'Instamart']
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = mongoose.model('User', userSchema);