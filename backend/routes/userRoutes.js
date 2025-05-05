
const express = require('express');
const { getUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getUsers).post(protect, addUser);
router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, deleteUser);

module.exports = router;
