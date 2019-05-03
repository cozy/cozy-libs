import MicroEE from 'microee'
import Socket from './Socket'
import compact from 'lodash/compact'
import minilog from 'minilog'

const logger = minilog('cozy-realtime')
minilog.suggest.deny('cozy-realtime', 'info')

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
  compact([type, eventName, id]).join(INDEX_KEY_SEPARATOR)

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
   * Delay (ms) to retry socket connection
   *
   * @type {Interger}
   */
  _retryDelay = 1000

  /**
   * Limit of socket connection
   */
  _retryLimit = 60

  /**
   * Constructor of CozyRealtime:
   * - Save cozyClient
   * - create socket
   * - listen cozyClient events
   * - unsubscribeAll if window unload
   *
   * @constructor
   * @param {CozyClient} cozyClient  A cozy client
   */
  constructor(cozyClient) {
    this._cozyClient = cozyClient

    this._updateAuthentication = this._updateAuthentication.bind(this)
    this.unsubscribeAll = this.unsubscribeAll.bind(this)
    this._receiveMessage = this._receiveMessage.bind(this)
    this._receiveError = this._receiveError.bind(this)
    this._resubscribe = this._resubscribe.bind(this)
    this._beforeUnload = this._beforeUnload.bind(this)
    this._resetSocket = this._resetSocket.bind(this)

    this._createSocket()

    this._cozyClient.on('login', this._updateAuthentication)
    this._cozyClient.on('tokenRefreshed', this._updateAuthentication)
    this._cozyClient.on('logout', this.unsubscribeAll)

    if (global) {
      global.addEventListener('beforeunload', this._beforeUnload)
      global.addEventListener('online', this._resubscribe)
      global.removeEventListener('offline', this._resetSocket)
    }
  }

  _beforeUnload() {
    global.removeEventListener('beforeunload', this._windowUnload)
    this.unsubscribeAll()
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
      this._socket.on('error', this._receiveError)
    }
  }

  /**
   * When socket send error it test to reconnect
   */
  _receiveError(error) {
    logger.info(`Receive error: ${error}`)

    this._resetSocket()

    if (this._retryLimit === 0) {
      this.emit('error', error)
    } else {
      if (this.retry) {
        clearTimeout(this.retry)
      }
      if (global.navigator.onLine) {
        this.retry = setTimeout(this._resubscribe, this._retryDelay)
      }
    }
  }

  /**
   * Re subscribe on server
   */
  _resubscribe() {
    this._retryLimit--

    const subscribeList = Object.keys(this._events)
      .map(key => {
        if (!key.includes(INDEX_KEY_SEPARATOR)) return
        const [type, , id] = key.split(INDEX_KEY_SEPARATOR)
        return { type, id }
      })
      .filter(Boolean)

    for (const { type, id } of subscribeList) {
      this._socket.subscribe(type, id)
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
  _updateAuthentication() {
    logger.info('Update token on socket')
    const token = getWebSocketToken(this._cozyClient)
    this._socket.updateAuthentication(token)
  }

  /**
   * Reset socket
   */
  _resetSocket() {
    if (this._socket) {
      this._socket.close()
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
  _subscribe(config, handler) {
    return new Promise(resolve => {
      const key = generateKey(config)
      this.on(key, handler)
      this._numberOfHandlers++

      this._socket.once(`subscribe_${config.type}_${config.id}`, resolve)
      this._socket.subscribe(config.type, config.id)
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
  unsubscribe(config, handler = undefined) {
    const keys = [generateKey(config)]

    if (!config.eventName) {
      keys.push(generateKey({ ...config, eventName: EVENT_CREATED }))
      keys.push(generateKey({ ...config, eventName: EVENT_UPDATED }))
      keys.push(generateKey({ ...config, eventName: EVENT_DELETED }))
    }

    for (const key of keys) {
      if (this._events[key]) {
        if (handler) {
          this._numberOfHandlers--
          this.removeListener(key, handler)
        } else {
          this._numberOfHandlers -= this._events[key].length
          this.removeAllListeners(key)
        }
      }
    }

    if (this._numberOfHandlers === 0) {
      this._resetSocket()
    }
  }

  _validateConfig(name, config, authorize) {
    const notAllowed = Object.keys(config).filter(k => !authorize.includes(k))
    if (notAllowed.length > 0) {
      throw new Error(`'${name}' not allow '${notAllowed}' configuration.`)
    }
  }

  onCreate(config, handler) {
    this._validateConfig('onCreate', config, ['type'])

    return this._subscribe({ ...config, eventName: EVENT_CREATED }, handler)
  }

  onUpdate(config, handler) {
    this._validateConfig('onUpdate', config, ['type', 'id'])

    return this._subscribe({ ...config, eventName: EVENT_UPDATED }, handler)
  }

  onDelete(config, handler) {
    this._validateConfig('onUpdate', config, ['type', 'id'])

    return this._subscribe({ ...config, eventName: EVENT_DELETED }, handler)
  }

  /**
   * Unsubscibe all handlers and close socket
   */
  unsubscribeAll() {
    this.removeAllListeners()
    this._numberOfHandlers = 0
    this._resetSocket()
  }
}

MicroEE.mixin(CozyRealtime)

export default CozyRealtime
