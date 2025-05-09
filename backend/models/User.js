const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = {
    discriminatorKey: 'role',
    collection: 'users',
};

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 255 },
    lastName: { type: String, required: true, maxlength: 255 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    role: { type: String, required: true, enum: ['Student', 'Teacher', 'Admin'] }
}, options);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);