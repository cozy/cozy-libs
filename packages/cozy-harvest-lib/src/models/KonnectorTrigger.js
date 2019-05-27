import accounts from '../helpers/accounts'
import triggers from '../helpers/triggers'
import cron from '../helpers/cron'
import konnectors from '../helpers/konnectors'
import { slugify } from '../helpers/slug'

import accountsMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import permissionsMutations from '../connections/permissions'
import filesMutations from '../connections/files'

// helpers
export const prepareTriggerAccountIfExists = async (
  trigger,
  accountsMutations
) => {
  if (!trigger) return null
  const { findAccount, updateAccount } = accountsMutations
  const account = await findAccount(triggers.getAccountId(trigger))
  if (!account) return null
  return await updateAccount(accounts.resetState(account))
}

export class KonnectorTrigger {
  constructor(client) {
    this.client = client

    // mutations
    this.accountsMutations = accountsMutations(this.client)
    this.triggersMutations = triggersMutations(this.client)
    this.permissionsMutations = permissionsMutations(this.client)
    this.filesMutations = filesMutations(this.client)

    // methods
    this.create = this.create.bind(this)
  }

  /**
   * Create a trigger with valid destination folder with
   * permissions and references
   * @param  {Object}  konnector Konnector related document, required to create
   *                             a trigger
   * @param  {Object}  account   io.cozy.accounts document
   * @param  {Object}  baseDir   base directory to handle folder creation
   */
  async create(konnector, account, baseDir = '') {
    if (!account) {
      this.handleError(new Error('No account found to create a trigger'))
    }

    const { addPermission } = this.permissionsMutations
    const {
      addReferencesTo,
      createDirectoryByPath,
      statDirectoryByPath
    } = this.filesMutations
    const { createTrigger } = this.triggersMutations

    let folder

    if (konnectors.needsFolder(konnector)) {
      const path = `${baseDir}/${konnector.name}/${slugify(
        accounts.getLabel(account)
      )}`

      folder =
        (await statDirectoryByPath(path)) || (await createDirectoryByPath(path))

      await addPermission(konnector, konnectors.buildFolderPermission(folder))
      await addReferencesTo(konnector, [folder])
    }

    return await createTrigger(
      triggers.buildAttributes({
        account: account,
        cron: cron.fromKonnector(konnector),
        folder,
        konnector
      })
    )
  }
}

export default KonnectorTrigger
