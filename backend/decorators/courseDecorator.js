class Course {
  constructor(course) {
    this.course = course;
  }

  getDescription() {
    return this.course.description;
  }

  getName() {
    return this.course.title;
  }

}

// This decorator will add a course to a package
class CoursePackageDecorator extends Course {
  constructor(course, packageDetails) {
    super(course);
    this.packageDetails = packageDetails;
  }

  addToPackage() {
    return `Course: ${this.course.title} has been added to the ${this.packageDetails.name} package.`;
  }

  getPackageInfo() {
    return {
      name: this.packageDetails.name,
      description: this.packageDetails.description,
    };
  }
}

// This decorator will apply a discount to a course
class DiscountDecorator extends CoursePackageDecorator {
  constructor(course, packageDetails) {
    super(course, packageDetails);
  }
}

module.exports = { Course, CoursePackageDecorator };