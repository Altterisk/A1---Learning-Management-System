const User = require('./User');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  major: { type: String, default: 'Not Decided' }
});

module.exports = User.discriminator('Student', studentSchema);