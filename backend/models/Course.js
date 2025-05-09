const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, },
  description: { type: String, },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null},
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model("Course", courseSchema);
