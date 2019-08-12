import React from 'react'
import PropTypes from 'prop-types'

import Card from 'cozy-ui/transpiled/react/Card'
import Button from 'cozy-ui/transpiled/react/Button'

import AccountsListItem from './AccountsListItem'

class AccountsList extends React.PureComponent {
  render() {
    const { accounts, konnector, addAccount, onPick } = this.props

    return (
      <ul className="u-nolist u-p-0 u-m-0">
        {accounts.map((account, index) => (
          <li key={index} className="u-mb-half">
            <AccountsListItem
              account={account.account}
              konnector={konnector}
              trigger={account.trigger}
              onClick={() => onPick(account)}
            />
          </li>
        ))}
        <li className="u-mb-half">
          <Card className="u-p-0">
            <Button
              label="Add account"
              theme="text"
              extension="full"
              icon="plus"
              className="u-bdrs-4"
              onClick={addAccount}
            />
          </Card>
        </li>
      </ul>
    )
  }
}

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  konnector: PropTypes.shape({
    name: PropTypes.string,
    vendor_link: PropTypes.string
  }).isRequired,
  addAccount: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired
}

export default AccountsList
