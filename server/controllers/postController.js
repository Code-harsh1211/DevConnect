const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

// @desc    Get feed posts (from followed users + own posts)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user._id);
    const usersToFetch = [...currentUser.following, req.user._id];

    const posts = await Post.find({ author: { $in: usersToFetch } })
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ author: { $in: usersToFetch } });

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (explore)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;

    const query = tag ? { tags: tag } : {};

    const posts = await Post.find(query)
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username name avatar bio')
      .populate('comments.user', 'username name avatar');

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, tags, image } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      tags: tags || [],
      image: image || '',
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar');

    // Emit to followers in real time
    const io = getIO();
    const author = await User.findById(req.user._id);
    author.followers.forEach((followerId) => {
      io.to(followerId.toString()).emit('new_post', populatedPost);
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this post');
    }

    const { content, tags } = req.body;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.isEdited = true;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar');

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);

      // Notify post author (not self)
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          post: post._id,
          message: `${req.user.name} liked your post`,
        });

        const io = getIO();
        const populatedNotification = await Notification.findById(notification._id)
          .populate('sender', 'username name avatar')
          .populate('post', 'content');
        io.to(post.author.toString()).emit('notification', populatedNotification);
      }
    }

    await post.save();

    res.json({
      likes: post.likes,
      likesCount: post.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const { content } = req.body;
    post.comments.push({ user: req.user._id, content });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .populate('comments.user', 'username name avatar');

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    // Notify post author (not self)
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        message: `${req.user.name} commented on your post`,
      });

      const io = getIO();
      const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'username name avatar')
        .populate('post', 'content');
      io.to(post.author.toString()).emit('notification', populatedNotification);
    }

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeed,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
};
