// For tests, 250ms should be enough to see if an event is sent or not
// A larger value garantees we do not receive the even later,
// but slows all the test suite.
const eventTimeout = 250

// Promise will be rejected is nothing happens before timeout
export function timedPromise(callback, duration = eventTimeout) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(true), duration)
    const combinedResolve = (...args) => {
      clearTimeout(timeout)
      resolve(...args)
    }
    const combinedReject = (...args) => {
      clearTimeout(timeout)
      reject(...args)
    }
    callback(combinedResolve, combinedReject)
  })
}

export function eventPromise(
  listener,
  event,
  givenCallback,
  duration = eventTimeout
) {
  const defaultCallback = (resolve, reject, ...args) =>
    resolve((args && args[0]) || true)
  const callback = givenCallback || defaultCallback
  return timedPromise((resolve, reject) => {
    listener.on(event, (...args) => callback(resolve, reject, ...args))
  }, duration)
}

export function serverMessagePromise(
  server,
  givenCallback,
  duration = eventTimeout
) {
  const defaultCallback = (resolve, reject, method, payload) =>
    resolve({ method, payload })
  const callback = givenCallback || defaultCallback
  return timedPromise((resolve, reject) => {
    server.on('connection', socket =>
      socket.on('message', json => {
        const data = JSON.parse(json)
        callback(resolve, reject, data.method, data.payload)
      })
    )
  }, duration)
}

export function subscribePromise(
  listener,
  args,
  givenCallback,
  memory,
  duration = eventTimeout
) {
  const defaultCallback = (resolve, reject, doc) => resolve(doc)
  const callback = givenCallback || defaultCallback
  return timedPromise((resolve, reject) => {
    const handler = doc => callback(resolve, reject, doc)
    listener.subscribe(...args, handler)
    if (memory) memory.handler = handler
  }, duration)
}
