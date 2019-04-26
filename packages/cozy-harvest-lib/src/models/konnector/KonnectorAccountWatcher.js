import { subscribe } from 'cozy-realtime'
import accounts from '../../helpers/accounts'

const ACCOUNT_DOCTYPE = 'io.cozy.accounts'

export class KonnectorAccountWatcher {
  constructor(client, account, options) {
    this.client = client
    this.account = account
    this.options = options
  }

  async watch() {
    const { onTwoFACodeAsked } = this.options
    const accountSubscription = await subscribe(
      {
        // Token structure differs between web and mobile
        token:
          this.client.stackClient.token.token ||
          this.client.stackClient.token.accessToken,
        url: this.client.options.uri
      },
      ACCOUNT_DOCTYPE,
      { docId: this.account._id }
    )

    accountSubscription.onUpdate(updatedAccount => {
      this.account = updatedAccount
      const { state } = this.account
      if (accounts.isTwoFANeeded(state)) onTwoFACodeAsked(state)
    })
  }
}

export default KonnectorAccountWatcher
