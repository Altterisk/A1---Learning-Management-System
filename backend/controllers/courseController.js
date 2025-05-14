const Course = require("../models/Course");
const User = require("../models/User");
const CourseNotifier = require("../observers/CourseNotifier");
const Subscriber = require("../observers/Subscriber");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "teacher",
      select: "firstName lastName",
      match: { role: "Teacher" },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "teacher",
      select: "firstName lastName",
      match: { role: "Teacher" },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCourse = async (req, res) => {
  const { title, description, teacher, startDate, endDate } = req.body;
  try {
    let teacherDoc = null;
    if (teacher) {
      teacherDoc = await User.findOne({ _id: teacher, role: 'Teacher' });
      if (!teacherDoc) {
        return res.status(400).json({ message: "Assigned teacher must be a valid Teacher." });
      }
    }
    const course = await Course.create({
      title,
      description,
      teacher: teacherDoc ? teacherDoc._id : null,
      startDate,
      endDate,
    });

    const notifier = new CourseNotifier();
    notifier.subscribe(new Subscriber(teacherDoc._id));
    await notifier.notify(`You have been assigned to "${course.title}".`);

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { title, description, teacher, startDate, endDate } = req.body;
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "teacher",
      select: "_id role",
      match: { role: "Teacher" },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role !== 'Admin' &&
      !(req.user.role === 'Teacher' && course.teacher && course.teacher._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: "You are not authorized to update this course." });
    }
    let teacherDoc = null;
    if (teacher) {
      teacherDoc = await User.findOne({ _id: teacher, role: 'Teacher' });
      if (!teacherDoc) {
        return res.status(400).json({ message: "Assigned teacher must be a valid Teacher." });
      }
    }
    course.title = title || course.title;
    course.description = description || course.description;
    if (teacher !== undefined) {
      if (teacher) {
        if (!teacherDoc) {
          return res.status(400).json({ message: 'Assigned teacher must be a valid Teacher.' });
        }
        course.teacher = teacherDoc._id;
      } else {
        course.teacher = null;
      }
    }
    if (startDate === '') {
      course.startDate = null;
    } else if (startDate) {
      course.startDate = new Date(startDate);
    }

    if (endDate === '') {
      course.endDate = null;
    } else if (endDate) {
      course.endDate = new Date(endDate);
    }

    const updatedCourse = await course.save();

    const notifier = new CourseNotifier();
    notifier.subscribe(new Subscriber(teacherDoc._id));
    for (const student of (course.students || [])) {
      notifier.subscribe(new Subscriber(student._id));
    }
    await notifier.notify(`Teacher ${teacherDoc.firstName} ${teacherDoc.lastName}  have been assigned to "${course.title}".`);

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.remove();
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
