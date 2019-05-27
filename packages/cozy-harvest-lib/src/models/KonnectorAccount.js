import accounts from '../helpers/accounts'
import triggers from '../helpers/triggers'

import accountsMutations from '../connections/accounts'

export class KonnectorAccount {
  constructor(client) {
    this.client = client

    // mutations
    this.accountsMutations = accountsMutations(this.client)

    this.createOrUpdateData = this.createOrUpdateData.bind(this)
    this.prepareTriggerAccountIfExists = this.prepareTriggerAccountIfExists.bind(
      this
    )
  }

  async prepareTriggerAccountIfExists(trigger) {
    if (!trigger) return null
    const { findAccount, updateAccount } = this.accountsMutations
    const account = await findAccount(triggers.getAccountId(trigger))
    if (!account) return null
    return await updateAccount(accounts.resetState(account))
  }

  /**
   * Create the account document if it not exists or update it
   * @param  {Object}  konnector Konnector related document
   * @param  {Object}  data      Data from the account form
   * @return {Promise}           Saved account document
   */
  async createOrUpdateData(konnector, trigger, data = {}) {
    const { saveAccount } = this.accountsMutations

    const account = await this.prepareTriggerAccountIfExists(
      trigger,
      this.accountsMutations
    )

    const accountToSave = account
      ? accounts.mergeAuth(
          accounts.setSessionResetIfNecessary(
            accounts.resetState(account),
            data
          ),
          data
        )
      : accounts.build(konnector, data)
    const savedAccount = accounts.mergeAuth(
      await saveAccount(konnector, accountToSave),
      data
    )
    return savedAccount
  }
}

export default KonnectorAccount
