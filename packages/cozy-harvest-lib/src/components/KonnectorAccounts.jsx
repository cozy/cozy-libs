import React from 'react'

import { withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'

class KonnectorAccounts extends React.Component {
  state = {
    fetchingAccounts: false,
    error: null,
    accounts: []
  }

  /**
   * TODO We should not fetchAccounts and fetchAccount since we already have the informations
   * in the props. We kept this sytem for compatibility on the existing override.
   * Next tasks: remove these methods and rewrite the override
   */
  async componentDidMount() {
    await this.fetchAccounts()
  }

  componentDidUpdate(prevProps) {
    /**
     * We need to fetchAccounts() based on the pathname since if we don't,
     * when we create a new account, we can't find it in our array latter.
     *
     * ATM we also refetch if we go to /new. We have to change that
     */
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.fetchAccounts()
    }
  }

  async fetchAccounts() {
    const triggers = this.props.konnector.triggers.data
    const { findAccount } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = (await Promise.all(
        triggers.map(async trigger => {
          return {
            account: await findAccount(triggersModel.getAccountId(trigger)),
            trigger
          }
        })
      )).filter(({ account }) => !!account)
      this.setState({ accounts, fetchingAccounts: false, error: null })
    } catch (error) {
      this.setState({ error, fetchingAccounts: false })
    }
  }

  render() {
    // TODO error
    const { accounts, fetchingAccounts, error } = this.state
    return fetchingAccounts ? 'loading' : this.props.children(accounts)
  }
}

export default withMutations(accountMutations, triggersMutations)(
  withRouter(KonnectorAccounts)
)
