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

