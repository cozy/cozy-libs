/**
 * Interface between Budget Insight and Cozy using BI's webview
 *
 * - Deals with the konnector to get temporary tokens
 */

import get from 'lodash/get'
import clone from 'lodash/clone'
import set from 'lodash/set'

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
  convertBIErrortoKonnectorJobError
} from './budget-insight'
import { KonnectorJobError } from '../helpers/konnectors'

export const isBiWebViewConnector = konnector => {
  return (
    flag('harvest.bi.webview') &&
    konnector.partnership &&
    konnector.partnership.domain.includes('budget-insight')
  )
}

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
  let biWebviewAccount = clone(account)
  const cozyBankId = getCozyBankId({ konnector, account })
  if (cozyBankId) {
    set(biWebviewAccount, 'auth.bankId', cozyBankId)
  }

  const connectionId = getWebviewBIConnectionId(biWebviewAccount)

  if (connectionId) {
    logger.info(`Found a bi webview connection id: ${connectionId}`)
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
  return Number(get(account, 'oauth.query.connection_id[0]'))
}

export const onBIAccountCreation = async ({
  account: fullAccount,
  client,
  flow,
  konnector
}) => {
  let account = clone(fullAccount)

  account = await flow.saveAccount(account)

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

export const getCozyBankId = ({ konnector, account }) => {
  const cozyBankId =
    get(konnector, 'parameters.bankId') || get(account, 'auth.bankId')
  if (!cozyBankId) {
    throw new Error('Could not find any bank id')
  }
  return cozyBankId
}

export const konnectorPolicy = {
  isWebView: true,
  name: 'budget-insight-webview',
  match: isBiWebViewConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation,
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams,
  handleOAuthAccount
}
