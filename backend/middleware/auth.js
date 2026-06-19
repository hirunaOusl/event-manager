const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Check for the header case-insensitively
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    
    if (decoded.role === 'seller') {
      const user = await User.findById(decoded.id);
      if (user) {
        req.seller = user;
      }
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (decoded.role === 'seller') {
        const user = await User.findById(decoded.id);
        if (user) {
          req.seller = user;
        }
      }
    } catch (error) {
      // silently ignore invalid token for optional authentication
    }
  }
  next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden, you do not have permission to access this resource'});
        }
        next();
    }
};

module.exports = { protect, authorize, optionalAuth };