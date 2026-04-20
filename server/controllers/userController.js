const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username name avatar')
      .populate('following', 'username name avatar')
      .select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, website, location, github, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (website !== undefined) user.website = website;
    if (location !== undefined) user.location = location;
    if (github !== undefined) user.github = github;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      website: user.website,
      location: user.location,
      github: user.github,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow / Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404);
      throw new Error('User not found');
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user._id);

      // Create notification
      const notification = await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        type: 'follow',
        message: `${currentUser.name} started following you`,
      });

      // Send real-time notification
      const io = getIO();
      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'username name avatar');
      io.to(targetUser._id.toString()).emit('notification', populatedNotification);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users to follow
// @route   GET /api/users/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const usersToExclude = [...currentUser.following, req.user._id];

    const suggestions = await User.find({ _id: { $nin: usersToExclude } })
      .select('username name avatar bio skills')
      .limit(5);

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Private
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
      ],
      _id: { $ne: req.user._id },
    })
      .select('username name avatar bio')
      .limit(10);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user posts
// @route   GET /api/users/:username/posts
// @access  Public
const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const posts = await Post.find({ author: user._id })
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  followUser,
  getSuggestions,
  searchUsers,
  getUserPosts,
};
