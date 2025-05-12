const express = require('express');
const { createCoursePackage } = require('../controllers/coursepackageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createCoursePackage);

module.exports = router;