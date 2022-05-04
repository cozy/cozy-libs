/**
 * Interface between Budget Insight and Cozy using BI's webview
 *
 * - Deals with the konnector to get temporary tokens
 */

import { getBIConnection } from './bi-http'
import assert from '../assert'
import logger from '../logger'
import flag from 'cozy-flags'
import {
  fetchExtraOAuthUrlParams,
  createTemporaryToken,
  setBIConnectionId,
  saveBIConfig,
  findAccountWithBiConnection,
  convertBIErrortoKonnectorJobError,
  isBudgetInsightConnector
} from './budget-insight'
import { KonnectorJobError } from '../helpers/konnectors'

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
  const cozyBankId = getCozyBankId({ konnector, account })
  let biWebviewAccount = {
    ...account,
    ...(cozyBankId ? { auth: { bankId: cozyBankId } } : {})
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

  return await flow.saveAccount(setBIConnectionId(account, biConnection.id))
}

/**
 * Finds the current bankIid in a given konnector or account
 *
 * @param {io.cozy.accounts} options.account The account content
 * @param {io.cozy.konnectors} options.konnector connector manifest content
 */
export const getCozyBankId = ({ konnector, account }) => {
  const cozyBankId = konnector?.parameters?.bankId || account?.auth?.bankId
  if (!cozyBankId) {
    logger.error('Could not find any bank id')
  }
  return cozyBankId
}

export const konnectorPolicy = {
  isBIWebView: true,
  name: 'budget-insight-webview',
  match: isBiWebViewConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation,
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams,
  handleOAuthAccount
}
