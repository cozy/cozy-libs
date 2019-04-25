import localforage from 'localforage'
import get from 'lodash/get'

const ONBOARDING_SECRET_KEY = 'onboarding_secret'
const ONBOARDING_STATE = 'onboarding_state'

const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .substr(2, 11)
}
export const writeSecret = secret => {
  return localforage.setItem(ONBOARDING_SECRET_KEY, secret)
}

export const readSecret = () => {
  return localforage.getItem(ONBOARDING_SECRET_KEY)
}

export const clearSecret = () => {
  return localforage.removeItem(ONBOARDING_SECRET_KEY)
}

export const writeState = state => {
  return localforage.setItem(ONBOARDING_STATE, state)
}

export const readState = () => {
  return localforage.getItem(ONBOARDING_STATE)
}

export const clearState = () => {
  return localforage.removeItem(ONBOARDING_STATE)
}

const generateState = () => {
  return generateRandomString()
}
const generateSecret = () => {
  return generateRandomString()
}

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
  let secret = await readSecret()
  if (!secret) {
    secret = generateSecret()
    await writeSecret(secret)
  }
  let state = await readState()

  if (!state) {
    state = generateState()
    await writeState(state)
  }
  const oauthData = {
    redirect_uri: redirectURI,
    software_id: softwareID,
    client_name: clientName,
    software_version: softwareVersion,
    client_kind: 'mobile',
    client_uri: clientURI,
    logo_uri: logoURI,
    policiy_uri: policyURI,
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

export const doOnboardingLogin = async (client, domain, receivedState, accessCode) => {
  try {
    const localState = 'mystate' || await readState()
    const localSecret = 'mysecret' || await readSecret()
    if (localState !== receivedState) {
      throw new Error('States are not equals')
    }

    const url = addProtocolToDomain(domain)
    const clientInfo = await client.stackClient.exchangeOAuthSecret(
      url,
      localSecret
    )

    const {
      onboarding_secret,
      onboarding_state,
      client_id,
      client_secret
    } = clientInfo

    if (
      !(localSecret === onboarding_secret && localState === onboarding_state)
    ) {
      throw new Error('exchanged informations are not good')
    }

    const oauthOptions = {
      clientID: client_id,
      clientSecret: client_secret
    }
    const token = await client.stackClient.fetchAccessToken(
      accessCode,
      oauthOptions,
      url
    )
    await client.login({ url, token })
  } catch (e) {
    clearState()
    clearSecret()
    throw e
  }
}

