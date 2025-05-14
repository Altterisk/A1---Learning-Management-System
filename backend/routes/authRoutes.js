
const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, changePassword, getNotifications, markAllNotificationsRead } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/password').put(protect, changePassword);
router.route('/notifications').get(protect, getNotifications);
router.route('/notifications/read').patch(protect, markAllNotificationsRead);

module.exports = router;
