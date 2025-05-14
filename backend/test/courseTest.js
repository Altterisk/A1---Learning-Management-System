const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Course = require('../models/Course');
const { updateCourse, getCourses, getCourse, addCourse, deleteCourse } = require('../controllers/courseController');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { expect } = chai;


chai.use(chaiHttp);
let server;
let port;

describe('AddCourse Function Test', () => {

  it('should create a new course successfully', async () => {
    // Mock request data
    const teacherId = new mongoose.Types.ObjectId();
    const req = {
      body: { title: "Divine Magic 101", description: "Basic Healing Spells", teacher: new mongoose.Types.ObjectId(), startDate: "2025-02-24", endDate: "2025-06-27" }
    };

    // Mock course that would be created
    const teacherDoc = { _id: teacherId, role: 'Teacher' };
    const createdCourse = { _id: new mongoose.Types.ObjectId(), ...req.body };

    // Mock User.findOne to simulate finding the teacher
    const userStub = sinon.stub(User, 'findOne').resolves(teacherDoc);

    // Mock Course.create
    const courseStub = sinon.stub(Course, 'create').resolves(createdCourse);

    // Stub CourseNotifier and Subscriber
    const notificationStub = sinon.stub(Notification, 'create').resolves({});

    // Mock response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await addCourse(req, res);

    expect(courseStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdCourse)).to.be.true;

    // Restore stubbed methods
    notificationStub.restore();
    courseStub.restore();
    userStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.create to throw an error
    const teacherId = new mongoose.Types.ObjectId();
    const teacherDoc = { _id: teacherId, role: 'Teacher' };
    const userStub = sinon.stub(User, 'findOne').resolves(teacherDoc);
    const createStub = sinon.stub(Course, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "Divine Magic 101", description: "Basic Healing Spells", teacher: new mongoose.Types.ObjectId(), startDate: "2025-02-24", endDate: "2025-06-27" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
    userStub.restore();
  });

});

describe('UpdateCourse Function Test', () => {

  it('should update course successfully', async () => {
    // Mock course data
    const courseId = new mongoose.Types.ObjectId();
    const newTeacherId = new mongoose.Types.ObjectId();
    const teacherDoc = {
      _id: newTeacherId,
      role: 'Teacher',
      firstName: 'John',
      lastName: 'Doe'
    };
    const existingCourse = {
      _id: courseId,
      title: "Divine Magic 101",
      description: "Basic Healing Spells",
      teacher: new mongoose.Types.ObjectId(),
      startDate: new Date("2025-02-24"),
      endDate: new Date("2025-06-27"),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Course.findById to return mock course
    const findByIdStub = sinon.stub(Course, 'findById').returns({
      populate: sinon.stub().resolves(existingCourse)
    });
    const userStub = sinon.stub(User, 'findOne').resolves(teacherDoc);
    const notificationStub = sinon.stub(Notification, 'create').resolves({});

    // Mock request & response
    const req = {
      params: { id: courseId },
      body: { title: "Divine Magic 102", description: "Purification and Exorcism Spells", teacher: newTeacherId, startDate: "2025-02-24", endDate: "2025-06-27" },
      user: {
        role: 'Admin',
        id: newTeacherId.toString()
      }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateCourse(req, res);

    console.log(res)

    // Assertions
    expect(existingCourse.title).to.equal("Divine Magic 102");
    expect(existingCourse.description).to.equal("Purification and Exorcism Spells");
    expect(existingCourse.teacher.toString()).to.equal(req.body.teacher.toString());
    existingCourse.startDate = new Date(existingCourse.startDate); 
    expect(existingCourse.startDate.toISOString()).to.equal(new Date(req.body.startDate).toISOString());
    existingCourse.endDate = new Date(existingCourse.endDate); 
    expect(existingCourse.endDate.toISOString()).to.equal(new Date(req.body.endDate).toISOString());
    expect(res.status.called).to.be.false;
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    notificationStub.restore();
    userStub.restore();
    findByIdStub.restore();
  });

  it('should return 404 if course is not found', async () => {
    const findByIdStub = sinon.stub(Course, 'findById').returns({
      populate: sinon.stub().resolves(null)
    });

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateCourse(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateCourse(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});

describe('GetCourses Function Test', () => {

  it('should return all courses', async () => {
    // Mock course data
    const courses = [
      { _id: new mongoose.Types.ObjectId(), title: "Divine Magic 101", description: "Basic Healing Spells", startDate: new Date("2025-02-24"), endDate: new Date("2025-06-27") },
      { _id: new mongoose.Types.ObjectId(), title: "Elemental Magic 101", description: "Basic Fire and Ice Spells", startDate: new Date("2025-02-24"), endDate: new Date("2025-06-27") }
    ];

    // Stub Course.find to return mock courses
    const findStub = sinon.stub(Course, 'find').returns({
      populate: sinon.stub().withArgs('teacher').returnsThis(),
      then: sinon.stub().yields(courses)
    });

    // Mock request & response
    const req = {}; // No need for user ID anymore
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getCourses(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(courses)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Course.find to throw an error
    const findStub = sinon.stub(Course, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getCourses(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('DeleteCourse Function Test', () => {

  it('should delete a course successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock course found in the database
    const course = { remove: sinon.stub().resolves() };

    // Stub Course.findById to return the mock course
    const findByIdStub = sinon.stub(Course, 'findById').resolves(course);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(course.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Course deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if course is not found', async () => {
    // Stub Course.findById to return null
    const findByIdStub = sinon.stub(Course, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.findById to throw an error
    const findByIdStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('GetCourse Function Test', () => {

  it('should return a single course successfully', async () => {
    // Mock course data
    const courseId = new mongoose.Types.ObjectId();
    const mockCourse = {
      _id: courseId,
      title: "Divine Magic 101",
      description: "Basic Healing Spells",
      teacher: new mongoose.Types.ObjectId(),
      startDate: new Date("2025-02-24"),
      endDate: new Date("2025-06-27"),
    };

    // Stub Course.findById to return the mock course
    const findByIdStub = sinon.stub(Course, 'findById').returns({
      populate: sinon.stub().withArgs('teacher').returnsThis(),
      then: sinon.stub().yields(mockCourse)
    });

    // Mock request & response
    const req = { params: { id: courseId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(courseId)).to.be.true;
    expect(res.json.calledWith(mockCourse)).to.be.true;
    expect(res.status.called).to.be.false;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if course is not found', async () => {
    // Stub Course.findById to return null (course not found)
    const findByIdStub = sinon.stub(Course, 'findById').returns({
      populate: sinon.stub().withArgs('teacher').returnsThis(),
      then: sinon.stub().yields(null)
    });

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.findById to throw an error
    const findByIdStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});