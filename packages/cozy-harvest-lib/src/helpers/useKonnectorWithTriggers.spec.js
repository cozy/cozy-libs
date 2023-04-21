import { renderHook } from '@testing-library/react-hooks'
import EventEmitter from 'events'

import { useKonnectorWithTriggers } from './useKonnectorWithTriggers'

const realtimeMock = {
  unsubscribeAll: () => {
    for (const [key] of realtimeMock.subscribtions) {
      const [doctype, action] = key.split(':')
      realtimeMock.unsubscribe(action, doctype)
    }
  },
  events: new EventEmitter(),
  key: (action, doctype) => `${doctype}:${action}`,
  subscribtions: new Map(),
  subscribe: jest.fn().mockImplementation((action, doctype, id, callback) => {
    const finalcallback = callback === undefined ? id : callback
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    subscribtions.set(subscribtionKey, data => finalcallback(data))
    events.on(
      subscribtionKey,
      realtimeMock.subscribtions.get(key(action, doctype))
    )
  }),
  unsubscribe: jest.fn().mockImplementation((action, doctype) => {
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    const subscribtion = subscribtions.get(subscribtionKey)
    if (subscribtion) {
      events.off(subscribtionKey, subscribtion)
      subscribtions.delete(key(action, doctype))
    }
  }),
  sendNotification: jest.fn()
}

const mockClient = {
  query: jest.fn(),
  plugins: {
    realtime: realtimeMock
  }
}

jest.mock('cozy-realtime')

jest.mock('cozy-client', () => ({
  // ...jest.requireActual('cozy-client'),
  useClient: () => mockClient,
  Q: doctype => ({
    where: () => ({ doctype })
  })
}))

describe('useKonnectorWithTriggers', () => {
  afterEach(() => {
    realtimeMock.unsubscribeAll()
  })
  it('should fetch konnector with given slug and its associated triggers if no injected konnector', async () => {
    mockClient.query.mockImplementation(async q => {
      if (q.doctype === 'io.cozy.konnectors') {
        return {
          data: [
            {
              slug: 'testslug'
            }
          ]
        }
      } else if (q.doctype === 'io.cozy.triggers') {
        return {
          data: [
            {
              _id: 'testtriggerid',
              _type: 'io.cozy.triggers',
              message: {
                konnector: 'testslug'
              }
            }
          ]
        }
      }
      return { data: [] }
    })
    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(() =>
      useKonnectorWithTriggers('testslug')
    )
    await waitForNextUpdate()
    expect(result.current).toStrictEqual({
      fetching: false,
      konnectorWithTriggers: {
        slug: 'testslug',
        triggers: {
          data: [
            {
              _id: 'testtriggerid',
              _type: 'io.cozy.triggers',
              message: { konnector: 'testslug' }
            }
          ]
        }
      },
      notFoundError: false
    })

    realtimeMock.events.emit(realtimeMock.key('created', 'io.cozy.triggers'), {
      _id: 'newtesttriggerid',
      _type: 'io.cozy.triggers',
      message: {
        konnector: 'testslug'
      }
    })
    await waitForNextUpdate()
    expect(result.current).toStrictEqual({
      fetching: false,
      konnectorWithTriggers: {
        slug: 'testslug',
        triggers: {
          data: [
            {
              _id: 'newtesttriggerid',
              _type: 'io.cozy.triggers',
              message: { konnector: 'testslug' }
            },
            {
              _id: 'testtriggerid',
              _type: 'io.cozy.triggers',
              message: { konnector: 'testslug' }
            }
          ]
        }
      },
      notFoundError: false
    })
  })
})
