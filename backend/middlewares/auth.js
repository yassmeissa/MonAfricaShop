const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Auth middleware - Token received:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (!token) {
    console.log('Auth middleware - No token provided, returning 401');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token verified, userId:', decoded.id);
    
    req.user = await User.findById(decoded.id).select('-password');
    console.log('Auth middleware - User found:', req.user?._id);
    
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { auth, admin };
