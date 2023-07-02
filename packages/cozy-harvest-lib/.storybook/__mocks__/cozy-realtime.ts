import EventEmitter from 'events'

export const realtimeMock = {
  clear: () => {
    for (const [key] of realtimeMock.subscribtions) {
      const [doctype, action] = key.split(':')
      realtimeMock.unsubscribe(action, doctype)
    }
  },
  events: new EventEmitter(),
  key: (action, doctype) => `${doctype}:${action}`,
  subscribtions: new Map(),
  subscribe: (action, doctype, id, callback) => {
    const finalcallback = callback === undefined ? id : callback
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    subscribtions.set(subscribtionKey, data => finalcallback(data))
    events.on(
      subscribtionKey,
      realtimeMock.subscribtions.get(key(action, doctype))
    )
  },
  unsubscribe: (action, doctype) => {
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    const subscribtion = subscribtions.get(subscribtionKey)
    if (subscribtion) {
      events.off(subscribtionKey, subscribtion)
      subscribtions.delete(key(action, doctype))
    }
  },
  sendNotification: () => void 0
}