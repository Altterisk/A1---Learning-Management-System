const User = require('./User');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
});

module.exports = User.discriminator('Admin', adminSchema);