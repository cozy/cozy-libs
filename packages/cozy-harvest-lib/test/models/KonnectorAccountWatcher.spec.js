import KonnectorAccountWatcher from 'models/konnector/KonnectorAccountWatcher'

const client = {
  stackClient: {
    uri: 'cozy.tools:8080',
    token: {
      token: '1234abcd'
    }
  },
  options: {
    uri: 'cozy.tools:8080'
  },
  on: () => jest.fn()
}

describe('watchKonnectorAccount', () => {
  // Lets mock an account to pass as watchKonnectorJob parameter
  const account = {
    state: 'RUNNING'
  }

  // Mock for job returned by realtime
  const updatedAccount = {
    state: 'TWOFA_NEEDED'
  }

  it('should call onTwoFACodeAsked on two fa needing statuses', async () => {
    const options = { onTwoFACodeAsked: jest.fn() }
    const accountWatcher = new KonnectorAccountWatcher(client, account, options)
    accountWatcher.realtime.subscribe = (client, type, id, fn) =>
      fn(updatedAccount)
    await accountWatcher.watch(options)
    expect(options.onTwoFACodeAsked).toHaveBeenCalled()
    expect(options.onTwoFACodeAsked).toHaveBeenCalledWith(updatedAccount.state)
  })

  it('should not call onTwoFACodeAsked if no two fa needed statuses', async () => {
    const options = { onTwoFACodeAsked: jest.fn() }
    const accountWatcher = new KonnectorAccountWatcher(client, account, options)
    accountWatcher.realtime.subscribe = (client, type, id, fn) =>
      fn({ state: 'NOT_A_TWOFA_NEEDED_STATE' })
    await accountWatcher.watch(options)
    expect(options.onTwoFACodeAsked).not.toHaveBeenCalled()
  })
})
