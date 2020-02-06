/**
 * Interface between Budget Insight and Cozy.
 *
 * - Deals with the konnector to get temporary tokens
 * - Converts low-level BI errors to KonnectorJobErrors
 */

import get from 'lodash/get'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import clone from 'lodash/clone'
import defaults from 'lodash/defaults'

import { waitForRealtimeEvent } from './jobUtils'
import { createBIConnection, updateBIConnection } from './bi-http'
import assert from '../assert'
import { mkConnAuth, biErrorMap } from 'cozy-bi-auth'
import biPublicKeyProd from './bi-public-key-prod.json'
import { KonnectorJobError } from '../helpers/konnectors'
import { saveAccount } from '../connections/accounts'
import logger from '../logger'

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

/**
 * Converts and chains error
 */
const convertBIErrortoKonnectorJobError = error => {
  const errorCode = error ? error.code : null
  const cozyErrorMessage = errorCode ? biErrorMap[errorCode] : null
  const errorMessage =
    cozyErrorMessage ||
    (errorCode ? `UNKNOWN_ERROR.${errorCode}` : 'UNKNOWN_ERROR')
  const err = new KonnectorJobError(errorMessage)
  err.original = error
  throw err
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

const createTemporaryToken = async ({ client, account, konnector }) => {
  assert(
    account && account._id,
    'createTemporaryToken: Invalid account for createTemporaryToken'
  )
  assert(konnector.slug, 'createTemporaryToken: No konnector slug')
  const jobResponse = await client.stackClient.jobs.create('konnector', {
    mode: 'getTemporaryToken',
    konnector: konnector.slug,
    account: account._id,
    bankId: account.auth.bankId
  })
  const event = await waitForRealtimeEvent(
    client,
    jobResponse.data.attributes,
    'result'
  )
  return event.data.result.code
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
  const config = getBIConfigForCozyURL(client.stackClient.uri)
  const connId = getBIConnectionIdFromAccount(account)
  logger.info('Creating temporary token...')
  const tempToken = await createTemporaryToken({
    account,
    client,
    konnector
  })

  logger.info('Created temporary token')
  assert(tempToken, 'No temporary token')
  const credentials = { ...account.auth }
  // The konnector can have "baked-in" parameters that need to be passed in the
  // auth. This is the case for example for some konnectors for the bankId
  // parameter
  defaults(credentials, konnector.parameters)
  const credsToSend = await mkConnAuth(config, credentials)

  try {
    logger.info('Creating connection...')
    const connection = await (connId
      ? updateBIConnection(config, connId, credsToSend, tempToken)
      : createBIConnection(config, credsToSend, tempToken))
    logger.info(`Created connection ${connection.id}`)
    return connection
  } catch (e) {
    return convertBIErrortoKonnectorJobError(e)
  }
}

const SENSIBLE_FIELDS = ['password', 'secret', 'code', 'dob']
const removeSensibleDataFromAccount = fullAccount => {
  const account = clone(fullAccount)
  account.auth = omit(account.auth, SENSIBLE_FIELDS)
  return account
}

/**
 * Used in the custom konnector policy for BI
 */
export const onBIAccountCreation = async ({
  account,
  client,
  konnector,
  createOrUpdateBIConnectionFn = createOrUpdateBIConnection
}) => {
  const fullAccount = account
  account = removeSensibleDataFromAccount(account)
  account = await saveAccount(client, konnector, account)

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
