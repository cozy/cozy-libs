// @ts-check
/**
 * Interface between Budget Insight and Cozy using BI's webview
 *
 * - Deals with the konnector to get temporary tokens
 */

import { getBIConnection, getBIConnectionAccountsList } from './bi-http'
import assert from '../assert'
import logger from '../logger'
import { Q } from 'cozy-client'
// @ts-ignore (its a peerDep and I don't know how to configure ts for that)
import flag from 'cozy-flags'

import {
  setBIConnectionId,
  saveBIConfig,
  findAccountWithBiConnection,
  convertBIErrortoKonnectorJobError,
  isBudgetInsightConnector,
  getBIConnectionIdFromAccount
} from './budget-insight'
import { KonnectorJobError } from '../helpers/konnectors'
import { waitForRealtimeEvent } from './jobUtils'
import '../types'
import { LOGIN_SUCCESS_EVENT } from '../models/flowEvents'

/**
 * @typedef {import("../models/ConnectionFlow").default} ConnectionFlow
 * @typedef {object} CozyClient

 */

const TEMP_TOKEN_TIMOUT_S = 60
export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'

export const isBiWebViewConnector = konnector =>
  flag('harvest.bi.webview') && isBudgetInsightConnector(konnector)

/**
 * Runs multiple checks on the bi connection referenced in the given account
 * @param {object} options
 * @param {IoCozyAccount} options.account The account content
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {ConnectionFlow} options.flow The flow
 * @param {CozyClient} options.client CozyClient object
 *
 * @return {Promise<biConnection>} Connection Id
 */
export const checkBIConnection = async ({
  account,
  client,
  konnector,
  flow
}) => {
  try {
    let connId = getWebviewBIConnectionId(account)

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

    logger.info(`fetch connection ${connId}...`)

    const connection = await getBIConnection(config, connId, tempToken)

    const sameAccount = await findAccountWithBiConnection({
      client,
      konnector,
      connectionId: connection.id
    })
    if (sameAccount) {
      const err = new KonnectorJobError(
        'ACCOUNT_WITH_SAME_IDENTIFIER_ALREADY_DEFINED'
      )
      throw err
    }
    return connection
  } catch (err) {
    return convertBIErrortoKonnectorJobError(err)
  }
}

export const fetchContractSynchronizationUrl = async ({
  account,
  client,
  konnector
}) => {
  const { code, url, clientId } = await createTemporaryToken({
    client,
    konnector,
    account
  })
  const connId = getBIConnectionIdFromAccount(account)
  return `${url}/auth/webview/manage?client_id=${clientId}&code=${code}&connection_id=${connId}`
}

/**
 * Handles webview connection
 *
 * @param {object} options
 * @param {IoCozyAccount} options.account The account content
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {ConnectionFlow} options.flow The flow
 * @param {CozyClient} options.client CozyClient object
 * @param {Boolean} options.reconnect If this is a reconnexion
 * @param {Function} options.t Translation fonction
 * @return {Promise<Number>} Connection Id
 */
export const handleOAuthAccount = async ({
  account,
  flow,
  konnector,
  client,
  reconnect,
  t
}) => {
  if (reconnect) {
    // No need for specific action here. The trigger will be launched by the trigger manager
    const connId = getBIConnectionIdFromAccount(account)
    return connId
  }
  const cozyBankIds = getCozyBankIds({ konnector, account })
  let biWebviewAccount = {
    ...account,
    ...(cozyBankIds ? { auth: { bankIds: cozyBankIds } } : {})
  }

  const connectionId = getWebviewBIConnectionId(biWebviewAccount)

  if (connectionId) {
    logger.info(`Found a BI webview connection id: ${connectionId}`)
    flow.konnector = konnector

    biWebviewAccount = await flow.saveAccount({
      ...setBIConnectionId(biWebviewAccount, connectionId),
      ...getBiAggregatorParentRelationship(konnector)
    })

    await flow.handleFormSubmit({
      client,
      account: biWebviewAccount,
      konnector,
      t
    })
  }

  return connectionId
}

/**
 * Return the bi aggregator parent relationship configuration for a given konnector
 *
 * @param {KonnectorManifest} konnector connector manifest content
 *
 * @return {Object}
 */
const getBiAggregatorParentRelationship = konnector => {
  const biAggregatorId = konnector?.aggregator?.accountId
  if (!biAggregatorId) {
    return {}
  }
  return {
    relationships: {
      parent: {
        data: {
          _id: biAggregatorId,
          _type: ACCOUNTS_DOCTYPE
        }
      }
    }
  }
}

/**
 * Gets BI webview connection id which is returned in the account by the stack
 * via oauth callback url
 *
 * @param {IoCozyAccount} account The account content created by the stack
 *
 * @return {Number|null} Connection Id or null if no connexion
 */
const getWebviewBIConnectionId = account => {
  return Number(account?.oauth?.query?.connection_id?.[0] || null)
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

  const biConnection = await checkBIConnection({
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

  const updatedAccount = await flow.saveAccount(
    setBIConnectionId(account, biConnection.id)
  )

  flow.triggerEvent(LOGIN_SUCCESS_EVENT)

  return updatedAccount
}

/**
 * Create OAuth extra parameters specific to reconnect webview
 * @param {object} options
 * @param {Array<String>} options.biBankIds - connector bank ids (for webview connectors)
 * @param {String} options.token - BI temporary token
 * @param {Number} options.connId - BI bi connection id
 * @return {Object}
 */
const getReconnectExtraOAuthUrlParams = ({ biBankIds, token, connId }) => {
  return {
    id_connector: biBankIds,
    code: token,
    connection_id: connId
  }
}

/**
 * Create OAuth extra parameters
 * @param {object} options
 * @param {CozyClient} options.client - CozyClient instance
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @param {IoCozyAccount} options.account The account content
 * @return {Promise<Object>}
 */
export const fetchExtraOAuthUrlParams = async ({
  client,
  konnector,
  account
}) => {
  const { code: token, biBankIds } = await createTemporaryToken({
    client,
    konnector,
    account
  })

  const connId = getBIConnectionIdFromAccount(account)

  const isReconnect = Boolean(connId)

  if (isReconnect) {
    return getReconnectExtraOAuthUrlParams({
      biBankIds,
      token,
      connId
    })
  } else {
    return {
      id_connector: biBankIds,
      token
    }
  }
}

/**
 * Finds the current bankIid in a given konnector or account
 * @param {object} options
 * @param {IoCozyAccount} options.account The account content
 * @param {KonnectorManifest} options.konnector konnector manifest content
 * @return {Array<String>} - list of bank ids
 */
export const getCozyBankIds = ({ konnector, account }) => {
  const cozyBankId = konnector?.parameters?.bankId || account?.auth?.bankId

  if (cozyBankId) {
    return [cozyBankId]
  }

  const cozyBankIds = konnector?.fields?.bankId?.options.map(opt => opt?.value)
  if (!cozyBankIds?.length) {
    logger.error('Could not find any bank id')
  }
  return cozyBankIds
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
    konnector,
    account
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
  const currentContractsList = account?.relationships?.contracts?.data || []
  for (const currentContract of currentContractsList) {
    const disabledValue = convertBIDateToStandardDate(
      contractsById[currentContract.metadata.vendorId]
    )
    currentContract.metadata.imported = !disabledValue
    currentContract.metadata.disabledAt = disabledValue
  }
  await client.save(account)
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
 * @param {Array<String>} options.cozyBankIds List of cozy bank identifiers
 * @param {createTemporaryTokenResponse} options.tokenCache Previous version of BI temporary token cache
 * @return {Promise<createTemporaryTokenResponse>}
 */
async function updateCache({ client, konnector, tokenCache, cozyBankIds }) {
  const jobResponse = await client.stackClient.jobs.create(
    'konnector',
    {
      mode: 'getTemporaryToken',
      konnector: konnector.slug,
      bankIds: cozyBankIds
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
export const createTemporaryToken = async ({ client, konnector, account }) => {
  assert(
    konnector.slug,
    'createTemporaryToken: konnector passed in options has no slug'
  )

  let tokenCache = await getBiTemporaryTokenFromCache({ client })
  const cozyBankIds = getCozyBankIds({ konnector, account })

  const { data: biUser } = await client.query(
    Q('io.cozy.accounts').getById('bi-aggregator-user')
  )

  if (isCacheExpired(tokenCache, biUser)) {
    logger.debug('temporaryToken cache is expired. Updating')
    tokenCache = await updateCache({
      client,
      konnector,
      tokenCache,
      cozyBankIds
    })
  }

  assert(
    cozyBankIds.length,
    'createTemporaryToken: Could not determine cozyBankIds from account or konnector'
  )

  assert(
    tokenCache?.biMapping,
    'createTemporaryToken: could not find a BI mapping in createTemporaryToken response, you should update your konnector to the last version'
  )
  const { biMapping } = tokenCache

  tokenCache.biBankIds = [...new Set(cozyBankIds.map(id => biMapping[id]))]

  return tokenCache
}

export const konnectorPolicy = {
  isBIWebView: true,
  name: 'budget-insight-webview',
  match: isBiWebViewConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation,
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams,
  handleOAuthAccount,
  fetchContractSynchronizationUrl,
  refreshContracts
}
