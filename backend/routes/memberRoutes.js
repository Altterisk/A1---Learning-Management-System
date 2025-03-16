const express = require('express');
const { getMembers, addMember, updateMember, deleteMember, getMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getMembers).post(protect, addMember);
router.route('/:id').get(protect, getMember).put(protect, updateMember).delete(protect, deleteMember);

module.exports = router;