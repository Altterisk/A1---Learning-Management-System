const User = require('./User');
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  description: { type: String, maxlength: 500 },
});

module.exports = User.discriminator('Teacher', teacherSchema);