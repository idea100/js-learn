class QuestList {
  constructor(maxLength = 10) {
    this.runningQueue = [];
    this.waitQueue = [];
    this.maxLength = maxLength;
  }

  removeRuest(obj) {
    this.runningQueue.splice(this.runningQueue.indexOf(obj), 1)
  }

  pushRequest(obj) {
    this.waitQueue.push(obj);
    this.run();
  }

  run() {
    const {runningQueue, waitQueue, maxLength} = this;
    while(runningQueue.length < maxLength && waitQueue.length > 0) {
      let nextRun = waitQueue.shift();
      const { func, resolve } = nextRun;

      runningQueue.push(nextRun);

      func()
        .then(resolve)
        .finally(() => {
          this.removeRuest(nextRun);
          if (waitQueue.length > 0) {
            this.run()
          }
        });
    }
  }
}

module.exports = function queueFetch(fetchfunc, maxLength) {
  const questList = new QuestList(maxLength);

  return function(...args) {
    return new Promise(resolve => {
      questList.pushRequest({
        func: () => fetchfunc(...args),
        resolve
      });
    });
  }
}
