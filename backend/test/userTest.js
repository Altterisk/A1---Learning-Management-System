
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const User = require('../models/User');
const { updateUser, getUsers, getUser, addUser, deleteUser } = require('../controllers/authController');
const Teacher = require('../models/Teacher');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddUser Function Test', () => {

  it('should create a new user successfully', async () => {
    // Mock request data
    const req = {
      body: { firstName: "El", lastName: "Mofus", email: "el@gmail.com", role: "Teacher", dateOfBirth: "2018-02-23" }
    };

    // Mock user that would be created
    const createdUser = { _id: new mongoose.Types.ObjectId(), ...req.body };

    
    // Stub User.findOne to return null (no existing user)
    const findOneStub = sinon.stub(User, 'findOne').resolves(null);

    // Stub User.create to return the createdUser
    const createStub = sinon.stub(Teacher, 'create').resolves(createdUser);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addUser(req, res);

    // Assertions
    expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
    expect(createStub.calledOnce).to.be.true;
    const createArg = createStub.firstCall.args[0];
    
    // Check the controlled fields
    expect(createArg.firstName).to.equal(req.body.firstName);
    expect(createArg.lastName).to.equal(req.body.lastName);
    expect(createArg.email).to.equal(req.body.email);
    expect(createArg.role).to.equal(req.body.role);
    expect(createArg.dateOfBirth).to.equal(req.body.dateOfBirth);
    
    // Check that password exists and is a string
    expect(createArg.password).to.be.a('string');
    expect(createArg.password.length).to.be.greaterThan(0);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(sinon.match.hasNested('user._id'))).to.be.true;
    expect(res.json.firstCall.args[0].user.email).to.equal(req.body.email);

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.create to throw an error
    const createStub = sinon.stub(Teacher, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { firstName: "El", lastName: "Mofus", email: "el@gmail.com", password: "123456", role: "Teacher", dateOfBirth: "2018-02-23" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addUser(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

describe('UpdateUser Function Test', () => {

  it('should update user successfully', async () => {
    // Mock user data
    const userId = new mongoose.Types.ObjectId();
    const existingUser = {
      _id: userId,
      firstName: "El", lastName: "Mofus",
      role: "Teacher",
      email: "el@gmail.com",
      password: "123456",
      dateOfBirth: new Date("2018-02-23"),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub User.findById to return mock user
    const findByIdStub = sinon.stub(User, 'findById').resolves(existingUser);

    // Mock request & response
    const req = {
      params: { id: userId },
      body: { firstName: "El", lastName: "Mofus", email: "el@gmail.com", password: "123456", role: "Student", dateOfBirth: "1989-07-15" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateUser(req, res);

    // Assertions
    expect(existingUser.firstName).to.equal("El");
    expect(existingUser.lastName).to.equal("Mofus");
    expect(existingUser.role).to.equal("Student");
    expect(existingUser.email).to.equal("el@gmail.com");
    existingUser.dateOfBirth = new Date(existingUser.dateOfBirth);
    expect(existingUser.dateOfBirth.toISOString()).to.equal(new Date("1989-07-15").toISOString());
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if user is not found', async () => {
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateUser(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});
describe('GetUsers Function Test', () => {

  it('should return users', async () => {

    // Mock user data
    const users = [
      { _id: new mongoose.Types.ObjectId(), firstName: "El", lastName: "Mofus", email: "el@gmail.com", password: "123456", role: "Teacher", dateOfBirth: new Date("2018-02-23")},
      { _id: new mongoose.Types.ObjectId(), firstName: "Crook", lastName: "Mofus", email: "crook@gmail.com", password: "123456", role: "Student", dateOfBirth: new Date("1989-07-15") }
    ];

    // Stub User.find to return mock users
    const findStub = sinon.stub(User, 'find').resolves(users);

    // Mock request & response
    const req = {  };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getUsers(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(users)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub User.find to throw an error
    const findStub = sinon.stub(User, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getUsers(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteUser Function Test', () => {

  it('should delete a user successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock user found in the database
    const user = { remove: sinon.stub().resolves() };

    // Stub User.findById to return the mock user
    const findByIdStub = sinon.stub(User, 'findById').resolves(user);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteUser(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(user.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'User deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if user is not found', async () => {
    // Stub User.findById to return null
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteUser(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.findById to throw an error
    const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteUser(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('GetUser Function Test', () => {

  it('should return a single user successfully', async () => {
    // Mock user data
    const userId = new mongoose.Types.ObjectId();
    const mockUser = {
      _id: userId,
      name: "EL Mofus",
      email: "el@gmail.com", 
      password: "123456",
      role: "Teacher",
      dateOfBirth: new Date("2018-02-23"),
    };

    // Stub User.findById to return the mock user
    const findByIdStub = sinon.stub(User, 'findById').resolves(mockUser);

    // Mock request & response
    const req = { params: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getUser(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(userId)).to.be.true;
    expect(res.json.calledWith(mockUser)).to.be.true;
    expect(res.status.called).to.be.false;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if user is not found', async () => {
    // Stub User.findById to return null (user not found)
    const findByIdStub = sinon.stub(User, 'findById').resolves(null);

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getUser(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.findById to throw an error
    const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getUser(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});