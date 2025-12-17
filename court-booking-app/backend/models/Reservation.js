const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// TTL index - MongoDB will auto-delete documents after expiresAt
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient availability checks
reservationSchema.index({ court: 1, startTime: 1, status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
