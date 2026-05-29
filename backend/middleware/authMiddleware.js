const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes.
 * Reads Bearer token from Authorization header,
 * verifies it, and attaches the user to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token is invalid or expired' });
  }
};

module.exports = { protect };
