const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide equipment name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['racket', 'ball', 'net', 'shoes', 'other'],
    required: [true, 'Please specify equipment type']
  },
  totalQuantity: {
    type: Number,
    required: [true, 'Please provide total quantity'],
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Please provide hourly rate'],
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
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

// Initialize available quantity
equipmentSchema.pre('save', function() {
  if (this.isNew) {
    this.availableQuantity = this.totalQuantity;
  }
  this.updatedAt = Date.now();
  
});

module.exports = mongoose.model('Equipment', equipmentSchema);
