import Socket, { getWebSocketUrl, getWebSocketToken } from './Socket'
import Subscriptions from './Subscriptions'

class Realtime {
  /**
   * A cozy client
   *
   * @type {CozyClient}
   */
  _cozyClient = null

  /**
   * A subscriptions class
   *
   * @type {Subscriptions}
   */
  _subscriptions = null

  /**
   * A Socket class
   *
   * @type {Socket}
   */
  _socket = null

  /**
   * Create a realtime
   *
   * @constructor
   * @param {CozyClient} cozyClient  A cozy client
   */
  constructor(cozyClient) {
    this._cozyClient = cozyClient
    this._cozyClient.on('login', this._createSocket)
    this._cozyClient.on('tokenRefreshed', this._updateSocketAuthentication)
    this._cozyClient.on('logout', this.unsubscribeAll)

    this._subscriptions = new Subscriptions()
    this._subscriptions.on('noSubscription', this._closeSocket.bind(this))
    this._subscriptions.on('subscribed', options => {
      if (!this._socket) {
        this._createSocket()
      }
      this._socket.subscribe(options.type, options.id)
    })
  }

  _createSocket() {
    if (!this._socket) {
      const url = getWebSocketUrl(this._cozyClient)
      const token = getWebSocketToken(this._cozyClient)

      this._socket = new Socket(url, token)
      this._socket.on(
        'onmessage',
        this._subscriptions.receivedMessage.bind(this._subscriptions)
      )
    }
  }

  _updateSocketAuthentication() {
    if (!this._socket) {
      this._createSocket()
    }

    const token = getWebSocketToken(this._cozyClient)
    this._socket.updateAuthentication(token)
  }

  /**
   * Remove the given handler from the list of handlers for given
   * doctype/document and event.
   *
   * @param  {String}  type      Document doctype to subscribe to
   * @param  {String}  id        Document id to subscribe to
   * @param  {String}  eventName Event to subscribe to
   * @param  {Function}  handler   Function to call when an event of the
   * given type on the given doctype or document is received from stack.
   * @return {Promise}           Promise that the message has been sent.
   */
  subscribe(options, handler) {
    return new Promise(resolve => {
      if (!this._socket) {
        this._createSocket()
      }
      this._socket.once('subscribe', resolve)
      this._subscriptions.subscribe(options, handler)
    })
  }

  /**
   * Remove the given handler from the list of handlers for given
   * doctype/document and event.
   * @param  {String}  type      Document doctype to unsubscribe from
   * @param  {String}  id        Document id to unsubscribe from
   * @param  {String}  eventName Event to unsubscribe from
   * @param  {Function}  handler   Function to call when an event of the
   * given type on the given doctype or document is received from stack.
   */
  unsubscribe(options, handler) {
    return new Promise(resolve => {
      this._socket.once('onclose', resolve)
      this._subscriptions.once('numberOfHandlers', numberOfHandlers => {
        if (numberOfHandlers > 0) {
          this._socket.removeListener('onclose', resolve)
          resolve()
        }
      })
      this._subscriptions.unsubscribe(options, handler)
    })
  }

  unsubscribeAll() {
    return new Promise(resolve => {
      if (this._socket && this._socket.isConnected()) {
        this._socket.once('onclose', resolve)
      }
      this._subscriptions.unsubscribeAll()
      if (!this._socket) {
        resolve()
      }
    })
  }

  _closeSocket() {
    if (this._socket) {
      if (this._socket.isConnected()) {
        this._socket.close()
      }
      this._socket = null
    }
  }
}

export default Realtime
