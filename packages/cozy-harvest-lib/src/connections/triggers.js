import { ensureKonnectorFolder } from 'cozy-client/dist/models/konnectorFolder'
import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'

import { fetchAccount, updateAccount } from './accounts'
import * as accounts from '../helpers/accounts'
import cron from '../helpers/cron'
import * as konnectors from '../helpers/konnectors'

const TRIGGERS_DOCTYPE = 'io.cozy.triggers'

/**
 * Creates a trigger with given attributes
 * @param  {Object} client CozyClient
 * @param  {Object}   attributes
 * @return {Object}   Created trigger
 */
export const createTrigger = async (client, attributes) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).create(attributes)
  return data
}

/**
 * Fetch the trigger based on its id
 * @param  {Object} client CozyClient
 * @param  {string} id
 * @return {Object} Fetched trigger data
 */
export const fetchTrigger = async (client, id) => {
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
  const accountId = triggersModel.getAccountId(trigger)
  if (!accountId) {
    throw new Error('No account id in the trigger')
  }
  const account = await fetchAccount(client, accountId)
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

export const ensureTrigger = async (
  client,
  { trigger, account, konnector, t }
) => {
  if (trigger) {
    return trigger
  }

  let folder

  if (konnectors.needsFolder(konnector)) {
    folder = await ensureKonnectorFolder(client, {
      konnector,
      account,
      t
    })
  }

  return await createTrigger(
    client,
    triggersModel.buildTriggerAttributes({
      account,
      cron: cron.fromKonnector(konnector),
      folder,
      konnector
    })
  )
}

export default triggersMutations
