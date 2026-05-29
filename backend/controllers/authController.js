const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper: Generate a signed JWT token for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

// -------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// -------------------------------------------------------
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate all required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide name, email, and password' });
  }

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'A user with this email already exists' });
  }

  // Create new user (password is hashed via pre-save hook in User model)
  const user = await User.create({ name, email, password });

  if (user) {
    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
};

// -------------------------------------------------------
// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
// -------------------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Verify user exists and password matches
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.status(200).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { registerUser, loginUser };
