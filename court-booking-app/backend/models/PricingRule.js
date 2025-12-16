const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide rule name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['time-based', 'day-based', 'court-type', 'seasonal', 'custom'],
    required: true
  },
  conditions: {
    // For time-based rules
    startHour: Number, // 0-23
    endHour: Number,   // 0-23
    
    // For day-based rules
    daysOfWeek: [Number], // 0-6, empty means all days
    
    // For court-type rules
    courtTypes: [String], // ['indoor', 'outdoor']
    
    // For date range rules
    startDate: Date,
    endDate: Date,
    
    // Custom conditions (flexible JSON)
    custom: mongoose.Schema.Types.Mixed
  },
  multiplier: {
    type: Number,
    required: [true, 'Please provide price multiplier'],
    min: 0,
    default: 1
  },
  priority: {
    type: Number,
    default: 0,
    comment: 'Higher priority rules are evaluated first'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingRuleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient rule queries
pricingRuleSchema.index({ active: 1, priority: -1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
