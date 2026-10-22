import defaultLogger from './logger'

const ms = 1
const sec = 1000
const min = sec * 60

/**
 * When trying to reconnect, do not increase the waiting time
 * indefinitely. This is the time one may wait between two
 * attempts.
 *
 * @type {integer} time to wait in millisecond
 * @private
 */
export const maxWaitBetweenRetries = 5 * min

/**
 * When reconnecting after an error or an unsuccessful attempt, waits
 * an amount of time before a new retry. This time will double
 * at each attempt until one is successful or the navigator send an
 * 'online' event.
 *
 * @type {integer} time to wait in millisecond
 * @private
 */
export const baseWaitAfterFirstFailure = 128 * ms

/**
 * If a connection is open for this amount of time with no error
 * it is marked as successful and the exponential backoff is reseted
 *
 * @type {integer} time to wait in millisecond
 * @private
 */
export const timeBeforeSuccessful = 1.2 * sec

/**
 * Raise an error after a fixed number of attempt
 *
 * @type {boolean}
 * @private
 */
export const raiseErrorAfterAttempts = 8

/**
 * Give up reconnecting a background connection after this many failed attempts
 *
 * @type {number}
 * @private
 */
export const maxBackgroundConnectionAttempts = 10

/**
 * How many background handshakes may be in flight at once, across every
 * background connection of the tab.
 *
 * A stalled handshake keeps its slot in the browser's WebSocket budget until
 * the browser times it out, and nothing can free it earlier. Opening one per
 * shared drive at the same time is enough to exhaust that budget, so we let
 * only a few run at a time and queue the others.
 *
 * @type {number}
 * @private
 */
export const maxConcurrentBackgroundHandshakes = 3

/**
 * How long we keep waiting on a background handshake before letting the next
 * queued one start.
 *
 * This does not abort the handshake - the browser keeps it until its own
 * timeout - it only stops one stalled connection from blocking the queue.
 *
 * @type {integer} time to wait in millisecond
 * @private
 */
export const backgroundHandshakeSlotTimeout = 10 * sec

/**
 * Reconnection delays are spread by up to this fraction, above and below, of
 * the computed backoff.
 *
 * Sibling connections (one per shared drive) all fail at the same instant when
 * the network drops, and they share the same backoff constants, so without
 * jitter they all retry in lockstep and burst together.
 *
 * @type {number} ratio between 0 and 1
 * @private
 */
export const retryJitterRatio = 0.3

/**
 * How often a connection checks that the stack is still on the other end.
 *
 * @type {integer} time in millisecond
 * @private
 */
export const heartbeatInterval = 30 * sec

/**
 * How long we wait for the stack to answer a liveness probe before considering
 * the connection dead.
 *
 * @type {integer} time in millisecond
 * @private
 */
export const heartbeatTimeout = 10 * sec

/**
 * The doctype used to probe that the connection is still alive.
 *
 * The realtime protocol has no PING method and stays silent on a valid
 * SUBSCRIBE, so the only reply it guarantees is the refusal sent when an
 * application subscribes to a doctype it has no permission on. This doctype is
 * meant to never be granted to anyone, so the refusal is the answer.
 *
 * @type {string}
 * @private
 */
export const heartbeatProbeDoctype = 'io.cozy.realtime.liveness.probe'

/**
 * If one subscribe multiple times to the exact same event with the exact
 * same handler, should we call the handler multiple times for each event?
 * eventWhat to do if someone ask multiple times for the same subscription?
 *
 * If you modify this value, please double check that the tests are ok and
 * start a real validation procedure. This is given without any garantee.
 *
 * @type {boolean}
 * @private
 */
export const allowDoubleSubscriptions = true

/**
 * If one subscribe multiple times to the exact same event with the exact
 * same handler, should we unsubscribe all the corresponding handlers on
 * the first call to unsubscribe or should we ask for multiple calls
 * to unsubscribe?
 *
 * If you modify this value, please double check that the tests are ok and
 * start a real validation procedure. This is given without any garantee.
 *
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
 *
 * @type {Function}
 * @private
 */
export const onDoubleSubscriptions = (
  subscription,
  { logger = defaultLogger } = {}
) => {
  logger.warn('Double subscription for ', subscription)
  if (allowDoubleSubscriptions) {
    logger.info('The handler may be called twice for the same event!')
    logger.info('Remember to call one `unsubscribe` for each `subscribe`')
  } else {
    logger.info('The handler will only be called once')
    if (requireDoubleUnsubscriptions) {
      logger.info('Remember to call one `unsubscribe` for each `subscribe`')
    } else {
      logger.info('`unsubscribe` will remove all similar subscriptions')
    }
  }
}

/**
 * @typedef {'CREATED'|UPDATED'|DELETED'|'NOTIFIED'|'error'} EventName
 */
/**
 * Possible values for the `event` property in Realtime
 *
 * @type  {EventName}
 */
export const eventNames = ['CREATED', 'UPDATED', 'DELETED', 'NOTIFIED', 'error']
