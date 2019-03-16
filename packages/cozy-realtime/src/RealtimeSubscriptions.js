import compact from 'lodash/compact'
import pull from 'lodash/pull'
import uniq from 'lodash/uniq'

const INDEX_KEY_SEPARATOR = '\\'
const VALID_EVENTS = ['created', 'updated', 'deleted']

/**
 * This object maintain a list of handlers for a given doctype or document and
 * eventName.
 *
 * It has two function :
 *  * Keep a list of all subscriptions that
 *  should be made when a socket open
 *  * Keep all the handlers for the different
 *  events.
 *
 * @type {Class}
 */
export class RealtimeSubscriptions {
  /**
   * Object were handlers will be stored.
   * Every handler will relate to a doctype, a optional document id and an event
   * name.
   *
   * We need to store a list of handler for a given doctype, event, or doctype,
   * id, event. So we will generate an index key based on doctype, id and event.
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

  /**
   * Add the given handler in the correct handler list, for given selector
   * ({ type, id}) and given eventName
   * @param {String} type      doctype to subscribe to
   * @param {String} id        document id to subscribe to
   * @param {String} eventName event name between `crezated`, `updated`,
   * `deleted`
   * @param {Func} handler     Function to call when the event on the given
   * selector occurs.
   * @throw Error
   */
  addHandler({ type, id }, eventName, handler) {
    if (!VALID_EVENTS.includes(eventName)) {
      throw new Error('Invalid event name')
    }

    if (!type) throw new Error('Invalid selector')

    const key = this._getKey({ type, id }, eventName)
    this._handlers[key] = this._handlers[key] || []
    if (!this._handlers[key].includes(handler)) {
      this._handlers[key].push(handler)
    }
  }

  /**
   * Call all the handlers related to the given selector and event name.
   * @param  {[type]} type      Document doctype
   * @param  {[type]} id        Document id
   * @param  {String} eventName Event name between `crezated`, `updated`,
   * @param  {[type]} data      Document sent by stack
   */
  handle({ type, id }, eventName, data) {
    const handlers = this._handlers[this._getKey({ type }, eventName)] || []

    if (id) {
      const key = this._getKey({ type, id }, eventName)
      if (this._handlers[key]) handlers.push(...this._handlers[key])
    }

    if (!handlers.length) return
    for (let handler of handlers) handler(data)
  }

  /**
   * Removes given handler from list of handlers related to given selector and
   * event.
   * @param  {String} type      Document doctype
   * @param  {String} id        Document id
   * @param  {String} eventName Event name between `crezated`, `updated`,
   * @param  {Func} handler   Previously added function
   */
  removeHandler({ type, id }, eventName, handler) {
    const key = this._getKey({ type, id }, eventName)
    if (!this._handlers[key]) return
    pull(this._handlers[key], handler)
  }

  /**
   * Generates a list of subscribed selectors from the handler list.
   *
   * These selector are ready to be send via a websocket to the stack in a
   * SUBSCRIBE message.
   * @return {Array} List of currently added selectors.
   */
  toSubscribeMessages() {
    // keys without the event suffix
    const shortKeys = Object.keys(this._handlers).map(key =>
      key.slice(0, key.lastIndexOf(INDEX_KEY_SEPARATOR))
    )

    return uniq(shortKeys).map(shortKey => {
      const segments = shortKey.split(INDEX_KEY_SEPARATOR)
      return { type: segments[0], id: segments[1] }
    })
  }

  /**
   * Generate an index key for the given selector and event name.
   * @param  {String} type      Document doctype
   * @param  {String} id        Document id
   * @param  {String} eventName Event name between `crezated`, `updated`,
   * @return {String}           An unique key
   */
  _getKey({ type, id }, eventName) {
    return compact([type, id, eventName]).join(INDEX_KEY_SEPARATOR)
  }
}

export default RealtimeSubscriptions
