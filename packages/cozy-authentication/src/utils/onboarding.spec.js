import CozyClient from 'cozy-client'

import * as localStateSecret from './local'
import * as onboarding from './onboarding'

describe('doOnboardingLogin', () => {
  let serverSecret,
    serverState,
    receivedState,
    serverAccessToken,
    localState,
    localSecret,
    client,
    fakeExchangeOAuthSecret,
    fakeFetchAccessToken
  const domain = 'fakedomain.mycozy.cloud'

  beforeEach(async () => {
    serverSecret = 'secret-123'
    serverState = 'state-abc'
    receivedState = 'state-abc'
    serverAccessToken = JSON.stringify({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      scope: ['io.cozy.files'],
      tokenType: 'token-type'
    })
    localState = 'state-abc'
    localSecret = 'secret-123'

    fakeExchangeOAuthSecret = jest.fn(() =>
      Promise.resolve({
        onboarding_secret: serverSecret,
        onboarding_state: serverState
      })
    )

    fakeFetchAccessToken = jest.fn(() => Promise.resolve(serverAccessToken))

    client = new CozyClient({ oauth: {} })
    client.stackClient.exchangeOAuthSecret = fakeExchangeOAuthSecret
    client.stackClient.fetchAccessToken = fakeFetchAccessToken
    jest.spyOn(client, 'login')

    jest.spyOn(localStateSecret, 'clear')
    await localStateSecret.write({
      state: localState,
      secret: localSecret
    })
  })

  const doOnboardingLogin = () =>
    onboarding.doOnboardingLogin(client, domain, receivedState, 'code')

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
    await expect(doOnboardingLogin()).rejects.toEqual(
      new Error('Received state different from local state')
    )
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should clear state/secret and throw when local state/secret differ from server', async () => {
    serverState = 'state-abc'
    serverSecret = 'secret-456'
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(doOnboardingLogin()).rejects.toEqual(
      new Error('Local state/secret unequal to server state/secret')
    )
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should correctly configure the client after login', async () => {
    await doOnboardingLogin()
    expect(client.stackClient.uri).toBe('https://fakedomain.mycozy.cloud')
    expect(client.stackClient.token).toEqual(JSON.parse(serverAccessToken))
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

  it('should clear the local secret', async () => {
    jest.spyOn(localStateSecret, 'clear')
    await onboarding.generateOnboardingQueryPart(options)
    expect(localStateSecret.clear).toHaveBeenCalled()
  })

  it('should generate an uri suitable for onboarding', async () => {
    const uri = await onboarding.generateOnboardingQueryPart(options)
    expect(JSON.parse(decodeURIComponent(uri))).toEqual({
      client_kind: 'mobile',
      client_name: 'clientName',
      client_uri: 'clientURI',
      logo_uri: 'logoURI',
      onboarding: {
        app: 'softwareID',
        permissions: 'scope',
        secret: expect.any(String),
        state: expect.any(String)
      },
      policy_uri: 'policyURI',
      redirect_uri: 'redirectURI',
      software_id: 'softwareID',
      software_version: 'softwareVersion'
    })
  })

  it('should generate state/secret and save them locally', async () => {
    const { state: stateBefore, secret: secretBefore } =
      await localStateSecret.read()
    expect(stateBefore).toBeNull()
    expect(secretBefore).toBeNull()
    await onboarding.generateOnboardingQueryPart(options)
    const { state: stateAfter, secret: secretAfter } =
      await localStateSecret.read()
    expect(stateAfter).not.toBeNull()
    expect(secretAfter).not.toBeNull()
  })
})
