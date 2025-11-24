const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found or account deleted' 
        });
      }

      // Check if user account is still active (you can add an 'active' field later)
      if (user.role === 'banned') {
        return res.status(401).json({ 
          success: false,
          message: 'Account has been suspended' 
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('[Auth Error]', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token expired. Please login again.' 
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token' 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }
};

const adminOnly = (req, res, next) => {
  // Check if user is authenticated first
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Check if user has admin role
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied: Admin privileges required' 
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role !== 'banned') {
        req.user = user;
      }
    } catch (err) {
      // Silently fail for optional auth
      console.log('[Optional Auth] Token invalid or expired');
    }
  }
  
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
