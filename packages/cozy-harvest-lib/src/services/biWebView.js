/**
 * Interface between Budget Insight and Cozy using BI's webview
 *
 * - Deals with the konnector to get temporary tokens
 */

import { getBIConnection, getBIConnectionAccountsList } from './bi-http'
import assert from '../assert'
import logger from '../logger'
import flag from 'cozy-flags'
import {
  setBIConnectionId,
  saveBIConfig,
  findAccountWithBiConnection,
  convertBIErrortoKonnectorJobError,
  isBudgetInsightConnector
} from './budget-insight'
import { KonnectorJobError } from '../helpers/konnectors'
import { waitForRealtimeEvent } from './jobUtils'
import '../types'
import { LOGIN_SUCCESS_EVENT } from '../models/flowEvents'

const TEMP_TOKEN_TIMOUT_S = 60

export const isBiWebViewConnector = konnector =>
  flag('harvest.bi.webview') && isBudgetInsightConnector(konnector)

/**
 * Runs multiple checks on the bi connection referenced in the given account
 *
 * @param {io.cozy.accounts} options.account The account content
 * @param {ConnectionFlow} options.flow
 * @param {io.cozy.konnectors} options.konnector connector manifest content
 * @param {CozyClient} options.client CozyClient object
 *
 * @return {Integer} Connection Id
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
      err.accountId = sameAccount._id
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
  return `${url}/auth/webview/manage?client_id=${clientId}&code=${code}`
}

/**
 * Handles webview connection
 *
 * @param {io.cozy.accounts} options.account The account content
 * @param {ConnectionFlow} options.flow
 * @param {io.cozy.konnectors} options.konnector connector manifest content
 * @param {CozyClient} options.client CozyClient object
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
  const cozyBankIds = getCozyBankIds({ konnector, account })
  let biWebviewAccount = {
    ...account,
    ...(cozyBankIds ? { auth: { bankIds: cozyBankIds } } : {})
  }

  const connectionId = getWebviewBIConnectionId(biWebviewAccount)

  if (connectionId) {
    logger.info(`Found a BI webview connection id: ${connectionId}`)
    flow.konnector = konnector
    biWebviewAccount = await flow.saveAccount(
      setBIConnectionId(biWebviewAccount, connectionId)
    )

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
 * Gets BI webview connection id which is returned in the account by the stack
 * via oauth callback url
 *
 * @param {io.cozy.accounts} The account content created by the stack
 *
 * @return {Integer} Connection Id
 */
const getWebviewBIConnectionId = account => {
  return Number(account?.oauth?.query?.connection_id?.[0] || null)
}

/**
 * Hook from ConnectionFlow after account creation
 *
 * @param {io.cozy.accounts} options.account - created account
 * @param {io.cozy.konnectors} options.konnector  - manifest of the konnector for which the account is created
 * @param {ConnectionFlow} options.flow - current ConnectionFlow instance
 * @param {CozyClient} options.client - current CozyClient instance
 *
 * @returns {Promise<io.cozy.accounts>}
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

export const fetchExtraOAuthUrlParams = async ({
  client,
  konnector,
  account
}) => {
  const {
    code: token,
    biBankId,
    biBankIds
  } = await createTemporaryToken({
    client,
    konnector,
    account
  })

  return { id_connector: biBankId || biBankIds, token }
}

/**
 * Finds the current bankIid in a given konnector or account
 *
 * @param {io.cozy.accounts} options.account The account content
 * @param {io.cozy.konnectors} options.konnector connector manifest content
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
 *
 * @param {CozyClient} options.client - CozyClient instance
 * @param {io.cozy.accounts} options.account The account content
 * @param {io.cozy.konnectors} options.konnector connector manifest content
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
 * Gets a temporary token corresponding to the current BI user
 *
 * @param {CozyClient} options.client - CozyClient instance
 * @param {io.cozy.konnectors} options.konnector connector manifest content
 * @param {io.cozy.accounts} options.account The account content
 *
 * @returns {createTemporaryTokenResponse}
 */
export const createTemporaryToken = async ({ client, konnector, account }) => {
  assert(
    konnector.slug,
    'createTemporaryToken: konnector passed in options has no slug'
  )
  const cozyBankIds = getCozyBankIds({ konnector, account })
  assert(
    cozyBankIds.length,
    'createTemporaryToken: Could not determine cozyBankId from account or konnector'
  )
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
  return event.data.result
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
