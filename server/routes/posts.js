const express = require('express');
const router = express.Router();
const {
  getFeed,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/feed', protect, getFeed);
router.get('/', getPosts);
router.post('/', protect, createPost);
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
