/* global WebSocket */
import extend from 'lodash/extend'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'

import { isSecureURL } from './helpers/url'
import RealtimeSubscriptions from './RealtimeSubscriptions'
import Validator, {
  isBoolean,
  isRequired,
  isRequiredIfNo,
  isString,
  isURL
} from './helpers/Validator'

const MAX_RETRIES = 3
const RETRY_BASE_DELAY = 1000

export class CozyRealtime {
  /**
   * Log were subcribe messages sent are recored
   * @type {Array}
   */
  _log = []

  /**
   * Promise of an opnened socket
   * @type {Promise}
   */
  _socketPromise = null

  /**
   * Realtime subscriptions
   * @type {RealtimeSubscriptions}
   */
  _subscriptions = null

  _retries = 0
  _retryDelay = RETRY_BASE_DELAY

  /**
   * Open a WebSocket
   * @constructor
   * @param {String}  domain        The cozy domain
   * @param {Boolean} [secure=true] Indicates either the WebSocket should be
   * secure or not
   * @param {String}  token         The Application token
   * @param {String}  url           URL of the cozy. Can be used in place of
   * domain and secure parameters
   */
  constructor({ domain, secure = true, token, url, onError, onDisconnect }) {
    Validator.create({
      domain: [isRequiredIfNo(['url']), isString],
      secure: [isBoolean],
      token: [isRequired, isString],
      url: [isRequiredIfNo(['domain']), isURL]
    }).validate({ domain, secure, token, url })

    this._domain = domain || new URL(url).host

    this._secure = url ? isSecureURL(url) : secure
    this._token = token
    this._url = url

    this._onError = onError
    this._onDisconnect = onDisconnect

    this._subscriptions = new RealtimeSubscriptions()
    this._connect()
  }

  /**
   * Returns an instance of CozyRealtime. Can be used instead of
   * `new CozyRealtime`.
   * @static
   * @param  {Object} options Object containing domain, secure, token and url
   * parameters
   * @return {CozyRealtime}         CozyRealtime instance
   */
  static init(options) {
    return new CozyRealtime(options)
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
  subscribe({ type, id }, eventName, handler) {
    if (typeof handler !== 'function')
      throw new Error('Realtime event handler must be a function')

    this._subscriptions.addHandler({ type, id }, eventName, handler)

    return this._sendSubscribeMessage({ type, id })
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
  unsubscribe({ type, id }, eventName, handler) {
    this._subscriptions.removeHandler({ type, id }, eventName, handler)
  }

  /**
   * Establish a realtime connection
   * @return {Promise} Promise of the opened websocket
   */
  _connect() {
    this._socketPromise = new Promise((resolve, reject) => {
      const protocol = this._secure ? 'wss:' : 'ws:'
      const socket = this._createWebSocket(
        `${protocol}//${this._domain}/realtime/`,
        'io.cozy.websocket'
      )

      socket.onmessage = this._handleSocketMessage.bind(this)
      socket.onclose = this._handleSocketClose.bind(this)
      socket.onerror = error => {
        this._handleError(error)
        reject(error)
      }
      socket.onopen = () => {
        this._handleSocketOpen(socket)
        resolve(socket)
      }
    })

    return this._socketPromise
  }

  /**
   * Proxy for instanciating a new WebSocket
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications#Creating_a_WebSocket_object
   * @return {WebSocket}   The instanciated WebSocket
   */
  _createWebSocket(url, protocols) {
    return new WebSocket(url, protocols)
  }

  /**
   * Handles error
   * @param {Error} error
   */
  _handleError(error) {
    if (typeof this._onError === 'function') {
      this._onError(error)
    }
  }

  /**
   * Handles a socket closing
   * @param  {CloseEvent} event
   */
  _handleSocketClose(event) {
    // Set to null to know that it is not available anymore.
    this._socketPromise = null
    this._stopListenningUnload()

    if (!event.wasClean) {
      this._retry(event)
    }
  }

  /**
   * Handle a socket opening, send the authentification message to cozy
   * stack, and a subribe message for every subscriptions that have been made.
   * @param  {WebSocket} socket]
   */
  _handleSocketOpen(socket) {
    // Reset _retries
    this._retries = 0
    this._retryDelay = RETRY_BASE_DELAY

    // Reset record of sent subscribe messages
    this._log = []

    this._listenUnload(socket)

    socket.send(
      JSON.stringify({
        method: 'AUTH',
        payload: this._token
      })
    )

    // Once the socket is open, we send subscribe message
    // from current subscription.
    // Useful if the socket opened after the first subscribe() call,
    // or in case of a reconnection.
    for (const selector of this._subscriptions.toSubscribeMessages())
      this._sendSubscribeMessage(selector)
  }

  /**
   * Handle a message from stack
   * @param {MessageEvent} event
   */
  _handleSocketMessage(event) {
    const data = JSON.parse(event.data)
    const eventName = data.event.toLowerCase()
    const payload = data.payload

    if (eventName === 'error') {
      const realtimeError = new Error(payload.title)
      extend(realtimeError, pick(payload, ['code', 'source', 'status']))
      return this._handleError(realtimeError)
    }

    this._subscriptions.handle(
      pick(payload, ['type', 'id']),
      eventName,
      payload.doc
    )
  }

  /**
   * Listen to window beforeUnload event, and close the current socket when it
   * occurs.
   * @param  {WebSocket} socket Openend socket
   */
  _listenUnload(socket) {
    this._windowUnloadHandler = () => socket.close()
    window && window.addEventListener('beforeunload', this._windowUnloadHandler)
  }

  /**
   * Retry to connect after a CloseEvent
   * @param  {CloseEvent} event The CloseEvent which cause the retry
   */
  _retry(event) {
    if (this._retries >= MAX_RETRIES) {
      if (typeof this._onDisconnect === 'function') {
        return this._onDisconnect(event)
      }
    } else {
      setTimeout(() => {
        this._connect()
      }, this._retryDelay)

      this._retries++
      this._retryDelay = this._retryDelay * 2
    }
  }

  /**
   * Send a SUBSCRIBE message to stack
   * @See https://github.com/cozy/cozy-stack/blob/master/docs/realtime.md#subscribe
   * @async
   * @param  {String}  type Document doctype to subscribe to
   * @param  {String}  id   Document id to subscribe to
   * @return {Promise}      Promise of sent message (resolves with no value)
   */
  async _sendSubscribeMessage({ type, id }) {
    const socket = await this._socketPromise
    const payload = pickBy({ type, id })

    const rawMessage = JSON.stringify({
      method: 'SUBSCRIBE',
      payload
    })

    // Do not send the same message twice
    if (this._log.includes(rawMessage)) return

    try {
      socket.send(rawMessage)
    } catch (error) {
      return this._handleError(error)
    }

    this._log.push(rawMessage)
  }

  /**
   * Stop listenning for beforeunload window event. Useful when a socket closes.
   */
  _stopListenningUnload() {
    window &&
      window.removeEventListener('beforeunload', this._windowUnloadHandler)
    delete this._windowUnloadHandler
  }
}

export default CozyRealtime
