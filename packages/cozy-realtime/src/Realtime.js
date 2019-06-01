import MicroEE from 'microee'

import RealtimeSocket from './RealtimeSocket'
import isEqual from 'lodash.isequal'
import findIndex from 'lodash.findindex'

import {
  allowDoubleSubscriptions,
  requireDoubleUnsubscriptions,
  onDoubleSubscriptions
} from './Realtime.config.js'

/**
 * Establish a realtime connection with the cozy stack
 *
 * Deals with network and application failures and re-establish a new
 * socket when needed. This should be transparent for the user but he
 * may however miss messages from the stack between the disconnection
 * and the replacing connection.
 */
class Realtime {
  /**
   * subscriptions to the realtime
   * @type {Array<Object>}
   * @private
   */
  subscriptions = []

  /**
   * Resolves when the socket connects
   * (the socket may have been closed since then)
   * @type {undefined|Promise<RealtimeSocket>}
   * @private
   */
  ready = undefined

  /**
   * @param {object} - arg
   * @param {CozyClient} - arg.client
   */
  constructor({ cozyClient, client }) {
    this.client = client || cozyClient

    this.unload = this.unload.bind(this)
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.reconnect = this.reconnect.bind(this)

    this.onClose = this.onClose.bind(this)
    this.onError = this.onError.bind(this)

    this.authenticate = this.authenticate.bind(this)
    this.connectOrAuthenticate = this.connectOrAuthenticate.bind(this)

    this.load()
  }

  /**
   * Connect a realtime socket to the stack
   * @private
   */
  async connect() {
    // do not connect if navigator is offline
    if (navigator && navigator.onLine === false) return

    const uri = this.client.getStackClient().uri
    const token = this.client.getStackClient().getAccessToken()
    if (uri) {
      // start a promise early so other methods can attache to it
      let resolveReady
      this.ready = new Promise(resolve => (resolveReady = resolve))
      // Be sure to clone the subscriptions to use the list as it is now
      // and not as it will be in the future.
      // If a new connection comes between the socket set up
      // and the actual subscriptions, we won't call it twice
      const subscriptions = [...this.subscriptions]
      // start connection
      const options = {
        allowDoubleSubscriptions,
        requireDoubleUnsubscriptions,
        onDoubleSubscriptions
      }
      this.socket = new RealtimeSocket(options)
      this.socket.on('close', this.onClose)
      this.socket.on('error', this.onError)
      const socket = await this.socket.connect(uri, token)
      // connection is ready to use
      resolveReady(socket)
      // send the subscriptions we kept above
      await this.sendSubscriptions(subscriptions)
    } else {
      throw new Error('no URI in stack client, cannot initialize Realtime')
    }
    return this.ready
  }

  /**
   * Send subscriptions to the realtime socket
   * @private
   * @param {Array<Object>} subscriptions -
   *        of the form { eventName, type, id, handler }
   */
  async sendSubscriptions(subscriptions) {
    // we get the socket there and not in this to be sure to use the one
    // corresponding to our callback and not a future one
    const socket = await this.ready
    if (!socket || socket !== this.socket || !socket.isOpen()) return
    // subscribe
    subscriptions.forEach(subscription => {
      const { eventName, type, id, handler } = subscription
      if (!subscription.cancelled) {
        if (id) {
          socket.subscribe(eventName, type, id, handler)
        } else {
          socket.subscribe(eventName, type, handler)
        }
      }
    })
  }

  /**
   * Subscribe to a cozy stack realtime event
   * @param {string} eventName            - 'created', 'deleted', or 'updated'
   * @param {string} type                 - a doctype
   * @param {string} handlerOrId          - id of a document (optional)
   * @param {Function} handlerOrUndefined - callback for this event
   * @throw {Error} for invalid subscription
   * @return {Promise} when subscription will take effect
   */
  subscribe(eventName, type, handlerOrId, handlerOrUndefined) {
    const { id, handler } = RealtimeSocket.getHandlerAndId(
      handlerOrId,
      handlerOrUndefined
    )
    if (eventName == 'created' && id) {
      throw new Error("can't subscribe to a creation event with an id")
    }

    const sub = { eventName, type, id, handler }

    this.subscriptions.push(sub)
    if (this.socket) {
      return this.sendSubscriptions([sub])
    } else {
      return this.ready
    }
  }

  /**
   * Unsubscribe to a cozy stack realtime event
   * @param {string} eventName            - 'created', 'deleted', or 'updated'
   * @param {string} type                 - a doctype
   * @param {string} handlerOrId          - id of a document (optional)
   * @param {Function} handlerOrUndefined - callback for this event
   */
  async unsubscribe(eventName, type, handlerOrId, handlerOrUndefined) {
    const { id, handler } = RealtimeSocket.getHandlerAndId(
      handlerOrId,
      handlerOrUndefined
    )

    // find first corresponding subscription
    const sub = { eventName, type, id, handler }
    const index = findIndex(this.subscriptions, s => isEqual(s, sub))
    if (index < 0) return

    // mark as cancelled so it will not be use later in a registered sendSubscription
    this.subscriptions[index].cancelled = true

    // actually remove
    this.subscriptions.splice(index, 1)
    if (this.socket) {
      // nothing is sent to the stack, we can unsubscribe immediatly
      // in the current socket, whatever the connection status is
      if (id) {
        this.socket.unsubscribe(eventName, type, id, handler)
      } else {
        this.socket.unsubscribe(eventName, type, handler)
      }
    }
  }

  /**
   * Unsubscribe to all events from the cozy stack realtime socket
   */
  async unsubscribeAll() {
    // We do not simply reset `this.subscriptions` and call `unsubscribeAll`
    // on the socket because this would also remove the handlers for
    // 'close' and 'error' events.
    // Be carefull, as `unsubscribe` is manipulating `this.subscriptions`.
    // Do not simply iterate with a for…of
    while (this.subscriptions.length) {
      const { eventName, type, id, handler } = this.subscriptions[0]
      this.unsubscribe(eventName, type, id, handler)
    }
  }

  /**
   * Reconnect when the underlying RealtimeSocket is closed
   * @param {RealtimeSocket} socket which sends the event
   * @param {Event} close event
   * @private
   */
  async onClose(socket) {
    // if this event is received for *this* socket and not a preivous one
    if (this.socket === socket) {
      this.reconnect()
    }
  }

  /**
   * Reconnect when the underlying RealtimeSocket is on error
   * @param {RealtimeSocket} socket which sends the event
   * @param {Event} error event
   * @private
   */
  async onError(socket, error) {
    // if this event is received for *this* socket and not a previous one
    if (this.socket === socket) {
      this.emit('error', error)
      this.reconnect()
    }
  }

  /**
   * Disconnect and reconnect a new RealtimeSocket
   * Returns when connected
   * @private
   * @return {Promise<RealtimeSocket>} resolve when connected
   */
  reconnect() {
    this.disconnect()
    return this.connect()
  }

  /**
   * Disconnect and properly clean every listener attached by this instance
   * Also remove any subscriptions
   * @private
   */
  unload() {
    this.disconnect()
    this.unsubscribeAll()
    if (window) {
      window.removeEventListener('online', this.reconnect)
      window.removeEventListener('unload', this.unload)
    }
    if (this.client) {
      this.client.removeListener('login', this.connectOrAuthenticate)
      this.client.removeListener('tokenRefreshed', this.authenticate)
      this.client.removeListener('logout', this.disconnect)
    }
  }

  /**
   * Start monitoring the browser internet connection and cozy-client events
   * then start a new RealtimeSocket.
   * @private
   * @return {Promise<RealtimeSocket>} resolve when connected
   */
  load() {
    if (window) {
      window.addEventListener('online', this.reconnect)
      window.addEventListener('unload', this.unload)
      // no need for an offline event, the stack won't receive it
      // and we'll reconnect when online anyways
    }
    if (this.client) {
      this.client.on('login', this.connectOrAuthenticate)
      this.client.on('tokenRefreshed', this.authenticate)
      this.client.on('logout', this.disconnect)
    }
    return this.connect()
  }

  /**
   * (re)Authenticate to the cozy-stack
   * @private
   */
  authenticate() {
    const token = this.client.getStackClient().getAccessToken()
    if (this.socket && this.socket.isOpen()) {
      this.socket.authenticate(token)
    }
  }

  /**
   * Connect a RealtimeSocket none is open, then authenticate
   * @return RealtimeSocket where we authenticated
   * @private
   * @return {undefined|Promise<RealtimeSocket>} resolve when connected
   */
  connectOrAuthenticate() {
    if (this.socket) {
      this.authenticate()
      return this.ready
    } else {
      return this.connect()
    }
  }

  /**
   * Disconnect the current socket
   * @private
   */
  disconnect() {
    const oldSocket = this.socket
    this.socket = undefined
    this.ready = undefined
    if (oldSocket) {
      oldSocket.close()
    }
  }
}

MicroEE.mixin(Realtime)

export default Realtime
