const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyFirebaseToken } = require('../utils/firebaseAuth');

// Helper function to detect token type
const isJWT = (token) => {
  // JWT tokens have exactly 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

// Protect routes - verify Firebase token or JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check token type and verify accordingly
      if (isJWT(token)) {
        // Try JWT first (likely from admin OTP login)
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-otp -otpExpire');
        } catch (jwtError) {
          // If JWT fails, might be a Firebase token, try that
          const decoded = await verifyFirebaseToken(token);
          req.user = await User.findOne({ firebaseUid: decoded.uid }).select('-otp -otpExpire');
        }
      } else {
        // Longer tokens are likely Firebase tokens
        const decoded = await verifyFirebaseToken(token);
        req.user = await User.findOne({ firebaseUid: decoded.uid }).select('-otp -otpExpire');
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};

module.exports = { protect, admin };
