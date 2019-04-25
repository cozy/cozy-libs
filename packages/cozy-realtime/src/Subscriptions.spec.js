import Subscriptions, { getKey, EVENT_CREATED } from './Subscriptions'

describe('getKey', () => {
  it('should return key from options', () => {
    let options = { type: 'io.cozy.bank.accounts', eventName: EVENT_CREATED }
    expect(getKey(options)).toBe('io.cozy.bank.accounts\\created')
    options = {
      type: 'io.cozy.bank.accounts',
      eventName: EVENT_CREATED,
      id: 'dzqezfd'
    }
    expect(getKey(options)).toBe('io.cozy.bank.accounts\\dzqezfd\\created')
    options = { type: 'io.cozy.bank.accounts', id: 'dzqezfd' }
    expect(getKey(options)).toBe('io.cozy.bank.accounts\\dzqezfd')
  })
})

describe('Subscriptions', () => {
  let subscriptions
  beforeEach(() => {
    subscriptions = new Subscriptions()
  })

  afterEach(() => {
    subscriptions = null
  })

  it('should subscribe', () => {
    const options = { type: 'io.cozy.bank.accounts', eventName: EVENT_CREATED }
    const handler = jest.fn()
    expect(subscriptions._handlers).toEqual({})
    expect(subscriptions._numberOfHandlers).toEqual(0)
    subscriptions.subscribe(options, handler)
    expect(subscriptions._handlers).toMatchSnapshot()
    expect(subscriptions._numberOfHandlers).toEqual(1)
  })

  it('should unsubscribe', done => {
    const options = { type: 'io.cozy.bank.accounts', eventName: EVENT_CREATED }
    const handler1 = jest.fn()
    const handler2 = jest.fn()
    subscriptions.subscribe(options, handler1)
    subscriptions.subscribe(options, handler2)
    expect(subscriptions._handlers).toMatchSnapshot()
    expect(subscriptions._numberOfHandlers).toEqual(2)
    subscriptions.unsubscribe(options, handler1)
    expect(subscriptions._handlers).toMatchSnapshot()
    expect(subscriptions._numberOfHandlers).toEqual(1)
    subscriptions.on('noSubscription', () => {
      expect(subscriptions._handlers).toMatchSnapshot()
      expect(subscriptions._numberOfHandlers).toEqual(0)
      done()
    })
    subscriptions.unsubscribe(options, handler2)
  })

  it('should launch handles when it received message', done => {
    const type = 'io.cozy.bank.accounts'
    const id = 'zvNpzsHILcXpnDBlUfmAqVuEEuyWvPYn'
    const doc = 'doc'
    const options = { type, eventName: EVENT_CREATED }
    const event = {
      data: JSON.stringify({ event: EVENT_CREATED, payload: { type, id, doc } })
    }
    const handler = jest
      .fn()
      .mockImplementationOnce(info => expect(info).toBe(doc))
      .mockImplementationOnce(() => done())
    subscriptions.receivedMessage(event)
    subscriptions.subscribe(options, handler)
    subscriptions.subscribe({ ...options, id }, handler)
    subscriptions.receivedMessage(event)
  })
})
