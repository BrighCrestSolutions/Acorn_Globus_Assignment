const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide coach name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  specialties: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please provide hourly rate'],
    min: 0
  },
  bio: {
    type: String,
    trim: true
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

coachSchema.pre('save', function() {
  this.updatedAt = Date.now();
  ;
});

module.exports = mongoose.model('Coach', coachSchema);
