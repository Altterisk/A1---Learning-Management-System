const Notification = require('../models/Notification');

class Subscriber {
  constructor(userId) {
    this.userId = userId;
  }

  async update(message) {
    await Notification.create({
      user: this.userId,
      message
    });
  }
}

module.exports = Subscriber;