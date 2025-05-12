//backend/controllers/coursePackageController.js
const Course = require('../models/Course');
const CoursePackage = require('../models/CoursePackage');
const { CoursePackageDecorator } = require('../decorators/courseDecorator');

// Create a new course package
exports.createCoursePackage = async (req, res) => {
  try {
    const { name, description, courses } = req.body;

    // Fetch course details from the database using the course IDs
    const courseData = await Course.find({ '_id': { $in: courses } });

    if (!courseData.length) {
      return res.status(400).json({ message: 'No valid courses found for the package.' });
    }

    // Define package details (name and description)
    const packageDetails = {
      name,
      description,
    };

    // Decorate the courses (add them to the package and apply discount if needed)
    const decoratedCourses = courseData.map((course) => {
      let decoratedCourse = new CoursePackageDecorator(course, packageDetails);
      return decoratedCourse;
    });

    // Save the course package in the database
    const coursePackage = new CoursePackage({
      name,
      description,
      courses: courseData.map((course) => course._id),  // Save course IDs in the package
    });

    await coursePackage.save();

    // Return the decorated course details and the saved package
    const response = decoratedCourses.map((decoratedCourse) => ({
      packageInfo: decoratedCourse.getPackageInfo(),
      courseName: decoratedCourse.getName(),
      courseDescription: decoratedCourse.getDescription(),
    }));

    res.status(201).json({
      coursePackage,  // Saved package with courses
      decoratedCourses: response,  // Decorated course info with discount info
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
