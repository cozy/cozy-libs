import CozyClient from 'cozy-client'
import KonnectorJobWatcher, { watchKonnectorJob } from './KonnectorJobWatcher'

describe('watchKonnectorJob', () => {
  it('should return a job watcher', async () => {
    // Lets mock a job to pass as watchKonnectorJob parameter. This job should
    // be returned after timeout
    const job = {
      _id: 'job-id',
      // Test attribute, not expected in job schema
      state: 'queued'
    }

    const client = new CozyClient({
      uri: 'http://cozy.tools:8080'
    })
    client.on = jest.fn()
    const result = await watchKonnectorJob(client, job)
    expect(result instanceof KonnectorJobWatcher).toBe(true)
  })
})
