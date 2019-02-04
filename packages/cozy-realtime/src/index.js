/* global WebSocket */

// cozySocket is a custom object wrapping logic to websocket and exposing a subscription
// interface
let cozySocket

// Important, must match the spec,
// see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
const WEBSOCKET_STATE = {
  OPEN: 1
}

const NUM_RETRIES = 3
const RETRY_BASE_DELAY = 1000

// stored subscriptions arguments to rerun while a retry
// stored as a Map { [doctype]: socket }
let subscriptionsState = new Set()

export const getSubscriptionsState = () => subscriptionsState

// Send a subscribe message for the given doctype trough the given websocket, but
// only if it is in a ready state. If not, retry a few milliseconds later.
const MAX_SOCKET_POLLS = 500 // to avoid infinite poling
export function subscribeWhenReady(
  doctype,
  socket,
  remainedTries = MAX_SOCKET_POLLS
) {
  if (socket.readyState === WEBSOCKET_STATE.OPEN) {
    try {
      socket.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          payload: {
            type: doctype
          }
        })
      )
    } catch (error) {
      console.warn(`Cannot subscribe to doctype ${doctype}: ${error.message}`)
      throw error
    }
  } else {
    // no retries remaining
    if (!remainedTries) {
      const error = new Error('socket failed to connect')
      console.warn(`Cannot subscribe to doctype ${doctype}: ${error.message}`)
      throw error
    } else {
      setTimeout(() => {
        subscribeWhenReady(doctype, socket, --remainedTries)
      }, 10)
    }
  }
}

function isSecureURL(url) {
  const httpsRegexp = new RegExp(`^(https:/{2})`)
  return url.match(httpsRegexp)
}

const isBoolean = [
  bool => typeof bool === 'undefined' || typeof bool === 'boolean',
  'should be a boolean'
]
const isRequired = [attr => !!attr, 'is required']
const isRequiredIfNo = keys => [
  (attr, obj) => keys.find(key => !!obj[key]) || !!attr,
  `is required if no attribute ${keys.join(' or ')} are provider.`
]
const isString = [
  str => typeof str === 'undefined' || typeof str === 'string',
  'should be a string'
]
const isURL = [
  url => {
    if (typeof url === 'undefined') return true
    try {
      new URL(url)
    } catch (error) {
      return false
    }

    return true
  },
  'should be an URL'
]

const validate = types => obj => {
  for (const [attr, rules] of Object.entries(types)) {
    for (const [validator, message] of rules) {
      if (!validator(obj[attr], obj)) {
        throw new Error(`${attr} ${message}.`)
      }
    }
  }
}

const configTypes = {
  domain: [isRequiredIfNo(['url']), isString],
  secure: [isBoolean],
  token: [isRequired, isString],
  url: [isRequiredIfNo(['domain']), isURL]
}

const validateConfig = validate(configTypes)

export function connectWebSocket(
  config,
  onmessage,
  onclose,
  numRetries,
  retryDelay,
  isRetry
) {
  validateConfig(config)
  const options = {
    secure: config.url ? isSecureURL(config.url) : true,
    ...config
  }

  const protocol = options.secure ? 'wss:' : 'ws:'
  const domain = options.domain || new URL(options.url).host

  if (!domain) {
    throw new Error('Unable to detect domain')
  }

  const socket = new WebSocket(
    `${protocol}//${domain}/realtime/`,
    'io.cozy.websocket'
  )

  socket.onopen = () => {
    try {
      socket.send(
        JSON.stringify({
          method: 'AUTH',
          payload: options.token
        })
      )
    } catch (error) {
      throw error
    }
  }

  const windowUnloadHandler = () => socket.close()
  window.addEventListener('beforeunload', windowUnloadHandler)

  socket.onmessage = onmessage
  socket.onclose = event => {
    window.removeEventListener('beforeunload', windowUnloadHandler)
    if (typeof onclose === 'function') onclose(event, numRetries, retryDelay)
  }
  socket.onerror = error => console.error(`WebSocket error: ${error.message}`)

  if (isRetry && subscriptionsState.size) {
    for (let doctype of subscriptionsState) {
      subscribeWhenReady(doctype, socket)
    }
  }

  return socket
}

export function getCozySocket(config) {
  const listeners = {}

  let socket

  const onSocketMessage = event => {
    const data = JSON.parse(event.data)
    const eventType = data.event.toLowerCase()
    const payload = data.payload

    if (eventType === 'error') {
      const realtimeError = new Error(payload.title)
      const errorFields = ['status', 'code', 'source']
      errorFields.forEach(property => {
        realtimeError[property] = payload[property]
      })

      throw realtimeError
    }

    if (listeners[payload.type] && listeners[payload.type][eventType]) {
      listeners[payload.type][eventType].forEach(listener => {
        listener(payload.doc)
      })
    }
  }

  const onSocketClose = (event, numRetries, retryDelay) => {
    if (!event.wasClean) {
      console.warn(
        `WebSocket closed unexpectedly with code ${event.code} and ${
          event.reason ? `reason: '${event.reason}'` : 'no reason'
        }.`
      )

      if (numRetries) {
        console.warn(`Reconnecting ... ${numRetries} tries left.`)
        setTimeout(() => {
          try {
            socket = connectWebSocket(
              config,
              onSocketMessage,
              onSocketClose,
              --numRetries,
              retryDelay + 1000,
              true
            )
          } catch (error) {
            console.error(
              `Unable to reconnect to realtime. Error: ${error.message}`
            )
          }
        }, retryDelay)
      }
    }
  }

  try {
    socket = connectWebSocket(
      config,
      onSocketMessage,
      onSocketClose,
      NUM_RETRIES,
      RETRY_BASE_DELAY
    )
  } catch (error) {
    throw error
  }

  return {
    subscribe: (doctype, event, listener) => {
      if (typeof listener !== 'function')
        throw new Error('Realtime event listener must be a function')

      if (!listeners[doctype]) {
        listeners[doctype] = {}
        subscribeWhenReady(doctype, socket)
      }

      listeners[doctype][event] = (listeners[doctype][event] || []).concat([
        listener
      ])

      if (!subscriptionsState.has(doctype)) {
        subscriptionsState.add(doctype)
      }
    },
    unsubscribe: (doctype, event, listener) => {
      if (
        listeners[doctype] &&
        listeners[doctype][event] &&
        listeners[doctype][event].includes(listener)
      ) {
        listeners[doctype][event] = listeners[doctype][event].filter(
          l => l !== listener
        )
      }
      if (subscriptionsState.has(doctype)) {
        subscriptionsState.delete(doctype)
      }
    }
  }
}

// Returns the Promise of a subscription to a given doctype and document
export function subscribe(config, doctype, doc, parse = doc => doc) {
  const subscription = subscribeAll(config, doctype, parse)
  // We will call the listener only for the given document, so let's curry it
  const docListenerCurried = listener => {
    return syncedDoc => {
      if (syncedDoc._id === doc._id) {
        listener(syncedDoc)
      }
    }
  }

  return {
    onUpdate: listener => subscription.onUpdate(docListenerCurried(listener)),
    onDelete: listener => subscription.onDelete(docListenerCurried(listener)),
    unsubscribe: () => subscription.unsubscribe()
  }
}

// Returns the Promise of a subscription to a given doctype (all documents)
export function subscribeAll(config, doctype, parse = doc => doc) {
  if (!cozySocket) cozySocket = getCozySocket(config)
  // Some document need to have specific parsing, for example, decoding
  // base64 encoded properties
  const parseCurried = listener => {
    return doc => {
      listener(parse(doc))
    }
  }

  let createListener, updateListener, deleteListener

  const subscription = {
    onCreate: listener => {
      createListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'created', createListener)
      return subscription
    },
    onUpdate: listener => {
      updateListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'updated', updateListener)
      return subscription
    },
    onDelete: listener => {
      deleteListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'deleted', deleteListener)
      return subscription
    },
    unsubscribe: () => {
      cozySocket.unsubscribe(doctype, 'created', createListener)
      cozySocket.unsubscribe(doctype, 'updated', updateListener)
      cozySocket.unsubscribe(doctype, 'deleted', deleteListener)
    }
  }

  return subscription
}

export default {
  subscribeAll,
  subscribe
}
