
const express = require('express');
const { getUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/').get(protect, getUsers).post(protect, allowedRoles('Admin'), addUser);
router.route('/:id').get(protect, getUser).put(protect, allowedRoles('Admin'), updateUser).delete(protect, allowedRoles('Admin'), deleteUser);

module.exports = router;
