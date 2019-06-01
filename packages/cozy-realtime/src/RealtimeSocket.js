/* global WebSocket */
import MicroEE from 'microee'

/**
 * Handle a realtime socket
 * Ask for `connect()` to start the socket
 * @class
 */
class RealtimeSocket {
  /**
   * The raw websocket instance
   * @type {WebSocket}
   * @private
   */
  socket = null

  /**
   * Fullfill when the socket has connected
   * @type {Promise}
   * @private
   */
  connected = null

  /**
   * Fullfill when the socket is ready to use
   * @type {Promise}
   * @private
   */
  ready = null

  /**
   * Start the socket and connect
   * @param {string} wsUrl - Url to the websocket server
   * @return {RealtimeSocket}
   */
  async connect(wsUrl) {
    this.connected = new Promise((resolve, reject) => {
      this.socket = new WebSocket(wsUrl)
      this.socket.onopen = () => this.onConnected(resolve)
      this.socket.onerror = event => this.onError(event, reject)
      this.socket.onclose = event => this.onClose(event)
      this.socket.onmessage = event => this.onMessage(event.data)
    })
    this.connected.catch(e => this.onError(e))
    this.ready = this.connected.then(
      // do not assume it's open, it may has errored since the previous step
      () => {
        if (this.isOpen()) this.emit('open', this)
      }
    )
    await this.ready
    return this
  }

  /**
   * Promise resolved when the socket is ready to read|write
   * @return {RealtimeSocket}
   */
  async whenReady() {
    await this.ready
    return this
  }

  /**
   * What to do when connected
   * @param {Function} resolve - resolves a connection promise
   * @private
   */
  onConnected(resolve) {
    resolve(this)
  }

  /**
   * What to do after an error
   * @param {ErrorEvent} error - websocket error
   * @param {Function} reject - rejects a connection promise
   * @private
   */
  onError(error, reject) {
    this.emit('error', this, error)
    this.close()
    if (reject) reject(error)
  }

  /**
   * Cleanly the realtime socket
   * @param {Event} event - source event (close or event), if any
   * @private
   */
  onClose(event) {
    if (this.socket) {
      this.socket.onmessage = () => {}
      this.socket.onerror = () => {}
      this.socket.onopen = () => {}
      this.socket.onclose = () => {}
    }
    this.emit('close', this, event)
    this.removeAllListeners()
    this.socket = null
    this.ready = Promise.reject(event || true)
    // this line only to avoid an "unhandled rejection"
    this.ready.catch(err => err)
  }

  /**
   * Handle a message from the stack
   * Dispatch it to the correct subscribed handlers
   * @param {string} message
   * @private
   */
  onMessage(message) {
    this.emit('message', message)
  }

  /**
   * Cleanly close the socket
   */
  close() {
    const socket = this.socket
    this.onClose()
    if (socket) socket.close()
  }

  /**
   * Is the internal websocket open for read/write?
   * @private
   * @return {boolean}
   */
  isOpen() {
    return this.socket && this.socket.readyState === WebSocket.OPEN
  }
}

MicroEE.mixin(RealtimeSocket)

export default RealtimeSocket
