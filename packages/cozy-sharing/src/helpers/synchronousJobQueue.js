export class SynchronousJobQueue {
  constructor() {
    this.isRunning = false
    this.queue = []
  }

  push(job) {
    this.queue.push(job)
    if (!this.isRunning) {
      this.run()
    }
  }

  async run() {
    this.isRunning = true
    while (this.queue.length > 0) {
      const job = this.queue.shift()
      await job.function(job.arguments)
    }
    this.isRunning = false
  }
}
