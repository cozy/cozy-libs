/* global WebSocket */
import MicroEE from 'microee'
import pickBy from 'lodash/pickBy'

/**
 * Return websocket url from cozyClient
 *
 * @return {String}  WebSocket url
 */
export const getWebSocketUrl = cozyClient => {
  const isSecureURL = url => !!url.match(`^(https:/{2})`)

  const url = cozyClient.stackClient.uri
  const protocol = isSecureURL(url) ? 'wss:' : 'ws:'
  const host = new URL(url).host

  return `${protocol}//${host}/realtime/`
}

/**
 * Return token from cozyClient
 *
 * @return {String}  token
 */
export const getWebSocketToken = cozyClient =>
  cozyClient.stackClient.token.accessToken || cozyClient.stackClient.token.token

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
  _socket = null

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
  }

  isConnected() {
    return !!(this._socket && this._socket.readyState === WebSocket.OPEN)
  }

  updateAuthentication(token) {
    this._token = token

    if (this.isConnected()) {
      this.authentication()
    }
  }

  /**
   * Establish a realtime connection
   *
   * @return {Promise}  Promise of the opened websocket
   */
  connect() {
    return new Promise((resolve, reject) => {
      this._socket = new WebSocket(this._url, this._doctype)
      const emit = type => event => this.emit(type, event)

      this._socket.onmessage = emit('onmessage')
      this._socket.onclose = emit('onclose')
      this._socket.onerror = error => {
        this._socket = null
        this.emit('onerror', error)
        reject(error)
      }
      this._socket.onopen = event => {
        this.emit('onopen', event)
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
    if (this.isConnected()) {
      this._socket.send(
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
  async subscribe(type, id = null) {
    if (!this.isConnected()) {
      await this.connect()
      this.authentication()
    }

    const payload = pickBy({ type, id })

    const message = JSON.stringify({
      method: 'SUBSCRIBE',
      payload
    })

    this._socket.send(message)
    this.emit('subscribe')
  }

  close() {
    if (this.isConnected()) {
      this._socket.close()
      this._socket = null
    }
  }
}

MicroEE.mixin(Socket)

export default Socket
