class CourseNotifier {
  constructor() {
    this.subscribers = [];
  }

  subscribe(observer) {
    this.subscribers.push(observer);
  }

  unsubscribe(observer) {
    this.subscribers = this.subscribers.filter(sub => sub.userId !== observer.userId);
  }

  async notify(message) {
    for (const subscriber of this.subscribers) {
      await subscriber.update(message);
    }
  }
}

module.exports = CourseNotifier;