import get from 'lodash/get'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import clone from 'lodash/clone'
import defaults from 'lodash/defaults'

import { waitForRealtimeResult } from './jobUtils'
import {
  createBIConnection,
  updateBIConnection,
  getBIConfig,
  getBIModeFromCozyURL,
  isBudgetInsightConnector
} from './biUtils'
import assert from '../assert'
import { mkConnAuth } from 'cozy-bi-auth'

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
    const mode = getBIModeFromCozyURL(client.stackClient.uri)
    const config = getBIConfig(mode)
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
  match: isBudgetInsightConnector,
  saveInVault: false,
  onAccountCreation: onBIAccountCreation
}
