import MicroEE from 'microee'
import Socket from './Socket'
import compact from 'lodash/compact'

export const EVENT_CREATED = 'created'
export const EVENT_UPDATED = 'updated'
export const EVENT_DELETED = 'deleted'

const INDEX_KEY_SEPARATOR = '\\'

/**
 * Generate a key for an event
 *
 * @return {String}  Event key
 */
export const generateKey = ({ type, id, eventName }) =>
  compact([type, id, eventName]).join(INDEX_KEY_SEPARATOR)

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

/**
 * CozyRealtime class
 *
 * @class
 */
class CozyRealtime {
  /**
   * A cozy client
   *
   * @type {CozyClient}
   */
  _cozyClient = null

  /**
   * Number of handlers
   *
   * @type {Subscriptions}
   */
  _numberOfHandlers = 0

  /**
   * A Socket class
   *
   * @type {Socket}
   */
  _socket = null

  /**
   * Constructor of CozyRealtime:
   * - Save cozyClient
   * - create socket
   * - listen cozyClient event
   *
   * @constructor
   * @param {CozyClient} cozyClient  A cozy client
   */
  constructor(cozyClient) {
    this._cozyClient = cozyClient

    this._updateSocketAuthentication = this._updateSocketAuthentication.bind(this)
    this.unsubscribeAll = this.unsubscribeAll.bind(this)
    this._receiveMessage = this._receiveMessage.bind(this)

    this._createSocket()

    this._cozyClient.on('login', this._updateSocketAuthentication)
    this._cozyClient.on('tokenRefreshed', this._updateSocketAuthentication)
    this._cozyClient.on('logout', this.unsubscribeAll)
  }

  /**
   * Create a Socket with cozyClient credential
   */
  _createSocket() {
    if (!this._socket) {
      const url = getWebSocketUrl(this._cozyClient)
      const token = getWebSocketToken(this._cozyClient)

      this._socket = new Socket(url, token)
      this._socket.on('message', this._receiveMessage)
    }
  }

  /**
   * Launch handlers
   */
  _receiveMessage({ type, id, eventName }, doc) {
    const keys = [generateKey({ type, eventName })]
    if (id) {
      keys.push(generateKey({ type, id, eventName }))
    }
    for (const key of keys) {
      this.emit(key, doc)
    }
  }

  /**
   * Update token on socket
   */
  _updateSocketAuthentication() {
    const token = getWebSocketToken(this._cozyClient)
    this._socket.updateAuthentication(token)
  }

  /**
   * Launch close socket if no handler
   */
  _closeSocketIfNoHandler() {
    if (this._numberOfHandlers === 0) {
      this._closeSocket()
    }
  }

  /**
   * Close socket
   */
  _closeSocket() {
    if (this._socket) {
      if (this._socket.isOpen()) {
        this._socket.close()
      }
      this._socket = null
    }
    this._createSocket()
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
    const key = generateKey(options)

    return new Promise(resolve => {
      this.on(key, handler)
      this._numberOfHandlers++

      this._socket.once('subscribe', resolve)
      this._socket.subscribe(options.type, options.id)
    })
  }

  /**
   * Remove the given handler from the list of handlers for given
   * doctype/document and event.
   *
   * @param {String}  type      Document doctype to unsubscribe from
   * @param {String}  id        Document id to unsubscribe from
   * @param {String}  eventName Event to unsubscribe from
   * @param {Function}  handler   Function to call when an event of the
   * given type on the given doctype or document is received from stack.
   */
  unsubscribe(options, handler) {
    const key = generateKey(options)

    return new Promise(resolve => {
      this._socket.once('close', resolve)
      this.removeListener(key, handler)
      this._numberOfHandlers--
      this._closeSocketIfNoHandler()
    })
  }

  /**
   * Unsubscibe all handlers and close socket
   */
  unsubscribeAll() {
    this.removeAllListeners()
    this._numberOfHandlers = 0
    this._closeSocket()
  }
}

MicroEE.mixin(CozyRealtime)

export default CozyRealtime
