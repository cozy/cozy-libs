import {
  maxConcurrentBackgroundHandshakes,
  backgroundHandshakeSlotTimeout
} from './config'
import defaultLogger from './logger'

/**
 * Limits how many WebSocket handshakes may be in flight at the same time.
 *
 * A handshake that never completes still occupies a slot in the browser's
 * WebSocket budget until the browser's own handshake timeout expires (240s in
 * Chrome), and calling `close()` on it does not release that slot any earlier.
 * So the only way to stay under the budget is to open fewer of them at once:
 * this queue caps the number of concurrent handshakes and serialises the rest.
 *
 * When every connection is healthy a handshake takes a few tens of
 * milliseconds, so the queue is effectively invisible. It only starts holding
 * connections back once handshakes stop completing, which is exactly the
 * situation where opening more of them makes things worse.
 *
 * A queue only limits the connections it is given to, so whoever opens a group
 * of connections owns one queue and passes it to each of them.
 */
class HandshakeQueue {
  /**
   * @constructor
   * @param {object} options
   * @param {number} [options.maxConcurrent] - How many handshakes may run at once
   * @param {number} [options.slotTimeout] - How long to keep waiting on a handshake before letting the next queued one start
   * @param {object} [options.logger] - A custom logger
   */
  constructor({ maxConcurrent, slotTimeout, logger } = {}) {
    this.maxConcurrent = maxConcurrent ?? maxConcurrentBackgroundHandshakes
    this.slotTimeout = slotTimeout ?? backgroundHandshakeSlotTimeout
    this.logger = logger || defaultLogger
    this.inFlight = 0
    this.waiting = []
  }

  /**
   * Waits for a free slot.
   *
   * @returns {Promise<{release: Function}>} a handle whose `release()` gives
   * the slot back. Releasing twice is a no-op.
   */
  acquire() {
    return new Promise(resolve => {
      this.waiting.push(() => resolve(this.grant()))
      this.pump()
    })
  }

  /**
   * @private
   */
  grant() {
    this.inFlight = this.inFlight + 1
    let released = false

    const release = () => {
      if (released) return
      released = true
      global.clearTimeout(timer)
      this.inFlight = this.inFlight - 1
      this.pump()
    }

    // We cannot make the browser drop a stalled handshake, but we can stop the
    // queue from being held hostage by it: after this delay we consider the
    // slot lost and let the next connection try.
    const timer = global.setTimeout(() => {
      this.logger.warn(
        `a handshake is still pending after ${this.slotTimeout}ms, releasing its queue slot`
      )
      release()
    }, this.slotTimeout)

    return { release }
  }

  /**
   * @private
   */
  pump() {
    while (this.inFlight < this.maxConcurrent && this.waiting.length > 0) {
      const next = this.waiting.shift()
      next()
    }
  }
}

export default HandshakeQueue
