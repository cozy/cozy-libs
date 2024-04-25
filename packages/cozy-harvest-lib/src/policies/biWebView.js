// @ts-check
/**
 * Interface between Budget Insight and Cozy using BI's webview
 *
 * - Deals with the konnector to get temporary tokens
 */

import clone from 'lodash/clone'
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'
import set from 'lodash/set'

import { biErrorMap } from 'cozy-bi-auth'
import { Q } from 'cozy-client'
import PromiseCache from 'cozy-client/dist/promise-cache'
import { receiveMutationResult } from 'cozy-client/dist/store'
// @ts-ignore (its a peerDep and I don't know how to configure ts for that)

import assert from '../assert'
import { KonnectorJobError } from '../helpers/konnectors'
import logger from '../logger'
import { LOGIN_SUCCESS_EVENT } from '../models/flowEvents'
import {
  getBIConnectionAccountsList,
  getBIConnection
} from '../services/bi-http'
import { waitForRealtimeEvent } from '../services/jobUtils'
import '../types'

const promiseCache = new PromiseCache()

/**
 * @typedef {import("../models/ConnectionFlow").default} ConnectionFlow
 * @typedef {object} CozyClient

 */

const TEMP_TOKEN_TIMOUT_S = 60
export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'

export const isBiWebViewConnector = konnector =>
  isBudgetInsightConnector(konnector)

/**
 * Runs multiple checks on the bi connection referenced in the given account
 * @param {object} options
 * @param {number} options.connId The BI connection identifier
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {CozyClient} options.client CozyClient object
 *
 * @return {Promise<void|KonnectorJobError}
 * @throws KonnectorJobError
 */
export const checkBIConnection = async ({ connId, client, konnector }) => {
  try {
    logger.info('Creating temporary token...')

    const sameAccount = await findAccountWithBiConnection({
      client,
      konnector,
      connectionId: connId
    })
    if (sameAccount) {
      const err = new KonnectorJobError(
        'ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED'
      )
      throw err
    }
    return
  } catch (err) {
    return convertBIErrortoKonnectorJobError(err)
  }
}

/**
 * Handles webview connection
 *
 * @param {object} options
 * @param {IoCozyAccount} options.account The account content
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {ConnectionFlow} options.flow The flow
 * @param {CozyClient} options.client CozyClient object
 * @param {Boolean} options.reconnect If this is a reconnection
 * @param {Function} options.t Translation fonction
 * @return {Promise<Boolean>} true if the trigger manager should create the trigger itself
 */
export const handleOAuthAccount = async ({ flow }) => {
  flow.triggerEvent(LOGIN_SUCCESS_EVENT)
  return false
}

/**
 * Gets BI webview connection id from the account. The connection id can be in different places depending on context :
 * - after connection creation : in account.oauth.query.connection_id. The account is created by the stack after webview return
 * - after connection manage : in account.data.auth.bi.connId. The account is created by the stack after webview return
 *
 * @param {IoCozyAccount} account The account content
 *
 * @return {Number|null} Connection Id or null if no connexion
 */
const getWebviewBIConnectionId = account => {
  return Number(account?.data?.auth?.bi?.connId || null)
}

/**
 * Hook from ConnectionFlow after account creation
 * @param {object} options
 * @param {IoCozyAccount} options.account - created account
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {ConnectionFlow} options.flow - current ConnectionFlow instance
 * @param {CozyClient} options.client - current CozyClient instance
 *
 * @returns {Promise<IoCozyAccount>}
 */
export const onBIAccountCreation = async ({
  account: fullAccount,
  client,
  flow,
  konnector
}) => {
  const account = await flow.saveAccount(fullAccount)
  const connId = getWebviewBIConnectionId(account)

  if (connId === null) {
    throw new Error(
      'onBIAccountCreation: bi connection id should not be null on creation'
    )
  }

  await checkBIConnection({
    connId,
    client,
    konnector
  })

  const updatedAccount = await flow.saveAccount(
    setBIConnectionId(account, connId)
  )

  flow.triggerEvent(LOGIN_SUCCESS_EVENT)

  return updatedAccount
}

/**
 * Create OAuth extra parameters specific to reconnect or manage webview (which need the same parameters)
 *
 * @param {object} options
 * @param {Array<String>} options.uuids - connector bank uuids (for webview connectors)
 * @param {String} options.token - BI temporary token
 * @param {Number|null} options.connId - BI bi connection id
 * @return {Object}
 */
const getReconnectOrManageExtraOAuthUrlParams = ({ uuids, token, connId }) => {
  return {
    connector_uuids: uuids,
    code: token,
    connection_id: connId
  }
}

/**
 * Create OAuth extra parameters
 *
 * @param {object} options
 * @param {CozyClient} options.client - CozyClient instance
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {IoCozyAccount} options.account The account content
 * @param {Boolean} options.reconnect If this is a reconnection
 * @param {Boolean} options.manage If this is a manage
 * @return {Promise<Object>}
 */
export const fetchExtraOAuthUrlParams = async ({
  client,
  konnector,
  account,
  reconnect = false,
  manage = false
}) => {
  const { code: token, ...config } = await createTemporaryToken({
    client,
    konnector
  })
  const connId = getWebviewBIConnectionId(account)

  if (reconnect || manage) {
    return getReconnectOrManageExtraOAuthUrlParams({
      uuids: Object.keys(konnector.biUuids),
      token,
      connId
    })
  } else {
    let uuid
    if (connId && konnector.biUuids.length > 1) {
      // we want to get the bi bank uuiid of the connection. This way, the user does not need
      // to choose his bank each time he want to update his synchronizations
      const connection = await getBIConnection(config, connId, token)
      uuid = connection.connector_uuid
    }
    return {
      connector_uuids: uuid ? uuid : Object.keys(konnector.biUuids),
      token
    }
  }
}

/**
 * Update imported state of contracts in the given account, according to current state of the accounts on the BI side.
 * @param {object} options
 * @param {CozyClient} options.client - CozyClient instance
 * @param {IoCozyAccount} options.account The account content
 * @param {KonnectorManifest} options.konnector konnector manifest content
 */
export const refreshContracts = async ({ client, konnector, account }) => {
  const biConfig = await createTemporaryToken({
    client,
    konnector
  })
  const { code, ...config } = biConfig
  const connectionId = getWebviewBIConnectionId(account)
  const { accounts: contracts } = await getBIConnectionAccountsList(
    config,
    connectionId,
    code
  )

  const contractsById = contracts.reduce(
    (memo, contract) => ({ ...memo, [contract.id + '']: contract.disabled }),
    {}
  )
  const { data: currentContractsList } = await client.query(
    Q('io.cozy.bank.accounts')
      .where({ 'relationships.connection.data._id': account._id })
      .include(['owners'])
      .indexFields(['relationships.connection.data._id'])
  )
  for (const currentContract of currentContractsList) {
    const disabledValue = convertBIDateToStandardDate(
      contractsById[currentContract.vendorId]
    )
    const hasChanged = currentContract.metadata.disabledAt !== disabledValue
    if (hasChanged) {
      const newMetadata = {
        disabledAt: disabledValue,
        imported: !disabledValue
      }
      // update the cozy-client store only to let the use see the result of the update fast
      // but without creating conflict with the update which will come from the BI webhooks
      client.store.dispatch(
        receiveMutationResult('contract-memory-update', {
          data: [
            {
              ...currentContract,
              metadata: { ...currentContract.metadata, ...newMetadata }
            }
          ]
        })
      )
    }
  }
}

function convertBIDateToStandardDate(biDate) {
  return biDate?.replace(' ', 'T')
}

/**
 * Get the BI temporary token cache from Cozy doctype
 *
 * @param {CozyClient} options.client CozyClient instance
 * @return {Promise<createTemporaryTokenResponse>}
 */
async function getBiTemporaryTokenFromCache({ client }) {
  const queryResult = await client.query(
    Q('io.cozy.bank.settings').getById('bi')
  )
  return queryResult?.data || {}
}

/**
 * Check if BI temporary token cache is expired or not
 * @param {createTemporaryTokenResponse} tokenCache
 * @param {Object} biUser the bi user
 * @return {Boolean}
 */
export function isCacheExpired(tokenCache, biUser) {
  const cacheAge = Date.now() - Number(tokenCache?.timestamp)
  logger.debug('tokenCache age', cacheAge / 1000 / 60, 'minutes')
  const MAX_TOKEN_CACHE_AGE = 29 * 60 * 1000
  const isSameUserId = tokenCache.userId === biUser?.userId
  if (tokenCache && cacheAge < MAX_TOKEN_CACHE_AGE && isSameUserId) {
    return false
  }

  if (!isSameUserId) {
    logger.warn(
      `BI user id in cache ${tokenCache.userId} is different than current user id ${biUser?.userId}`
    )
  }
  return true
}

/**
 * Update the BI temporary token cache from BI itself
 * @param {object} options
 * @param {CozyClient} options.client CozyClient instance
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {createTemporaryTokenResponse} options.tokenCache Previous version of BI temporary token cache
 * @return {Promise<createTemporaryTokenResponse>}
 */
async function updateCache({ client, konnector, tokenCache }) {
  const jobResponse = await client.stackClient.jobs.create(
    'konnector',
    {
      mode: 'getTemporaryToken',
      konnector: konnector.slug
    },
    {},
    true
  )
  const event = await waitForRealtimeEvent(
    client,
    jobResponse.data.attributes,
    'result',
    TEMP_TOKEN_TIMOUT_S * 1000
  )
  const saveResult = await client.save({
    _type: 'io.cozy.bank.settings',
    _id: 'bi',
    ...(tokenCache?._rev ? { _rev: tokenCache._rev } : {}),
    timestamp: Date.now(),
    ...event.data.result
  })
  return saveResult.data
}

/**
 * Gets a temporary token corresponding to the current BI user
 * @param {object} options
 * @param {CozyClient} options.client - CozyClient instance
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {IoCozyAccount} options.account The account content
 *
 * @returns {Promise<createTemporaryTokenResponse>}
 */
export const createTemporaryToken = async ({ client, konnector }) => {
  // @ts-ignore La propriété 'exec' n'existe pas sur le type 'PromiseCache'.
  return await promiseCache.exec(
    async () => {
      assert(
        konnector.slug,
        'createTemporaryToken: konnector passed in options has no slug'
      )

      let tokenCache = await getBiTemporaryTokenFromCache({ client })

      const { data: biUser } = await client.query(
        Q('io.cozy.accounts').getById('bi-aggregator-user')
      )

      if (isCacheExpired(tokenCache, biUser)) {
        logger.debug('temporaryToken cache is expired. Updating')
        // @ts-ignore
        tokenCache = await updateCache({
          client,
          konnector,
          tokenCache
        })
      }

      return tokenCache
    },
    () => 'createTemporaryToken'
  )
}

export const konnectorPolicy = {
  isBIWebView: true,
  needsAccountAndTriggerCreation: false,
  needsTriggerLaunch: true,
  isRunnable: () => true,
  name: 'budget-insight-webview',
  match: isBiWebViewConnector,
  shouldSaveInVault: () => false,
  onAccountCreation: onBIAccountCreation,
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams,
  handleOAuthAccount,
  refreshContracts,
  // ConnectionFlow display OAuthWindow only when there is an error and when this error is solvable with it
  shouldLaunchRedirectToEdit: () => false,
  /**
   * @param {import('./../helpers/konnectors').KonnectorJobError} error - current error in ConnectionFlow
   * @returns
   */
  shouldLaunchDisplayOAuthWindow: error => {
    return error && error.isSolvableViaReconnect()
  },
  shouldDisplayRunningAlert: () => false
}

export const setBIConnectionId = (originalAccount, biConnectionId) => {
  const account = clone(originalAccount)
  set(account, 'data.auth.bi.connId', biConnectionId)
  return account
}

/**
 * Tries to find an existing account, associated to an existing trigger
 * with the given bi connection id
 *
 * @param  {CozyClient} options.client - Cozy client
 * @param  {Object} options.konnector - Konnector manifest
 * @param  {Integer} options.connectionId - BI connection id
 * @return {Account|null} An account with a trigger with the same identifier if any
 */
export const findAccountWithBiConnection = async ({
  client,
  konnector,
  connectionId
}) => {
  const [accountsResult, triggersResult] = await Promise.all([
    client.query(
      Q('io.cozy.accounts')
        .where({ data: { auth: { bi: { connId: connectionId } } } })
        .indexFields(['data.auth.bi.connId'])
    ),
    client.query(
      Q('io.cozy.triggers')
        .where({
          message: {
            konnector: konnector.slug
          }
        })
        .indexFields(['message.konnector'])
    )
  ])

  const accountsIndex = keyBy(accountsResult.data, '_id')
  const trigger = triggersResult.data.find(
    t => accountsIndex[get(t, 'message.account')]
  )
  return trigger ? accountsIndex[trigger.message.account] : null
}

/**
 * Converts and chains error
 */
export const convertBIErrortoKonnectorJobError = error => {
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

export const isBudgetInsightConnector = konnector =>
  konnector?.partnership?.domain === 'budget-insight.com'

/**
 * This error map is not in the bi-auth package since it is not really
 * satisfying to have "config" mapped to LOGIN_FAILED. It might change.
 * We should not have this error if we validate the fields in the
 * front-end.
 */
const extraBIErrorMap = {
  config: 'LOGIN_FAILED',
  ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED:
    'ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED'
}
