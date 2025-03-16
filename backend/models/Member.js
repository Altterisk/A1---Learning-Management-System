const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Teacher", "Student"],
  },
  dateOfBirth: { type: Date },
});

module.exports = mongoose.model("Member", memberSchema);
