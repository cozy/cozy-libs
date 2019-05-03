/* eslint-env jest */
import { triggersMutations } from 'connections/triggers'
import KonnectorJobWatcher from 'models/konnector/KonnectorJobWatcher'
import CozyClient from 'cozy-client'

const stackClient = {
  uri: 'cozy.tools:8080',
  token: {
    token: '1234abcd'
  }
}
const client = new CozyClient({ stackClient })
client.collection = jest.fn().mockReturnValue({
  create: jest.fn(),
  launch: jest.fn()
})

const { createTrigger, launchTrigger, watchKonnectorJob } = triggersMutations(
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

  describe('watchKonnectorJob', () => {
    it('should return a job watcher', async () => {
      // Lets mock a job to pass as watchKonnectorJob parameter. This job should
      // be returned after timeout
      const job = {
        // Test attribute, not expected in job schema
        state: 'queued'
      }

      const result = await watchKonnectorJob(job)
      expect(result instanceof KonnectorJobWatcher).toBe(true)
    })
  })
})
