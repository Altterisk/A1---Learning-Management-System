const Course = require("../models/Course");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id }).populate({
      path: "teacher",
      select: "name",
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
      select: "name",
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
    const course = await Course.create({
      userId: req.user.id,
      title,
      description,
      teacher,
      startDate,
      endDate,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { title, description, teacher, startDate, endDate } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.title = title || course.title;
    course.description = description || course.description;
    course.teacher = teacher || course.teacher; // Update teacher if provided
    course.startDate = startDate ? new Date(startDate) : course.startDate;
    course.endDate = endDate ? new Date(endDate) : course.endDate;

    const updatedCourse = await course.save();
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
