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
import {
  getBIConnection,
  createBIConnection,
  updateBIConnection,
  getBIUserConfig,
  updateBIUserConfig,
  setBIConnectionSyncStatus
} from './bi-http'
import assert from '../assert'
import { mkConnAuth, biErrorMap } from 'cozy-bi-auth'
import { KonnectorJobError } from '../helpers/konnectors'
import { LOGIN_SUCCESS_EVENT } from '../models/flowEvents'
import logger from '../logger'

const DECOUPLED_ERROR = 'decoupled'
const ADDITIONAL_INFORMATION_NEEDED_ERROR = 'additionalInformationNeeded'

const getBIConnectionIdFromAccount = account =>
  get(account, 'data.auth.bi.connId')

const getBIIdFromContract = bankAccount => bankAccount.vendorId

/**
 * This error map is not in the bi-auth package since it is not really
 * satisfying to have "config" mapped to LOGIN_FAILED. It might change.
 * We should not have this error if we validate the fields in the
 * front-end.
 */
const extraBIErrorMap = {
  config: 'LOGIN_FAILED'
}

/**
 * Converts and chains error
 */
const convertBIErrortoKonnectorJobError = error => {
  const errorCode = error ? error.code : null
  const cozyErrorMessage = errorCode
    ? biErrorMap[errorCode] || extraBIErrorMap[errorCode] || null
    : null
  const errorMessage =
    cozyErrorMessage ||
    (errorCode ? `UNKNOWN_ERROR.${errorCode}` : 'UNKNOWN_ERROR')
  const err = new KonnectorJobError(errorMessage)
  err.original = error
  throw err
}

export const isBudgetInsightConnector = konnector => {
  return (
    konnector.partnership &&
    konnector.partnership.domain.includes('budget-insight')
  )
}

const createTemporaryToken = async ({ client, konnector, account }) => {
  assert(
    konnector.slug,
    'createTemporaryToken: konnector passed in options has no slug'
  )
  const cozyBankId = getCozyBankId({ konnector, account })
  assert(
    cozyBankId,
    'createTemporaryToken: Could not determine cozyBankId from account or konnector'
  )
  const jobResponse = await client.stackClient.jobs.create('konnector', {
    mode: 'getTemporaryToken',
    konnector: konnector.slug,
    bankId: cozyBankId
  })
  const event = await waitForRealtimeEvent(
    client,
    jobResponse.data.attributes,
    'result',
    30 * 1000
  )
  return event.data.result
}

export const saveBIConfig = (flow, biConfig) =>
  flow.setData({
    biConfig
  })

export const getBIConfig = flow => {
  const data = flow.getData()
  return data.biConfig
}

/**
 * Ensures a BI connection is ready
 *
 *  - Calls the getBITemporaryToken mode of the konnector
 *
 * Then:
 * If no BI connection is present in the io.cozy.accounts:
 *  - Creates the BI connection using user supplied data
 * If a BI connection is defined:
 *  - Updates the BI connection using user supplied data
 * If a BI connection is defined but does not exist:
 *  - Creates the BI connection using user supplied data
 *
 * @param  {Client} options.client
 * @param  {io.cozy.accounts} options.account
 * @param  {io.cozy.konnectors} options.konnector
 * @param  {ConnectionFlow} options.flow
 * @return {BIConnection}
 */
export const createOrUpdateBIConnection = async ({
  account,
  client,
  konnector,
  flow
}) => {
  let connId = getBIConnectionIdFromAccount(account)

  logger.info('Creating temporary token...')

  const biConfig = await createTemporaryToken({
    client,
    konnector,
    account
  })
  saveBIConfig(flow, biConfig)

  const { code: tempToken, ...config } = biConfig

  logger.info('Created temporary token')
  assert(tempToken, 'No temporary token')
  const credentials = { ...account.auth }
  // The konnector can have "baked-in" parameters that need to be passed in the
  // auth. This is the case for example for some konnectors for the bankId
  // parameter
  defaults(credentials, konnector.parameters)
  const credsToSend = await mkConnAuth(config, credentials)

  try {
    if (connId) {
      try {
        logger.info(`Checking connection ${connId}...`)
        const biConnection = await getBIConnection(config, connId, tempToken)
        if (shouldResumeConnection(biConnection.error)) {
          // BI api does not allow to update a connection in 'decoupled' state wihout resume option
          // finishConnection will finish the work
          logger.info('Resumable connection, not updating identifiers')
          return biConnection
        }
      } catch (err) {
        logger.warn(`Connection ${connId} does not exist. Creating a new one`)
        connId = null
      }
    }
    logger.info('Creating or updating connection...')
    const connection = await (connId
      ? updateBIConnection(config, connId, credsToSend, tempToken)
      : createBIConnection(config, credsToSend, tempToken))

    logger.info(`Created or updated connection ${connection.id}`)
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

/**
 * Handles webauth connection
 *
 * @param {Object} options.account The account content
 * @param {Object} options.flow
 * @param {Object} options.konnector connector manifest content
 * @param {Object} options.client CozyClient object
 *
 * @return {Integer} Connection Id
 */
export const handleOAuthAccount = async ({
  account,
  flow,
  konnector,
  client,
  t
}) => {
  let webAuthAccount = clone(account)
  const cozyBankId = getCozyBankId({ konnector, account })
  if (cozyBankId) {
    set(webAuthAccount, 'auth.bankId', cozyBankId)
  }

  const connectionId = getWebauthBIConnectionId(webAuthAccount)

  if (connectionId) {
    logger.info(`Found a webauth connection id: ${connectionId}`)
    flow.konnector = konnector
    webAuthAccount = await flow.saveAccount(
      setBIConnectionId(webAuthAccount, connectionId)
    )

    await flow.handleFormSubmit({
      client,
      account: webAuthAccount,
      konnector,
      t
    })
  }

  return connectionId
}

/**
 * Gets BI webauth connection id which is returned in the account by the stack
 * via oauth callback url
 *
 * @param {io.cozy.accounts} The account content created by the stack
 *
 * @return {Integer} Connection Id
 */
const getWebauthBIConnectionId = account => {
  return Number(get(account, 'oauth.query.id_connection[0]'))
}

export const updateBIConnectionFromFlow = async (flow, connectionData) => {
  const account = flow.account

  const connId = getBIConnectionIdFromAccount(account)
  const { code: temporaryToken, ...config } = getBIConfig(flow)

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
 * @typedef biConnection
 * @property {number} id
 * @property {number} id_user
 * @property {number} id_connector
 * @property {string|null} state  - ( wrongpass | additionalInformationNeeded | websiteUnavailable | actionNeeded | SCARequired | decoupled | passwordExpired | webauthRequired | rateLimiting | bug). Null indicates a success
 * @property {string|null} last_update - Date string: Last successful update.
 * @property {string|null} created - Date string: Creation date
 * @property {boolean} active - Whether this connection is active and will be automatically synced.
 * @property {string|null} last_push - Date string: Last successfull push
 * @property {string|null} next_try - Date string: Date of next synchronization.
 */

/**
 * Checks for any number 2FA and/or decoupled requests
 *
 * - Resolves when 2FA has been resolved
 * - Triggers LOGIN_SUCCESS_EVENT
 *
 * @param  {Object} options
 * @param  {biConnection} options.biConnection
 * @param  {ConnectionFlow} options.flow
 */
export const finishConnection = async ({ flow }) => {
  let connectionError
  while (flow.getData().biConnection.error) {
    connectionError = flow.getData().biConnection.error
    if (connectionError === DECOUPLED_ERROR) {
      const twoFAOptions = { type: 'app', retry: false }
      await flow.saveTwoFARequest(twoFAOptions)
      logger.debug('Resuming BI connection...')

      await resumeBIConnection(flow)
      logger.debug('Finished waiting for decoupled connection to be validated')
    } else if (connectionError === ADDITIONAL_INFORMATION_NEEDED_ERROR) {
      const twoFAOptions = { type: 'sms', retry: false }
      await flow.saveTwoFARequest(twoFAOptions)
      logger.debug('Waiting for 2FA...')
      await flow.waitForTwoFA()
      logger.debug('Finished waiting for 2FA...')
    } else {
      connectionError = flow.getData().biConnection.error
      throw convertBIErrortoKonnectorJobError(connectionError)
    }
  }
  flow.triggerEvent(LOGIN_SUCCESS_EVENT)
}

/**
 * When a BI io.cozy.accounts is created, we create a connection on BI
 * side and store its credentials inside the io.cozy.accounts
 *
 * Creates the BI connection from the front-end
 */
export const onBIAccountCreation = async ({
  account: fullAccount,
  client,
  flow,
  konnector,
  createOrUpdateBIConnectionFn = createOrUpdateBIConnection
}) => {
  let account = removeSensibleDataFromAccount(fullAccount)

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

  // At this point, we can be in two fa request state
  await finishConnection({
    account,
    biConnection,
    client,
    flow
  })

  return account
}

export const sendTwoFACode = (flow, code) => {
  let fields

  try {
    // We can determine missing fields if we already have cached the
    // connection on the frontend
    fields = flow.getAdditionalInformationNeeded()
  } catch (e) {
    fields = null
  }

  if (fields) {
    const firstField = fields[0]
    // Update a new connection directly through the konnector policy
    logger.debug('Sending two fa through web...')
    flow.sendAdditionalInformation({
      [firstField.name]: code
    })
  } else {
    // If we are sending two fa for an existing connection, we do not
    // have the connection cached on the front-end, but the connector
    // knows the missing fields, we just have to send the two fa code
    // through the connection flow
    logger.debug('Sending two fa through connector...')
    flow.sendTwoFACode(code)
  }
}

export const getAdditionalInformationNeeded = flow => {
  const biConnection = flow.getData().biConnection
  assert(
    biConnection,
    'No BI connection saved in connection flow, cannot determine additional fields'
  )
  return biConnection.fields
}

/**
 * Sets whether a BI account (io.cozy.bank.accounts on Cozy side)
 * will be synced.
 *
 * It creates a temporary token (via the banking konnector job) and
 * calls directly BI from the front-end.
 */
export const setSync = async ({
  client,
  account,
  konnector,
  contract,
  syncStatus,

  // Used for tests
  createTemporaryToken: createTemporaryTokenOpt,
  setBIConnectionSyncStatus: setBIConnectionSyncStatusOpt
}) => {
  const { code: temporaryToken, ...config } = await (
    createTemporaryTokenOpt || createTemporaryToken
  )({
    client,
    konnector,
    account
  })

  const connId = getBIConnectionIdFromAccount(account)
  const contractId = getBIIdFromContract(contract)

  logger.info(
    `Toggling contract ${contractId} in connection ${connId}: syncStatus`
  )
  await (setBIConnectionSyncStatusOpt || setBIConnectionSyncStatus)(
    config,
    connId,
    contractId,
    syncStatus,
    temporaryToken
  )
}

export const getUserConfig = async ({ client, konnector, account }) => {
  const { code: temporaryToken, ...config } = await createTemporaryToken({
    client,
    konnector,
    account
  })
  const data = await getBIUserConfig(config, temporaryToken)
  return data
}

export const updateUserConfig = async ({
  client,
  konnector,
  userConfig,
  account
}) => {
  const { code: temporaryToken, ...config } = await createTemporaryToken({
    client,
    konnector,
    account
  })
  const data = await updateBIUserConfig(config, userConfig, temporaryToken)
  return data
}

export const getCozyBankId = ({ konnector, account }) => {
  const cozyBankId =
    get(konnector, 'parameters.bankId') || get(account, 'auth.bankId')
  if (!cozyBankId) {
    throw new Error('Could not find any bank id')
  }
  return cozyBankId
}

export const fetchExtraOAuthUrlParams = async ({
  client,
  konnector,
  account
}) => {
  const { code: token, biBankId } = await createTemporaryToken({
    client,
    konnector,
    account
  })

  return { id_connector: biBankId, token }
}

/**
 * Should the connection be resumed ?
 *
 * @param  {string} err - connection error string
 * @return {bool}
 */
const shouldResumeConnection = error => {
  return (
    error === DECOUPLED_ERROR || error === ADDITIONAL_INFORMATION_NEEDED_ERROR
  )
}

export const konnectorPolicy = {
  name: 'budget-insight',
  match: isBudgetInsightConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation,
  sendAdditionalInformation: sendAdditionalInformation,
  sendTwoFACode: sendTwoFACode,
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams,
  getAdditionalInformationNeeded,
  handleOAuthAccount,
  setSync
}
