const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  desiredDate: {
    type: Date,
    required: true
  },
  desiredStartTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  desiredEndTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  equipment: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    quantity: Number
  }],
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  },
  position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'expired', 'converted'],
    default: 'waiting'
  },
  notifiedAt: Date,
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient waitlist queries
waitlistSchema.index({ court: 1, desiredDate: 1, status: 1, position: 1 });
waitlistSchema.index({ user: 1, status: 1 });
waitlistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Waitlist', waitlistSchema);
