import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'

import { withMutations } from 'cozy-client'

import AccountForm from './AccountForm'
import { accountsMutations } from '../connections/accounts'
import { mergeAuth } from '../helpers/accounts'

/**
 * Encapsulates an AccountForm of an existing account, and allows to update it.
 */
export class AccountEditor extends PureComponent {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(data) {
    const {
      account,
      onBeforeUpdate,
      onUpdateSuccess,
      updateAccount
    } = this.props
    onBeforeUpdate(account)
    const updatedAccount = await updateAccount(mergeAuth(account, data))
    onUpdateSuccess(updatedAccount)
  }

  render() {
    const { account, konnector, submitting } = this.props
    return (
      <AccountForm
        fields={konnector.fields}
        initialValues={account && (account.auth || account.oauth)}
        locales={konnector.locales}
        oauth={konnector.oauth}
        onSubmit={this.handleSubmit}
        submitting={submitting}
      />
    )
  }
}

AccountEditor.propTypes = {
  account: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  onBeforeUpdate: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  updateAccount: PropTypes.func.isRequired
}

export default withMutations(accountsMutations)(AccountEditor)
