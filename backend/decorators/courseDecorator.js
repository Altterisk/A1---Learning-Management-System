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

module.exports = { Course, CoursePackageDecorator };