/**
 * Interface between Budget Insight and Cozy.
 *
 * - Deals with the konnector to get temporary tokens
 * - Converts low-level BI errors to KonnectorJobErrors
 */

import get from 'lodash/get'
import omit from 'lodash/omit'
import clone from 'lodash/clone'
import set from 'lodash/set'
import defaults from 'lodash/defaults'

import { waitForRealtimeEvent } from './jobUtils'
import { createBIConnection, updateBIConnection } from './bi-http'
import assert from '../assert'
import { mkConnAuth, biErrorMap } from 'cozy-bi-auth'
import biPublicKeyProd from './bi-public-key-prod.json'
import { KonnectorJobError } from '../helpers/konnectors'
import { LOGIN_SUCCESS_EVENT } from '../models/ConnectionFlow'
import harvestLogger from '../logger'

const DECOUPLED_ERROR = 'decoupled'
const ADDITIONAL_INFORMATION_NEEDED_ERROR = 'additionalInformationNeeded'

const logger = harvestLogger('harvest/bi')

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
    'createTemporaryToken: Account without id passed to createTemporaryToken'
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

export const saveTemporaryToken = (flow, tempToken) =>
  flow.setData({
    tempToken
  })

export const getTemporaryToken = flow => {
  const data = flow.getData()
  return data.tempToken
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
  konnector,
  flow
}) => {
  const config = getBIConfigForCozyURL(client.stackClient.uri)
  const connId = getBIConnectionIdFromAccount(account)
  logger.info('Creating temporary token...')

  const tempToken = await createTemporaryToken({
    account,
    client,
    konnector
  })
  saveTemporaryToken(flow, tempToken)

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

export const setBIConnectionId = (originalAccount, biConnectionId) => {
  const account = clone(originalAccount)
  set(account, 'data.auth.bi.connId', biConnectionId)
  return account
}

export const getBIConnectionId = account => {
  return get(account, 'data.auth.bi.connId')
}

export const updateBIConnectionFromFlow = async (flow, connectionData) => {
  const client = flow.client
  const account = flow.account

  const config = getBIConfigForCozyURL(client.stackClient.uri)
  const connId = getBIConnectionIdFromAccount(account)
  const temporaryToken = getTemporaryToken(flow)

  logger.debug('Updating BI connection')
  const updatedConnection = await updateBIConnection(
    config,
    connId,
    connectionData,
    temporaryToken
  )
  logger.info('Updated BI connection')

  flow.setData({ biConnection: updatedConnection })
}

export const sendAdditionalInformation = (flow, fields) => {
  return updateBIConnectionFromFlow(flow, fields)
}

export const resumeBIConnection = flow => {
  return updateBIConnectionFromFlow(flow, { resume: 'true' })
}

/**
 * Checks for 2FA or decoupled requests
 *
 * - Resolves when 2FA has been resolved
 * - Triggers LOGIN_SUCCESS_EVENT
 */
export const finishConnection = async ({ biConnection, flow }) => {
  if (biConnection.error) {
    if (biConnection.error === DECOUPLED_ERROR) {
      const twoFAOptions = { type: 'app', retry: false }
      await flow.saveTwoFARequest(twoFAOptions)
      logger.debug('Resuming BI connection...')
      await resumeBIConnection(flow)
      flow.triggerEvent(LOGIN_SUCCESS_EVENT)
      logger.debug('Finished waiting for decoupled connection to be validated')
    } else if (biConnection.error === ADDITIONAL_INFORMATION_NEEDED_ERROR) {
      const twoFAOptions = { type: 'sms', retry: false }
      while (
        flow.getData().biConnection.error === 'additionalInformationNeeded'
      ) {
        await flow.saveTwoFARequest(twoFAOptions)
        await flow.waitForTwoFA()
      }
      flow.triggerEvent(LOGIN_SUCCESS_EVENT)
    } else {
      throw convertBIErrortoKonnectorJobError(biConnection.error)
    }
  } else {
    flow.triggerEvent(LOGIN_SUCCESS_EVENT)
  }
}

/**
 * Used in the custom konnector policy for BI
 */
export const onBIAccountCreation = async ({
  account,
  client,
  flow,
  konnector,
  createOrUpdateBIConnectionFn = createOrUpdateBIConnection
}) => {
  const fullAccount = account
  account = removeSensibleDataFromAccount(account)

  account = await flow.saveAccount(account)

  const biConnection = await createOrUpdateBIConnectionFn({
    account: {
      ...fullAccount,
      _id: account._id
    },
    client,
    konnector,
    flow
  })

  flow.setData({
    biConnection
  })

  account = await flow.saveAccount(setBIConnectionId(account, biConnection.id))

  // At this point, we can be in two fa request stat
  await finishConnection({
    account,
    biConnection,
    client,
    flow
  })

  return account
}

export const getAdditionalInformationNeeded = flow => {
  const biConnection = flow.getData().biConnection
  assert(
    biConnection,
    'No BI connection saved in connection flow, cannot determine additional fields'
  )
  return biConnection.fields
}

export const konnectorPolicy = {
  name: 'budget-insight',
  match: isBudgetInsightConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation,
  sendAdditionalInformation: sendAdditionalInformation,
  getAdditionalInformationNeeded
}
