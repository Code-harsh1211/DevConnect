const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  followUser,
  getSuggestions,
  searchUsers,
  getUserPosts,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.put('/profile', protect, updateProfile);
router.get('/:username', getUserProfile);
router.get('/:username/posts', getUserPosts);
router.post('/:id/follow', protect, followUser);

module.exports = router;
