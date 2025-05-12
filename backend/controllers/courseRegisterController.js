const Course = require("../models/Course");
const User = require("../models/User");

const registerToCourse = async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.body.student_id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: "Student not found or not a student" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    course.students.push(studentId);
    await course.save();
    res.status(200).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unregisterFromCourse = async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.body.student_id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: "Student not found or not a student" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.students = course.students.filter(
      (id) => id.toString() !== studentId
    );
    await course.save();
    res.status(200).json({ message: "Unregistered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCourses = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let courses = [];

    if (userRole === 'Student') {
      courses = await Course.find({ students: userId }).populate({
        path: 'teacher',
        select: 'firstName lastName',
        match: { role: 'Teacher' },
      });
    } else if (userRole === 'Teacher') {
      courses = await Course.find({ teacher: userId }).populate({
        path: 'teacher',
        select: 'firstName lastName',
        match: { role: 'Teacher' },
      });
    } else {
      return res.status(403).json({ message: 'Only Students and Teachers can access their courses.' });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerToCourse,
  unregisterFromCourse,
  getMyCourses,
};
