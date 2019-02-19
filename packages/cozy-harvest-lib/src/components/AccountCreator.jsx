import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'

import { withMutations } from 'cozy-client'

import AccountForm from './AccountForm'
import { accountsMutations } from '../connections/accounts'
import { mergeAuth, prepareAccountData } from '../helpers/accounts'

/**
 * Encapsulates an AccountForm and create an account with resulting data.
 */
export class AccountCreator extends PureComponent {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(data) {
    const {
      createAccount,
      konnector,
      onBeforeCreate,
      onCreateSuccess
    } = this.props
    onBeforeCreate()
    const account = await createAccount(
      konnector,
      prepareAccountData(konnector, data)
    )
    // Merge auth to keep original values for encrypted fields during creation
    onCreateSuccess(mergeAuth(account, data))
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

AccountCreator.propTypes = {
  createAccount: PropTypes.func.isRequired,
  konnector: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  onBeforeCreate: PropTypes.func.isRequired,
  onCreateSuccess: PropTypes.func.isRequired
}

export default withMutations(accountsMutations)(AccountCreator)
