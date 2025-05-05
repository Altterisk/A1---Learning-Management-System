
class RoleStrategyContext {
  constructor(user) {
    this.user = user;
    this.strategy = this.getStrategy(user.role);
  }

  getStrategy(role) {
    switch (role) {
      case 'Admin':
        return new AdminStrategy();
      case 'Teacher':
        return new TeacherStrategy();
      case 'Student':
        return new StudentStrategy();
      default:
        throw new Error("Access Denied: Invalid role.");
    }
  }

  getFilter() {
    if (!this.strategy) {
      throw new Error("Strategy not found.");
    }
    return this.strategy.getFilter(this.user);
  }
}

class UserRoleStrategy {
  getFilter(user) {
    throw new Error("Method 'getFilter()' must be implemented.");
  }
}

class StudentStrategy extends UserRoleStrategy {
  getFilter(user) {
    return { role: 'Student' };
  }
}

class TeacherStrategy extends UserRoleStrategy {
  getFilter(user) {
    return { $or: [{ role: 'Teacher' }, { role: 'Student' }] };
  }
}

class AdminStrategy extends UserRoleStrategy {
  getFilter(user) {
    return {};
  }
}

module.exports = RoleStrategyContext;