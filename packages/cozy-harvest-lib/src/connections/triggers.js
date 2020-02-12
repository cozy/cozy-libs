import { CozyFolder as CozyFolderClass } from 'cozy-doctypes'

import * as triggers from '../helpers/triggers'
import * as accounts from '../helpers/accounts'
import * as konnectors from '../helpers/konnectors'
import cron from '../helpers/cron'

import { findAccount, updateAccount } from './accounts'
import { statDirectoryByPath, createDirectoryByPath } from './files'

const FILES_DOCTYPE = 'io.cozy.files'
const PERMISSIONS_DOCTYPE = 'io.cozy.permissions'
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

const ensureKonnectorFolder = async (client, { konnector, account, t }) => {
  const permissions = client.collection(PERMISSIONS_DOCTYPE)
  const files = client.collection(FILES_DOCTYPE)
  const CozyFolder = CozyFolderClass.copyWithClient(client)
  const [adminFolder, photosFolder] = await Promise.all([
    CozyFolder.ensureMagicFolder(
      CozyFolder.magicFolders.ADMINISTRATIVE,
      `/${t('folder.administrative')}`
    ),
    CozyFolder.ensureMagicFolder(
      CozyFolder.magicFolders.PHOTOS,
      `/${t('folder.photos')}`
    )
  ])
  const path = konnectors.buildFolderPath(konnector, account, {
    administrative: adminFolder.path,
    photos: photosFolder.path
  })
  const folder =
    (await statDirectoryByPath(client, path)) ||
    (await createDirectoryByPath(client, path))

  await permissions.add(konnector, konnectors.buildFolderPermission(folder))
  await files.addReferencesTo(konnector, [folder])

  return folder
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
    folder = await ensureKonnectorFolder(client, { konnector, account, t })
  }

  return await createTrigger(
    client,
    triggers.buildAttributes({
      account,
      cron: cron.fromKonnector(konnector),
      folder,
      konnector
    })
  )
}

export default triggersMutations
