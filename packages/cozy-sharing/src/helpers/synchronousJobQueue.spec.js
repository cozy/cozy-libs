import { SynchronousJobQueue } from './synchronousJobQueue'

const flushPromises = () => new Promise(process.nextTick)

const callback = jest.fn()

const resolveAfter100Ms = jest.fn().mockImplementation(() => {
  callback('100Ms start')
  return new Promise(resolve => {
    setTimeout(function () {
      callback('100Ms end')
      resolve()
    }, 100)
  })
})

const resolveAfter500Ms = jest.fn().mockImplementation(() => {
  callback('500Ms start')
  return new Promise(resolve => {
    setTimeout(function () {
      callback('500Ms end')
      resolve()
    }, 500)
  })
})

describe('SynchronousJobQueue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('should execute job synchronously with SynchronousJobQueue', async () => {
    const synchronousJobQueue = new SynchronousJobQueue()
    synchronousJobQueue.push({ function: resolveAfter500Ms })
    synchronousJobQueue.push({ function: resolveAfter100Ms })

    jest.runAllTimers()
    await flushPromises()
    jest.runAllTimers()
    await flushPromises()

    const expectedCallbackOrder = [
      ['500Ms start'],
      ['500Ms end'],
      ['100Ms start'],
      ['100Ms end']
    ]

    expect(callback.mock.calls).toEqual(expectedCallbackOrder)
  })

  it('should execute job asynchronously without SynchronousJobQueue', async () => {
    resolveAfter500Ms()
    resolveAfter100Ms()

    jest.runAllTimers()
    await flushPromises()
    jest.runAllTimers()
    await flushPromises()

    const expectedCallbackOrder = [
      ['500Ms start'],
      ['100Ms start'],
      ['100Ms end'],
      ['500Ms end']
    ]

    expect(callback.mock.calls).toEqual(expectedCallbackOrder)
  })
})
