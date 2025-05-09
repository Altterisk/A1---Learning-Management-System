const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

class UserFactory {
  static async createUser({ role, firstName, lastName, email, password, dateOfBirth, ...rest }) {
    switch (role) {
      case 'Student':
        return await Student.create({ role, firstName, lastName, email, password, dateOfBirth, ...rest });
      case 'Teacher':
        return await Teacher.create({ role, firstName, lastName, email, password, dateOfBirth, ...rest });
      case 'Admin':
        return await Admin.create({ role, firstName, lastName, email, password, dateOfBirth, ...rest });
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}

module.exports = UserFactory;