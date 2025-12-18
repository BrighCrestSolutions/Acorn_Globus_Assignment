const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a court name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: [true, 'Please specify court type']
  },
  sport: {
    type: String,
    default: 'badminton'
  },
  hourlyBaseRate: {
    type: Number,
    required: [true, 'Please provide base hourly rate'],
    min: 0
  },
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'maintenance', 'disabled'],
    default: 'active'
  },
  availability: [{
    dayOfWeek: {
      type: Number, // 0-6 (Sunday to Saturday)
      min: 0,
      max: 6
    },
    startTime: String, // Format: "HH:MM"
    endTime: String    // Format: "HH:MM"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
courtSchema.pre('save', function() {
  this.updatedAt = Date.now();

});

module.exports = mongoose.model('Court', courtSchema);
