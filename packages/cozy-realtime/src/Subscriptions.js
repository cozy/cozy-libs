import MicroEE from 'microee'
import compact from 'lodash/compact'
import pull from 'lodash/pull'

export const EVENT_CREATED = 'created'
export const EVENT_UPDATED = 'updated'
export const EVENT_DELETED = 'deleted'

const INDEX_KEY_SEPARATOR = '\\'

export const getKey = ({ type, id, eventName }) =>
  compact([type, id, eventName]).join(INDEX_KEY_SEPARATOR)

/**
 * This object maintain a list of subscriptions for a given doctype or document
 * and eventName.
 *
 * It has two function :
 *  - Keep a list of all subscriptions that should be made when a socket open
 *  - Keep all the handlers for the different events.
 *
 * @type {Class}
 */
class Subscriptions {
  /**
   * Object were handlers will be stored.
   * Every handler will relate to a doctype, a optional document id and an event
   * name.
   *
   * We need to store a list of handler for a given (doctype, event) or
   * (doctype, id, event). So we will generate an index key based on doctype,
   * id and event.
   *
   * The content of _handlers will look like
   * ```
   * {
   *   ['io.cozy.foo\created']: [handler, anotherHandler],
   *   ['io.cozy.foo\cdfe01ef4da64aeabb56a129b7e2639c\updated']: [handler]
   * }
   * ```
   * @type {Object}
   */
  _handlers = {}

  _numberOfHandlers = 0

  /**
   * Add the given handler in the correct handler list, for given selector
   * ({ type, id}) and given eventName
   * @param {Object} selector
   * @param {String} selector.type  doctype to subscribe to
   * @param {String} selector.id  document id to subscribe to
   * @param {String} eventName  Event name between `created`, `updated`,
   * `deleted`
   * @param {Func} handler  Function to call when the event on the given
   * selector occurs.
   * @throw Error
   */
  subscribe(options, handler) {
    const key = getKey(options)
    this._handlers[key] = this._handlers[key] || []
    if (!this._handlers[key].includes(handler)) {
      this._handlers[key].push(handler)
      this._numberOfHandlers++
      this.emit('subscribed', options)
    }
    this.emit('numberOfHandlers', this._numberOfHandlers)
  }

  /**
   * Removes given handler from list of handlers related to given selector and
   * event.
   * @param {String} type  Document doctype
   * @param {String} id  Document id
   * @param {String} eventName  Event name between `created`, `updated`,
   * @param {Func} handler  Previously added function
   */
  unsubscribe(options, handler) {
    const key = getKey(options)
    if (!this._handlers[key]) return
    pull(this._handlers[key], handler)
    this._numberOfHandlers--
    this.emit('unsubscribed', options)
    this.emit('numberOfHandlers', this._numberOfHandlers)
    this._emitNoSubscription()
  }

  unsubscribeAll() {
    for (const key of this._handlers) {
      this._handlers[key] = []
    }
    this._numberOfHandlers = 0
    this._emitNoSubscription()
  }

  _emitNoSubscription() {
    if (this._numberOfHandlers === 0) {
      this.emit('noSubscription')
    }
  }

  receivedMessage(event) {
    const data = JSON.parse(event.data)
    const eventName = data.event.toLowerCase()
    const { type, id, doc } = data.payload

    // TODO
    // if (eventName === 'error') {
    // const realtimeError = new Error(payload.title)
    // extend(realtimeError, pick(payload, ['code', 'source', 'status']))
    // return this._handleError(realtimeError)
    // }

    const handlers = this._handlers[getKey({ type, eventName })] || []

    if (id) {
      const key = getKey({ type, id, eventName })
      if (this._handlers[key]) {
        handlers.push(...this._handlers[key])
      }
    }

    if (handlers.length === 0) {
      return
    }

    for (const handler of handlers) {
      handler(doc)
    }
  }
}

MicroEE.mixin(Subscriptions)

export default Subscriptions
