const express = require('express');
const { createCoursePackage, getCoursePackages } = require('../controllers/coursepackageController');
const { protect } = require('../middleware/authMiddleware');
const allowedRoles = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/').post(protect, allowedRoles('Admin'), createCoursePackage);
router.route('/').get(protect, allowedRoles('Admin'), getCoursePackages);
//router.route('/').get(protect, getCoursePackages).post(protect, allowedRoles('Admin'), createCoursePackage);

module.exports = router;