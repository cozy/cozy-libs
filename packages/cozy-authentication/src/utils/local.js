import localforage from 'localforage'

const ONBOARDING_SECRET_KEY = 'onboarding_secret'
const ONBOARDING_STATE = 'onboarding_state'

const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .substr(2, 11)
}

export const read = async () => {
  const state = await localforage.getItem(ONBOARDING_STATE)
  const secret = await localforage.getItem(ONBOARDING_SECRET_KEY)
  return { state, secret }
}

export const clear = async () => {
  await localforage.removeItem(ONBOARDING_STATE)
  await localforage.removeItem(ONBOARDING_SECRET_KEY)
}

export const generate = () => {
  const secret = generateRandomString()
  const state = generateRandomString()
  return { state, secret }
}

export const write = async ({ state, secret }) => {
  await localforage.setItem(ONBOARDING_SECRET_KEY, secret)
  await localforage.setItem(ONBOARDING_STATE, state)
}

/** Returns state/secret. Generates them if one of them is absent */
export const ensureExists = async () => {
  let { state, secret } = await read()
  if (!state || !secret) {
    const res = generate()
    await write(res)
    state = res.state
    secret = res.secret
  }
  return { state, secret }
}
