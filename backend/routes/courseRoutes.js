const express = require('express');
const { getCourses, addCourse, updateCourse, deleteCourse, getCourse } = require('../controllers/courseController');
const { registerToCourse, unregisterFromCourse, getMyCourses } = require("../controllers/courseRegisterController");
const { protect } = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/roleMiddleware');
const router = express.Router();


router.route('/mycourses').get(protect, allowedRoles('Teacher', 'Student'), getMyCourses);

router.route('/').get(protect, getCourses).post(protect, allowedRoles('Admin'), addCourse);
router.route('/:id').get(protect, getCourse).put(protect, allowedRoles('Admin', 'Teacher'), updateCourse).delete(protect, allowedRoles('Admin'), deleteCourse);

router.route('/:id/register').post(protect, registerToCourse);
router.route('/:id/register').delete(protect, unregisterFromCourse);

module.exports = router;