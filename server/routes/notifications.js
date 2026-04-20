const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read', protect, markAsRead);
router.get('/unread-count', protect, getUnreadCount);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
