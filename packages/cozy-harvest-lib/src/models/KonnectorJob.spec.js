import { watchKonnectorJob } from './KonnectorJob'
import KonnectorJobWatcher from './konnector/KonnectorJobWatcher'

describe('watchKonnectorJob', () => {
  it('should return a job watcher', async () => {
    // Lets mock a job to pass as watchKonnectorJob parameter. This job should
    // be returned after timeout
    const job = {
      // Test attribute, not expected in job schema
      state: 'queued'
    }

    const client = {
      on: jest.fn()
    }
    const result = await watchKonnectorJob(client, job)
    expect(result instanceof KonnectorJobWatcher).toBe(true)
  })
})
