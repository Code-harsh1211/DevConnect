const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400);
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw new Error(`${field} already in use`);
    }

    // Create user
    const user = await User.create({ username, email, password, name });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      followers: user.followers,
      following: user.following,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      followers: user.followers,
      following: user.following,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
