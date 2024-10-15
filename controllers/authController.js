// controllers/authController.js

const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role, // Optional: Only admins can assign roles
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, authUser };
