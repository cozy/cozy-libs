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

// listener key computing, according to doctype only or with doc id
const LISTENER_KEY_SEPARATOR = '/' // safe since we can't have a '/' in a doctype
const getListenerKey = (doctype, docId) =>
  docId ? [doctype, docId].join(LISTENER_KEY_SEPARATOR) : doctype

const getTypeAndIdFromListenerKey = listenerKey => {
  const splitResult = listenerKey.split(LISTENER_KEY_SEPARATOR)
  return {
    doctype: splitResult.shift(),
    // if there still are some lements, this is the doc id
    docId: splitResult.length ? splitResult.join(LISTENER_KEY_SEPARATOR) : null
  }
}

// Send a subscribe message for the given doctype trough the given websocket, but
// only if it is in a ready state. If not, retry a few milliseconds later.
const MAX_SOCKET_POLLS = 500 // to avoid infinite polling
export function subscribeWhenReady(
  doctype,
  socket,
  docId,
  remainingTries = MAX_SOCKET_POLLS
) {
  if (socket.readyState === WEBSOCKET_STATE.OPEN) {
    try {
      const payload = { type: doctype }
      if (docId) payload.id = docId
      socket.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          payload
        })
      )
    } catch (error) {
      console.warn(`Cannot subscribe to doctype ${doctype}: ${error.message}`)
      throw error
    }
  } else {
    // no retries remaining
    if (!remainingTries) {
      const error = new Error('socket failed to connect')
      console.warn(`Cannot subscribe to doctype ${doctype}: ${error.message}`)
      throw error
    } else {
      setTimeout(() => {
        subscribeWhenReady(doctype, socket, docId, --remainingTries)
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
    socket.send(
      JSON.stringify({
        method: 'AUTH',
        payload: options.token
      })
    )
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
    for (let listenerKey of subscriptionsState) {
      const { doctype, docId } = getTypeAndIdFromListenerKey(listenerKey)
      subscribeWhenReady(doctype, socket, docId)
    }
  }

  return socket
}

export function getCozySocket(config) {
  const listeners = new Map()

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

    // the payload should always have an id here
    const listenerKey = getListenerKey(payload.type, payload.id)

    // id listener call
    if (listeners.has(listenerKey) && listeners.get(listenerKey)[eventType]) {
      listeners.get(listenerKey)[eventType].forEach(listener => {
        listener(payload.doc)
      })
    }

    if (listenerKey === payload.type) return

    // doctype listener call
    if (listeners.has(payload.type) && listeners.get(payload.type)[eventType]) {
      listeners.get(payload.type)[eventType].forEach(listener => {
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

  socket = connectWebSocket(
    config,
    onSocketMessage,
    onSocketClose,
    NUM_RETRIES,
    RETRY_BASE_DELAY
  )

  return {
    subscribe: (doctype, event, listener, docId) => {
      if (typeof listener !== 'function')
        throw new Error('Realtime event listener must be a function')

      const listenerKey = getListenerKey(doctype, docId)

      if (!listeners.has(listenerKey)) {
        listeners.set(listenerKey, {})
        subscribeWhenReady(doctype, socket, docId)
      }

      listeners.set(listenerKey, {
        ...listeners.get(listenerKey),
        [event]: [listener]
      })

      if (!subscriptionsState.has(listenerKey)) {
        subscriptionsState.add(listenerKey)
      }
    },
    unsubscribe: (doctype, event, listener, docId) => {
      const listenerKey = getListenerKey(doctype, docId)
      if (
        listeners.has(listenerKey) &&
        listeners.get(listenerKey)[event] &&
        listeners.get(listenerKey)[event].includes(listener)
      ) {
        listeners.set(listenerKey, {
          ...listeners.get(listenerKey),
          [event]: listeners.get(listenerKey)[event].filter(l => l !== listener)
        })
      }
      if (subscriptionsState.has(listenerKey)) {
        subscriptionsState.delete(listenerKey)
      }
    }
  }
}

// Returns a subscription to a given doctype (all documents)
export function subscribe(config, doctype, { docId, parse = doc => doc } = {}) {
  if (!cozySocket) cozySocket = getCozySocket(config)
  // Some document need to have specific parsing, for example, decoding
  // base64 encoded properties
  const parseCurried = listener => {
    return doc => {
      listener(parse(doc))
    }
  }

  const subscribeAllDocs = !docId

  let createListener, updateListener, deleteListener

  const subscription = {
    onUpdate: listener => {
      updateListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'updated', updateListener, docId)
      return subscription
    },
    onDelete: listener => {
      deleteListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'deleted', deleteListener, docId)
      return subscription
    },
    unsubscribe: () => {
      if (subscribeAllDocs) {
        cozySocket.unsubscribe(doctype, 'created', createListener)
      }
      cozySocket.unsubscribe(doctype, 'updated', updateListener, docId)
      cozySocket.unsubscribe(doctype, 'deleted', deleteListener, docId)
    }
  }

  if (subscribeAllDocs) {
    subscription.onCreate = listener => {
      createListener = parseCurried(listener)
      cozySocket.subscribe(doctype, 'created', createListener)
      return subscription
    }
  }

  return subscription
}

export default {
  subscribe
}
