import * as onboarding from './onboarding'
import * as localStateSecret from './local'
 
describe('doOnboardingLogin', () => {
  let serverSecret,
    serverState,
    receivedState,
    serverAccessToken,
    localState,
    localSecret,
    client
  const domain = 'fakedomain.mycozy.cloud'

  beforeEach(async () => {
    serverSecret = 'secret-123'
    serverState = 'state-abc'
    receivedState = 'state-abc'
    serverAccessToken = 'access-token'
    localState = 'state-abc'
    localSecret = 'secret-123'
    client = {
      stackClient: {
        exchangeOAuthSecret: jest.fn(() => Promise.resolve({
          onboarding_secret: serverSecret,
          onboarding_state: serverState
        })),
        fetchAccessToken: jest.fn(() => Promise.resolve(serverAccessToken))
      },
      login: jest.fn()
    }
    jest.spyOn(localStateSecret, 'clear')
    await localStateSecret.write({
      state: localState,
      secret: localSecret
    })
  })

  const doOnboardingLogin = () => onboarding.doOnboardingLogin(client, domain, receivedState, 'code')

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should clear state/secret and throw when fetching the token produces an error', async () => {
    client.stackClient.fetchAccessToken.mockRejectedValue({
      message: 'Could not fetch access token'
    })

    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(doOnboardingLogin()).rejects.toEqual({
      message: 'Could not fetch access token'
    })
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should clear state/secret and throw when received state different from local state', async () => {
    receivedState = 'state-def'
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(doOnboardingLogin()).rejects.toEqual(new Error(
      'Received state different from local state'
    ))
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should clear state/secret and throw when local state/secret differ from server', async () => {
    serverState = 'state-abc'
    serverSecret = 'secret-456'
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(doOnboardingLogin()).rejects.toEqual(new Error(
      'Local state/secret unequal to server state/secret'
    ))
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should call login on client when everything worked', async () => {
    await doOnboardingLogin()
    expect(client.login).toHaveBeenCalledWith({
      token: 'access-token',
      url: 'https://fakedomain.mycozy.cloud'
    })
  })
})

describe('generateURI', () => {
  const options = {
    clientName: 'clientName',
    redirectURI: 'redirectURI',
    softwareID: 'softwareID',
    softwareVersion: 'softwareVersion',
    clientURI: 'clientURI',
    logoURI: 'logoURI',
    policyURI: 'policyURI',
    scope: 'scope'
  }

  beforeEach(async () => {
    await localStateSecret.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should generate an uri suitable for onboarding', async () => {
    const uri = await onboarding.generateOnboardingQueryPart(options)
    expect(JSON.parse(decodeURIComponent(uri))).toEqual({
     "client_kind": "mobile",
     "client_name": "clientName",
     "client_uri": "clientURI",
     "logo_uri": "logoURI",
     "onboarding": {
       "app": "softwareID",
       "permissions": "scope",
       "secret": expect.any(String),
       "state": expect.any(String)
     },
     "policiy_uri": "policyURI",
     "redirect_uri": "redirectURI",
     "software_id": "softwareID",
     "software_version": "softwareVersion",
    })
  })

  it('should generate state/secret and save them locally', async () => {
    const { state: stateBefore, secret: secretBefore } = await localStateSecret.read()
    expect(stateBefore).toBeNull()
    expect(secretBefore).toBeNull()
    await onboarding.generateOnboardingQueryPart(options)
    const { state: stateAfter, secret: secretAfter } = await localStateSecret.read()
    expect(stateAfter).not.toBeNull()
    expect(secretAfter).not.toBeNull()
  })
})
