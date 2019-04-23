import realtime from 'cozy-realtime'
import client from 'cozy-client'
import KonnectorAccountWatcher from 'models/konnector/KonnectorAccountWatcher'

jest.mock('cozy-client', () => ({
  stackClient: {
    token: {
      token: '1234abcd'
    }
  },
  options: {
    uri: 'cozy.tools:8080'
  }
}))

jest.mock('cozy-realtime', () => ({
  subscribe: jest.fn()
}))

describe('watchKonnectorAccount', () => {
  // Lets mock an account to pass as watchKonnectorJob parameter
  const account = {
    state: 'RUNNING'
  }

  // Mock for job returned by realtime
  const updatedAccount = {
    state: 'TWOFA_NEEDED'
  }

  beforeAll(() => {
    // Mock realtime to respond immediately
    realtime.subscribe.mockResolvedValue({
      onUpdate: fn => fn(updatedAccount)
    })
  })

  afterEach(() => {
    realtime.subscribe.mockClear()
  })

  afterAll(() => {
    realtime.subscribe.mockReset()
  })

  it('should call onTwoFACodeAsked on two fa needed statuses', async () => {
    const options = {
      onTwoFACodeAsked: jest.fn()
    }
    const jobWatcher = new KonnectorAccountWatcher(client, account, options)
    await jobWatcher.watch(options)
    expect(options.onTwoFACodeAsked).toHaveBeenCalled()
    expect(options.onTwoFACodeAsked).toHaveBeenCalledWith(updatedAccount.state)
  })

  it('should not call onTwoFACodeAsked if no two fa needed statuses', async () => {
    const options = {
      onTwoFACodeAsked: jest.fn()
    }
    realtime.subscribe.mockResolvedValue({
      onUpdate: fn => fn({ state: 'NOT_A_TWOFA_NEEDED_STATE' })
    })
    const jobWatcher = new KonnectorAccountWatcher(client, account, options)
    await jobWatcher.watch(options)
    expect(options.onTwoFACodeAsked).not.toHaveBeenCalled()
  })
})
