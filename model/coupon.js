const mongoose = require('mongoose');


// Define the schema
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    minlength: 6, // Optional: Set minimum length for coupon code
  },
  discount: {
    type: Number,
    required: true,
    min: 0, // Ensure discount is non-negative
  },
  isPercent: {
    type: Boolean,
    required: true,
    default: true, // Discount is a percentage by default
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 1, // Allow using the coupon once by default
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  minAmount: {
    type: Number,
    default: 0, // Minimum amount allowed
  },
  maxAmount: {
    type: Number,
    default: Infinity, // Maximum amount allowed, set to Infinity by default
  },
  islist:{
    type:Boolean,
    default:false,
  }
});

module.exports = mongoose.model('Coupon', couponSchema);