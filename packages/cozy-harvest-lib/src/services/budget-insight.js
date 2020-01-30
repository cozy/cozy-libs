import get from 'lodash/get'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import clone from 'lodash/clone'
import defaults from 'lodash/defaults'

import { waitForRealtimeResult } from './jobUtils'
import { createBIConnection, updateBIConnection, BIError } from './bi-http'
import assert from '../assert'
import { mkConnAuth } from 'cozy-bi-auth'
import biPublicKeyProd from './bi-public-key-prod.json'

const configsByMode = {
  prod: {
    mode: 'prod',
    url: 'https://cozy.biapi.pro/2.0',
    publicKey: biPublicKeyProd
  },
  dev: {
    mode: 'dev',
    url: 'https://cozytest-sandbox.biapi.pro/2.0'
  }
}

const getBIConnectionIdFromAccount = account =>
  get(account, 'data.auth.bi.connId')

const throwWrappedError = (originalError, namespace) => {
  const error = new Error(`${namespace} failed (${originalError.message})`)
  error.original = originalError
  throw error
}

const createTemporaryToken = async ({ client, account, konnector }) => {
  try {
    assert(
      account && account._id,
      'createTemporaryToken: Invalid account for createTemporaryToken'
    )
    assert(konnector.slug, 'createTemporaryToken: No konnector slug')
    const jobResponse = await client.stackClient.jobs.create('konnector', {
      mode: 'getTemporaryToken',
      konnector: konnector.slug,
      account: account._id
    })
    const event = await waitForRealtimeResult(
      client,
      jobResponse.data.attributes
    )
    return event.data.code
  } catch (e) {
    throwWrappedError(e, 'createTemporaryToken')
  }
}

const getBIModeFromCozyURL = rawCozyURL => {
  if (!rawCozyURL) {
    return 'dev'
  }
  const cozyURL = new URL(rawCozyURL)
  const domain = cozyURL.host
    .split('.')
    .slice(-2)
    .join('.')
  switch (domain) {
    case 'cozy.rocks':
    case 'mycozy.cloud':
      return 'prod'
    case 'cozy.works':
    case 'cozy.dev':
      return 'dev'
    default:
      return 'dev'
  }
}

export const getBIConfigForCozyURL = url => {
  const mode = getBIModeFromCozyURL(url)
  if (configsByMode[mode]) {
    return configsByMode[mode]
  } else {
    throw new Error(
      `getBIConfig: Unknown mode ${mode}, known modes are ${Object.keys(
        configsByMode
      ).join(', ')}`
    )
  }
}

export const isBudgetInsightConnector = konnector => {
  return (
    konnector.partnership &&
    konnector.partnership.domain.includes('budget-insight')
  )
}

/**
 * Ensures a BI connection is ready
 *
 *  - Calls the getBITemporaryToken mode of the konnector
 *
 * Then:
 * If no BI connection is present in the io.cozy.accounts:
 *  - Creates the BI connection using user supplied data
 * If a BI connection exists:
 *  - Updates the BI connection using user supplied data
 *
 * @param  {Client} options.client
 * @param  {io.cozy.accounts} options.account
 * @param  {io.cozy.konnectors} options.konnector
 * @return {BIConnection}
 */
export const createOrUpdateBIConnection = async ({
  account,
  client,
  konnector
}) => {
  try {
    const config = getBIConfigForCozyURL(client.stackClient.uri)
    const connId = getBIConnectionIdFromAccount(account)
    const tempToken = await createTemporaryToken({
      account,
      client,
      konnector
    })
    assert(tempToken, 'No temporary token')
    const credentials = { ...account.auth }
    // The konnector can have "baked-in" parameters that need to be passed in the
    // auth. This is the case for example for some konnectors for the bankId
    // parameter
    defaults(credentials, konnector.parameters)
    const credsToSend = await mkConnAuth(config, credentials)
    const connection = await (connId
      ? updateBIConnection(config, connId, credsToSend, tempToken)
      : createBIConnection(config, credsToSend, tempToken))
    return connection
  } catch (e) {
    throwWrappedError(e, 'createOrUpdateBIConnection')
  }
}

const SENSIBLE_FIELDS = ['password', 'secret', 'code', 'dob']
const removeSensibleDataFromAccount = fullAccount => {
  const account = clone(fullAccount)
  account.auth = omit(account.auth, SENSIBLE_FIELDS)
  return account
}

export const onBIAccountCreation = async ({
  account,
  client,
  konnector,
  saveAccount,
  createOrUpdateBIConnectionFn = createOrUpdateBIConnection
}) => {
  const fullAccount = account
  account = removeSensibleDataFromAccount(account)
  account = await saveAccount(konnector, account)

  const biConnection = await createOrUpdateBIConnectionFn({
    account: {
      ...fullAccount,
      _id: account._id
    },
    client,
    konnector
  })

  return merge(account, { data: { auth: { bi: { connId: biConnection.id } } } })
}

export const konnectorPolicy = {
  name: 'budget-insight',
  match: isBudgetInsightConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation
}
