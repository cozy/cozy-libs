/* global WebSocket */
import MicroEE from 'microee'

/**
 * separator for internal events
 * @private
 */
const SEP = '//'

/**
 * Handle a realtime socket with the cozy stack
 * Ask for `connect()` to start the socket
 * This class does not handle reconnections.
 * It stops at the first protocol or network error.
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
   * @param {string} stackUrl - Url to the cozy stack
   * @param {token} token - Token for authentication
   * @return {RealtimeSocket}
   */
  async connect(stackUrl, token) {
    const wsUrl = this.getWebsocketUrl(stackUrl)
    const protocols = 'io.cozy.websocket'
    this.connected = new Promise((resolve, reject) => {
      this.socket = new WebSocket(wsUrl, protocols)
      this.socket.onopen = () => this.onConnected(token, resolve)
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
   * Get the websocket URL from a cozy stack URL
   * @private
   * @param {string} stackUrl - the stack full URL
   * @return {string} the websocket URL
   */
  getWebsocketUrl(stackUrl) {
    const isSecure = !!stackUrl.match(`^((http|ws)s:/{2})`)
    const protocol = isSecure ? 'wss:' : 'ws:'
    const host = new URL(stackUrl).host
    return `${protocol}//${host}/realtime/`
  }

  /**
   * What to do when connected
   * @param {string} token - an access token
   * @param {Function} resolve - resolves a connection promise
   * @private
   */
  onConnected(token, resolve) {
    if (token) this.authenticate(token)
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
    this.unsubscribeAll()
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
    const data = JSON.parse(message)
    const eventName = data.event.toLowerCase()
    const { type, id, doc } = data.payload
    const key = this.generateKey(eventName, type)
    this.emit(key, doc)
    if (id) {
      // taken from legacy code, but there sould always be an id
      const idKey = this.generateKey(eventName, type, id)
      this.emit(idKey, doc)
    }
  }

  /**
   * Authenticate with a new token
   * It's caller's responsability to check if the socket is opened
   * @param {string} token - a cozy stack (access|app) token
   */
  authenticate(token) {
    if (token) this.send('AUTH', token)
  }

  /**
   * Get the internal event name for a message context
   * @param {string} eventName - 'created', 'updated', 'deleted'
   * @param {string} type - a doctype
   * @param {string} id - id of a document (optional)
   * @return {string} an event key
   * @private
   */
  generateKey(eventName, type, id) {
    return `${eventName}${SEP}${type}${SEP}${id}`
  }

  /**
   * Get handler and id if id is optional
   * @private
   * @param {Function|string} handlerOrId
   * @param {Function|undefined} handlerOrUndefined
   * @return {Object} `{id, handler}`
   */
  static getHandlerAndId(handlerOrId, handlerOrUndefined) {
    if (handlerOrUndefined && handlerOrId) {
      return { id: handlerOrId, handler: handlerOrUndefined }
    } else {
      return { id: undefined, handler: handlerOrUndefined || handlerOrId }
    }
  }

  /**
   * Subscribe to an event from the stack
   * This class makes no attempt to deduplicate subscriptions.
   * If you send a subscriptions multiple times, your handler *will*
   * be called multiple times. All duplicate subscriptions will however
   * be removed at the same time at the *first* unsubscription call.
   * Be carefull, you can reveive events before the Promise is fullfilled.
   * @param {string} eventName - 'created', 'updated', 'deleted'
   * @param {type} type - a doctype
   * @param {string} handlerOrId - (optional) identifier of a document
   * @param {Function} handlerOrUndefined - handler for the event
   */
  async subscribe(eventName, type, handlerOrId, handlerOrUndefined) {
    const { id, handler } = RealtimeSocket.getHandlerAndId(
      handlerOrId,
      handlerOrUndefined
    )
    const key = this.generateKey(eventName, type, id)
    this.on(key, handler)
    await this.ready
    this.send('SUBSCRIBE', { type, id })
  }

  /**
   * Unubscribe to an event
   * Your handler will not be called anymore for this event but the event
   * will not be unsubcribed from the stack. Updates will still be sent and
   * received over the network until the socket is closed
   * @param {string} eventName - 'created', 'updated', 'deleted'
   * @param {type} type - a doctype
   * @param {string} handlerOrId - (optional) identifier of a document
   * @param {Function} handlerOrUndefined - handler for the event
   */
  unsubscribe(eventName, type, handlerOrId, handlerOrUndefined) {
    const { id, handler } = RealtimeSocket.getHandlerAndId(
      handlerOrId,
      handlerOrUndefined
    )
    const key = this.generateKey(eventName, type, id)
    this.removeListener(key, handler)
    // no way to unsubscribe from the stack
  }

  /**
   * Unsubscribe to all events
   * Your handlers will not be called anymore for this event but the event
   * will not be unsubcribed from the stack. Updates will still be sent and
   * received over the network until the socket is closed
   */
  unsubscribeAll() {
    while (this.subscriptions.length > 0) {
      const { eventName, type, id, handler } = this.subscriptions[0]
      if (id) {
        this.unsubscribe(eventName, type, id, handler)
      } else {
        this.unsubscribe(eventName, type, handler)
      }
    }
  }

  /**
   * Send a message to the cozy stack
   * @param {string} method - message type
   * @param {object} payload
   * @private
   */
  send(method, payload) {
    if (!this.socket) {
      throw new Error('Did you called `connect` before using this socket?')
    }
    if (!this.isOpen()) {
      throw new Error('Trying to used a non open socket')
    }
    this.socket.send(JSON.stringify({ method, payload }))
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
