import CozyClient from 'cozy-client'

import { getPouchLink } from './client'
import { startReplicationWithDebounce } from './replication'

jest.mock('cozy-client')
jest.mock('./client', () => ({
  getPouchLink: jest.fn()
}))

interface PouchLink {
  startReplication: Function
}

describe('startReplicationWithDebounce', () => {
  let client: CozyClient
  let pouchLink: PouchLink

  beforeEach(() => {
    client = new CozyClient()
    pouchLink = {
      startReplication: jest.fn()
    }
    ;(getPouchLink as jest.Mock).mockReturnValue(pouchLink)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should start replication after the specified interval', () => {
    const interval = 1000
    const replicate = startReplicationWithDebounce(client, interval)

    replicate()
    expect(pouchLink.startReplication).not.toHaveBeenCalled()
    jest.advanceTimersByTime(interval)
    expect(pouchLink.startReplication).toHaveBeenCalledTimes(1)
  })

  it('should debounce replication calls within the interval', () => {
    const interval = 1000
    const replicate = startReplicationWithDebounce(client, interval)

    replicate()
    jest.advanceTimersByTime(interval / 2)
    expect(pouchLink.startReplication).not.toHaveBeenCalled()
    replicate()
    replicate()

    jest.advanceTimersByTime(interval)
    expect(pouchLink.startReplication).toHaveBeenCalledTimes(1)
  })
})
