import get from 'lodash/get'

import * as localStateSecret from './local'

export const checkIfOnboardingLogin = onboardingInformations => {
  return get(onboardingInformations, 'code')
}

export const generateOnboardingQueryPart = async ({
  clientName,
  redirectURI,
  softwareID,
  softwareVersion,
  clientURI,
  logoURI,
  policyURI,
  scope
}) => {
  await localStateSecret.clear()
  const { state, secret } = await localStateSecret.ensureExists()
  const oauthData = {
    redirect_uri: redirectURI,
    software_id: softwareID,
    client_name: clientName,
    software_version: softwareVersion,
    client_kind: 'mobile',
    client_uri: clientURI,
    logo_uri: logoURI,
    policy_uri: policyURI,
    onboarding: {
      app: softwareID,
      permissions: scope,
      secret: secret,
      state: state
    }
  }

  return encodeURIComponent(JSON.stringify(oauthData))
}

const addProtocolToDomain = domain => {
  const protocol = domain.includes('cozy.tools') ? 'http' : 'https'
  return `${protocol}://${domain}`
}

// Should be in cozy-client
export const doOnboardingLogin = async (
  client,
  domain,
  receivedState,
  accessCode
) => {
  try {
    const { state: localState, secret: localSecret } =
      await localStateSecret.read()
    if (localState !== receivedState) {
      throw new Error('Received state different from local state')
    }

    const uri = addProtocolToDomain(domain)
    const clientInfo = await client.stackClient.exchangeOAuthSecret(
      uri,
      localSecret
    )

    const {
      onboarding_secret: serverSecret,
      onboarding_state: serverState,
      client_id: clientID,
      client_secret: clientSecret
    } = clientInfo

    if (!(localSecret === serverSecret && localState === serverState)) {
      throw new Error('Local state/secret unequal to server state/secret')
    }

    const oauthOptions = {
      clientID,
      clientSecret
    }
    const token = await client.stackClient.fetchAccessToken(
      accessCode,
      oauthOptions,
      uri
    )
    await client.login({ uri, token })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Could not automatically login', e)
    localStateSecret.clear()
    throw e
  }
}

// Should be in cozy-client
export const registerAndLogin = async (client, url) => {
  try {
    const { token } = await client.register(url)
    await client.login({
      uri: url,
      token
    })
  } catch (registerError) {
    client.stackClient.unregister().catch(() => {})
    throw registerError
  }
}
