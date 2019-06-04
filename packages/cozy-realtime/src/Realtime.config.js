// WARNING
// If you modify allowDoubleSubscriptions or requireDoubleUnsubscriptions,
// please make sure that you add or activate the corresponding tests.
// Alternative behaviours may have bugs.

/**
 * If one subscribe multiple times to the exact same event with the exact
 * same handler, should we call the handler multiple times for each event?
 * eventWhat to do if someone ask multiple times for the same subscription?
 * @type {boolean}
 * @private
 */
export const allowDoubleSubscriptions = true

/**
 * If one subscribe multiple times to the exact same event with the exact
 * same handler, should we unsubscribe all the corresponding handlers on
 * the first call to unsubscribe or should we ask for multiple calls
 * to unsubscribe?
 * @type {boolean}
 * @private
 */
export const requireDoubleUnsubscriptions = true

/**
 * If one subscribe multiple times to the exact same event with the exact
 * same handler, this function is called. You are welcome to add any
 * log or warning you wish, or even to throw an exception.
 * This function get a subscription object in parameter. This object has
 * the form { eventName, type, id, handler } where id is optional.
 * @type {Function}
 * @private
 */
export const onDoubleSubscriptions = subscription => {
  if (console) {
    if (console.group) console.group()
    console.warn('Double subscription for ', subscription)
    if (allowDoubleSubscriptions) {
      console.info('The handler may be called twice for the same event!')
      console.info('Remember to call one `unsubscribe` for each `subscribe`')
    } else {
      console.info('The handler will only be called once')
      if (requireDoubleUnsubscriptions) {
        console.info('Remember to call one `unsubscribe` for each `subscribe`')
      } else {
        console.info('`unsubscribe` will remove all similar subscriptions')
      }
    }
    if (console.group) console.groupEnd()
  }
}

/**
 * When reconnecting after an error or an unsuccessfull attempt, waits
 * an amount of time before a new retry. This time will double
 * at each attempt until one is successfull or the navigator send an
 * 'online' event.
 * @type {integer} time to wait in millisecond
 * @private
 */
export const defaultBackoff = 200

/**
 * If a connection is open for this amount of time with no error
 * it is marked as successfull and the exponential backoff is reseted
 * @type {integer} time to wait in millisecond
 * @private
 */
export const timeBeforeSuccessfull = 1200
