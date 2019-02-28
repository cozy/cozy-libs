/* eslint-env jest */
import { triggersMutations } from 'connections/triggers'
import client from 'cozy-client'
import realtime from 'cozy-realtime'

jest.mock('cozy-client', () => ({
  collection: jest.fn().mockReturnValue({
    create: jest.fn(),
    launch: jest.fn()
  }),
  create: jest.fn(),
  client: {
    token: {
      token: '1234abcd'
    },
    uri: 'cozy.tools:8080'
  }
}))

jest.mock('cozy-realtime', () => ({
  subscribe: jest.fn()
}))

const { createTrigger, launchTrigger, waitForLoginSuccess } = triggersMutations(
  client
)

const fixtures = {
  trigger: {
    type: '@cron',
    worker: 'konnector',
    message: {
      account: '8f75c33780e2487fa474e0965521dc32',
      konnector: 'konnectest'
    }
  },
  createdTrigger: {
    _id: '42817ec169d047e68b912c6f7d7564a2',
    _type: 'io.cozy.triggers',
    type: '@cron',
    worker: 'konnector',
    message: {
      account: '8f75c33780e2487fa474e0965521dc32',
      konnector: 'konnectest'
    }
  },
  launchedJob: {
    _type: 'io.cozy.jobs',
    _id: '2794bb7c3cd64712a427ca4454aef238',
    state: 'queued'
  }
}

describe('Trigger mutations', () => {
  beforeAll(() => {
    client
      .collection()
      .create.mockResolvedValue({ data: fixtures.createdTrigger })
    client.collection().launch.mockResolvedValue({ data: fixtures.launchedJob })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('createTrigger', () => {
    it('calls Cozy Client and returns trigger', async () => {
      const result = await createTrigger(fixtures.trigger)
      expect(client.collection().create).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.createdTrigger)
    })
  })

  describe('launchTrigger', () => {
    it('calls expected endpoint', async () => {
      const result = await launchTrigger(fixtures.trigger)
      expect(client.collection().launch).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.launchedJob)
    })
  })

  describe('waitForLoginSuccess', () => {
    const shortLoginResponseTime = 50
    const longLoginResponseTime = 150
    const jobSuccessResponseTime = 100

    const updatedJob = {
      state: 'done'
    }

    beforeAll(() => {
      // Mock realtime to respond at 100ms
      realtime.subscribe.mockImplementation(() => ({
        onUpdate: fn => setTimeout(() => fn(updatedJob), jobSuccessResponseTime)
      }))
    })

    afterAll(() => {
      realtime.subscribe.resetMock()
    })

    it('waits for the given delay', async () => {
      const startTime = new Date().getTime()
      await waitForLoginSuccess({}, shortLoginResponseTime)
      const endTime = new Date().getTime()
      expect(endTime - startTime).toBeGreaterThanOrEqual(shortLoginResponseTime)
      expect(endTime - startTime).toBeLessThan(jobSuccessResponseTime)
    })

    it('handle job end before login delay', async () => {
      const startTime = new Date().getTime()
      await waitForLoginSuccess({}, longLoginResponseTime)
      const endTime = new Date().getTime()
      expect(endTime - startTime).toBeGreaterThanOrEqual(jobSuccessResponseTime)
      expect(endTime - startTime).toBeLessThan(longLoginResponseTime)
    })

    it('ignore unfinished job', async () => {
      // Mock realtime to respond at 100ms
      realtime.subscribe.mockImplementation(() => ({
        onUpdate: fn =>
          setTimeout(() => fn({ state: 'queued' }), jobSuccessResponseTime)
      }))
      const startTime = new Date().getTime()
      await waitForLoginSuccess({}, shortLoginResponseTime)
      const endTime = new Date().getTime()
      expect(endTime - startTime).toBeGreaterThanOrEqual(shortLoginResponseTime)
      expect(endTime - startTime).toBeLessThan(jobSuccessResponseTime)
    })
  })
})
