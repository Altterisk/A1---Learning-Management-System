
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Member = require('../models/Member');
const { updateMember, getMembers, getMember, addMember, deleteMember } = require('../controllers/memberController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddMember Function Test', () => {

  it('should create a new member successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: "El Mofus", role: "Teacher", dateOfBirth: "2018-02-23" }
    };

    // Mock member that would be created
    const createdMember = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Member.create to return the createdMember
    const createStub = sinon.stub(Member, 'create').resolves(createdMember);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addMember(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdMember)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Member.create to throw an error
    const createStub = sinon.stub(Member, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: "El Mofus", role: "Teacher", dateOfBirth: "2018-02-23" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addMember(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});

describe('UpdateMember Function Test', () => {

  it('should update member successfully', async () => {
    // Mock member data
    const memberId = new mongoose.Types.ObjectId();
    const existingMember = {
      _id: memberId,
      name: "El Mofus",
      role: "Teacher",
      dateOfBirth: new Date("2018-02-23"),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Member.findById to return mock member
    const findByIdStub = sinon.stub(Member, 'findById').resolves(existingMember);

    // Mock request & response
    const req = {
      params: { id: memberId },
      body: { name: "El Mofus", role: "Student", dateOfBirth: "1989-07-15" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateMember(req, res);

    // Assertions
    expect(existingMember.name).to.equal("El Mofus");
    expect(existingMember.role).to.equal("Student");
    existingMember.dateOfBirth = new Date(existingMember.dateOfBirth);
    expect(existingMember.dateOfBirth.toISOString()).to.equal(new Date("1989-07-15").toISOString());
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if member is not found', async () => {
    const findByIdStub = sinon.stub(Member, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateMember(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Member not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Member, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateMember(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});
describe('GetMembers Function Test', () => {

  it('should return members for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock member data
    const members = [
      { _id: new mongoose.Types.ObjectId(), name: "El Mofus", role: "Teacher", userId, dateOfBirth: new Date("2018-02-23")},
      { _id: new mongoose.Types.ObjectId(), name: "Crook Mofus", role: "Student", userId, dateOfBirth: new Date("1989-07-15") }
    ];

    // Stub Member.find to return mock members
    const findStub = sinon.stub(Member, 'find').resolves(members);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getMembers(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(members)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Member.find to throw an error
    const findStub = sinon.stub(Member, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getMembers(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteMember Function Test', () => {

  it('should delete a member successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock member found in the database
    const member = { remove: sinon.stub().resolves() };

    // Stub Member.findById to return the mock member
    const findByIdStub = sinon.stub(Member, 'findById').resolves(member);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteMember(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(member.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Member deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if member is not found', async () => {
    // Stub Member.findById to return null
    const findByIdStub = sinon.stub(Member, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteMember(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Member not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Member.findById to throw an error
    const findByIdStub = sinon.stub(Member, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteMember(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});

describe('GetMember Function Test', () => {

  it('should return a single member successfully', async () => {
    // Mock member data
    const memberId = new mongoose.Types.ObjectId();
    const mockMember = {
      _id: memberId,
      name: "EL Mofus",
      role: "Teacher",
      dateOfBirth: new Date("2018-02-23"),
    };

    // Stub Member.findById to return the mock member
    const findByIdStub = sinon.stub(Member, 'findById').resolves(mockMember);

    // Mock request & response
    const req = { params: { id: memberId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getMember(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(memberId)).to.be.true;
    expect(res.json.calledWith(mockMember)).to.be.true;
    expect(res.status.called).to.be.false;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if member is not found', async () => {
    // Stub Member.findById to return null (member not found)
    const findByIdStub = sinon.stub(Member, 'findById').resolves(null);

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getMember(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Member not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Member.findById to throw an error
    const findByIdStub = sinon.stub(Member, 'findById').throws(new Error('DB Error'));

    // Mock request & response
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await getMember(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});