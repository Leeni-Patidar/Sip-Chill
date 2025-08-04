const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const users = await query('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const user = users[0];
      
      if (!user.is_active) {
        return res.status(401).json({ success: false, message: 'User account is deactivated' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const users = await query('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?', [decoded.id]);
      
      if (users.length > 0 && users[0].is_active) {
        req.user = users[0];
      }
    } catch (error) {
      // Token is invalid, but we don't block the request
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

module.exports = { protect, authorize, optionalAuth };