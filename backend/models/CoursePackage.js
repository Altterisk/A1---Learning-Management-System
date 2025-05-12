// CoursePackage model
const mongoose = require("mongoose");

const coursePackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model("CoursePackage", coursePackageSchema);

