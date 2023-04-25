import EventEmitter from 'events'

import { act, renderHook } from '@testing-library/react-hooks'

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

// This test suite is for the `useKonnectorWithTriggers` custom hook
// which is responsible for fetching a konnector by its slug and
// its associated triggers.
describe('useKonnectorWithTriggers', () => {
  // Clean up all realtime subscriptions after each test
  afterEach(() => {
    realtimeMock.unsubscribeAll()
  })

  // This test checks if the hook fetches the konnector with the given slug
  // and its associated triggers when no konnector is injected.
  it('should fetch konnector with given slug and its associated triggers if no injected konnector', async () => {
    // Mock the client's query function to return fake data for konnectors and triggers
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

    // Render the hook and get the result object
    const { result, waitFor } = renderHook(() =>
      useKonnectorWithTriggers('testslug')
    )

    // Wait for fetching to be completed
    await waitFor(() => result.current.fetching === false)

    // Check if the hook returns the expected data after fetching
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

    // Simulate a new trigger being created for the konnector
    act(() => {
      realtimeMock.events.emit(
        realtimeMock.key('created', 'io.cozy.triggers'),
        {
          _id: 'newtesttriggerid',
          _type: 'io.cozy.triggers',
          message: {
            konnector: 'testslug'
          }
        }
      )
    })

    // Wait for fetching to be completed again
    await waitFor(() => result.current.fetching === false)

    // Sort the received triggers to make sure the comparison is not order-dependent
    const sortedReceivedTriggers =
      result.current.konnectorWithTriggers.triggers.data.sort((a, b) =>
        a._id.localeCompare(b._id)
      )

    // Check if the hook returns the expected data after the new trigger is created
    expect(result.current).toStrictEqual({
      fetching: false,
      konnectorWithTriggers: {
        slug: 'testslug',
        triggers: {
          data: sortedReceivedTriggers
        }
      },
      notFoundError: false
    })
  })
})
