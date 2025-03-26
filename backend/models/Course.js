const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, },
  description: { type: String, },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: false, default: null},
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model("Course", courseSchema);
