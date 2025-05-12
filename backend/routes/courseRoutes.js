const express = require('express');
const { getCourses, addCourse, updateCourse, deleteCourse, getCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/').get(protect, getCourses).post(protect, allowedRoles('Admin'), addCourse);
router.route('/:id').get(protect, getCourse).put(protect, allowedRoles('Admin', 'Teacher'), updateCourse).delete(protect, allowedRoles('Admin'), deleteCourse);

module.exports = router;