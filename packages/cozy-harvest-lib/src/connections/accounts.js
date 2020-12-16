import { Q } from 'cozy-client'
import * as triggersModel from '../helpers/triggers'

import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import assert from '../assert'
import logger from '../logger'

export const ACCOUNTS_DOCTYPE = 'io.cozy.accounts'
const PERMISSIONS_DOCTYPE = 'io.cozy.permissions'

/**
 * Create an account for the given konnector.
 * @param  {Object}  client     CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  attributes Account attributes
 */
export const createAccount = async (client, konnector, attributes) => {
  const { data } = konnector.aggregator
    ? await createChildAccount(client, konnector, attributes)
    : await client.create(ACCOUNTS_DOCTYPE, attributes)
  return data
}

export const createAccountQuerySpec = accountId => {
  if (!accountId) {
    throw new Error('createAccountQuerySpec called with undefined accountId')
  }
  return {
    query: Q(ACCOUNTS_DOCTYPE).getById(accountId),
    as: `io.cozy.accounts/${accountId}`
  }
}

/**
 * Fetches an account
 * Returns null if the account does not exist
 * @param  {Object}  client CozyClient
 * @param  {string}  id     io.cozy.accounts document's id
 * @return {Object}         Retrieved account
 */
export const fetchAccount = async (client, id) => {
  try {
    const qspec = createAccountQuerySpec(id)
    const { data } = await client.query(qspec.query, qspec)
    return data
  } catch (error) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Creates an account for an konnector needing an aggregator account.
 * Creates the aggregator account as well if it does not exist.
 * @param  {Object}  client     CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  attributes Account attibutes
 * @return {Object}             The created io.cozy.accounts document
 */
const createChildAccount = async (client, konnector, attributes) => {
  const { aggregator } = konnector

  if (!aggregator || !aggregator.accountId)
    throw new Error('Konnector does not provide aggregator account id')

  const parentAccountId = aggregator.accountId

  let parentAccount
  try {
    parentAccount = await fetchAccount(client, parentAccountId)
  } catch (error) {
    throw new Error(
      `An error occurred when finding parent account ${parentAccountId} (${error.message})`
    )
  }

  if (!parentAccount) {
    try {
      parentAccount = await client.create(ACCOUNTS_DOCTYPE, {
        _id: parentAccountId
      })
    } catch (error) {
      throw new Error(
        `Cannot create parent account ${parentAccountId} (${error.message})`
      )
    }
  }

  try {
    await client.collection(PERMISSIONS_DOCTYPE).add(konnector, {
      aggregatorAccount: {
        type: ACCOUNTS_DOCTYPE,
        verbs: ['GET', 'PUT'],
        values: [`${ACCOUNTS_DOCTYPE}.${parentAccountId}`]
      }
    })
  } catch (error) {
    logger.warn(error)
    throw new Error(
      `Cannot set permission for account ${parentAccountId} (${error.message})`
    )
  }

  return await client.create(ACCOUNTS_DOCTYPE, {
    ...attributes,
    relationships: {
      parent: {
        data: {
          _id: parentAccountId,
          _type: ACCOUNTS_DOCTYPE
        }
      }
    }
  })
}

/**
 * Updates existing account
 * @param  {Object}  client  CozyClient
 * @param  {Object}  account io.cozy.accounts document to update
 * @return {Object}          Updated io.cozy.accounts document
 */
export const updateAccount = async (client, account) => {
  try {
    const { data } = await client.save(account)
    return data
  } catch (error) {
    if (error.status === 409) {
      /* We fetch before in case of conflicts since the account can be changed
      in the database by the konnector */
      const upToDateAccount = await fetchAccount(client, account._id)
      delete account._rev
      const { data } = await client.save(merge(upToDateAccount, account))
      return data
    } else {
      throw error
    }
  }
}

/**
 * Creates or updates account
 * @param  {Object}  client  CozyClient
 * @param  {Object}  konnector  io.cozy.konnectors document
 * @param  {Object}  authData   Account auth attribute
 */
export const saveAccount = (client, konnector, account) => {
  assert(
    client && konnector && account,
    'Must pass both client, konnector and account to saveAccount'
  )
  return account._id
    ? updateAccount(client, account)
    : createAccount(client, konnector, account)
}

/**
 * Deletes an account.
 * @param  {Object}  client  CozyClient
 * @param  {Object}  account io.cozy.accounts document
 */
export const deleteAccount = async (client, account) => {
  try {
    await client.destroy(account)
  } catch (error) {
    if (error.status === 409) {
      const syncedAccount = await fetchAccount(client, account._id)
      await client.destroy(syncedAccount)
    } else {
      throw error
    }
  }
}

/**
 * Returns { trigger, account } list
 */
export const fetchAccountsFromTriggers = async (client, triggers) => {
  const accountCol = client.collection('io.cozy.accounts')
  const accountIdToTrigger = keyBy(triggers, triggersModel.getAccountId)
  const accountIds = Object.keys(accountIdToTrigger)
  const { data: accounts } = await accountCol.getAll(accountIds)
  return accounts
    .filter(Boolean)
    .map(account => ({ account, trigger: accountIdToTrigger[account._id] }))
}

/**
 * Returns the list of accounts which do not have any associated trigger
 *
 * @param  {Object}  client  CozyClient
 * @param  {Array}  triggers io.cozy.triggers documents
 */
export const fetchAccountsWithoutTriggers = async (client, triggers) => {
  const triggerAccountIds = triggers.map(trigger =>
    triggersModel.getAccountId(trigger)
  )
  return (await client.query(
    Q(ACCOUNTS_DOCTYPE).where({
      _id: {
        $nin: triggerAccountIds
      }
    })
  )).data
}
