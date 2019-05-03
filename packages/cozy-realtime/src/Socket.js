/* global WebSocket */
import MicroEE from 'microee'
import pickBy from 'lodash/pickBy'

/**
 * Socket class
 *
 * @class
 */
class Socket {
  /**
   * Doctype name on cozy stack
   *
   * @type {String}
   */
  _doctype = 'io.cozy.websocket'

  /**
   * An opened socket
   *
   * @type {WebSocket}
   */
  _webSocket = null

  /**
   * Cozy Client url
   *
   * @type {String}
   */
  _url = null

  /**
   * Cozy Client token
   *
   * @type {String}
   */
  _token = null

  /**
   * Handle WebSocket
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications#Creating_a_WebSocket_object
   *
   * @constructor
   * @param {String} url  The cozy client url
   * @param {String} token  The cozy client token
   */
  constructor(url, token) {
    this._url = url
    this._token = token

    this.removeAllListeners = this.removeAllListeners.bind(this)
    this.on('close', this.removeAllListeners)
  }

  isOpen() {
    return !!(this._webSocket && this._webSocket.readyState === WebSocket.OPEN)
  }

  updateAuthentication(token) {
    this._token = token
    this.authentication()
  }

  /**
   * Establish a realtime connection
   *
   * @return {Promise}  Promise of the opened websocket
   */
  connect() {
    return new Promise((resolve, reject) => {
      this._webSocket = new WebSocket(this._url, this._doctype)

      this._webSocket.onmessage = event => {
        const data = JSON.parse(event.data)
        const eventName = data.event.toLowerCase()
        const { type, id, doc } = data.payload

        this.emit('message', { type, id, eventName }, doc)
      }

      this._webSocket.onclose = event => this.emit('close', event)

      this._webSocket.onerror = error => {
        this._webSocket = null
        this.emit('error', error)
        reject(error)
      }

      this._webSocket.onopen = event => {
        this.authentication()
        this.emit('open', event)
        resolve(event)
      }
    })
  }

  /**
   * send the authentication message to cozy stack
   *
   * @see https://github.com/cozy/cozy-stack/blob/master/docs/realtime.md#auth
   */
  authentication() {
    if (this.isOpen()) {
      this._webSocket.send(
        JSON.stringify({ method: 'AUTH', payload: this._token })
      )
    }
  }

  /**
   * Send a SUBSCRIBE message to stack
   *
   * @see https://github.com/cozy/cozy-stack/blob/master/docs/realtime.md#subscribe
   *
   * @async
   * @param {String} type  Document doctype to subscribe to
   * @param {String} id  Document id to subscribe to (not required)
   */
  async subscribe(type, id = undefined) {
    if (!this.isOpen()) {
      await this.connect()
    }

    const payload = pickBy({ type, id })

    const message = JSON.stringify({
      method: 'SUBSCRIBE',
      payload
    })

    this._webSocket.send(message)
    this.emit(`subscribe_${type}_${id}`)
  }

  /**
   * Close socket
   */
  close() {
    if (this.isOpen()) {
      this._webSocket.close()
    } else {
      this.removeAllListeners()
    }
    this._webSocket = null
  }
}

MicroEE.mixin(Socket)

export default Socket
