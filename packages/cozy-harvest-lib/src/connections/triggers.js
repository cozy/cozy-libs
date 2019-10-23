import * as triggers from '../helpers/triggers'
import * as accounts from '../helpers/accounts'

import { findAccount, updateAccount } from './accounts'

const TRIGGERS_DOCTYPE = 'io.cozy.triggers'

/**
 * Creates a trigger with given attributes
 * @param  {Object} client CozyClient
 * @param  {Object}   attributes
 * @return {Object}   Created trigger
 */
const createTrigger = async (client, attributes) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).create(attributes)
  return data
}

const fetchTrigger = async (client, id) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).get(id)
  return data
}

/**
 * Triggers job associated to given trigger
 * @param  {Object} client CozyClient
 * @param  {Object}  Trigger to launch
 * @return {Object}  Job document
 */
export const launchTrigger = async (client, trigger) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).launch(trigger)
  return data
}

export const prepareTriggerAccount = async (client, trigger) => {
  const accountId = triggers.getAccountId(trigger)
  if (!accountId) {
    throw new Error('No account id in the trigger')
  }
  const account = await findAccount(client, accountId)
  if (!account) {
    throw new Error(
      `Could not find account ${accountId} for trigger ${trigger._id}`
    )
  }
  return updateAccount(client, accounts.resetState(account))
}

/**
 * Return triggers mutations
 * @param  {Object} client CozyClient
 * @return {Object}        Object containing mutations
 */
export const triggersMutations = client => {
  return {
    createTrigger: createTrigger.bind(null, client),
    fetchTrigger: fetchTrigger.bind(null, client),
    launchTrigger: launchTrigger.bind(null, client)
  }
}

export default triggersMutations
