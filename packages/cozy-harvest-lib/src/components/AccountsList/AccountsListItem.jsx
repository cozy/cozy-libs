import React from 'react'
import PropTypes from 'prop-types'

import { Account } from 'cozy-doctypes'
import Card from 'cozy-ui/transpiled/react/Card'
import { Caption } from 'cozy-ui/transpiled/react/Text'

import Status from './Status'

export class AccountsListItem extends React.PureComponent {
  render() {
    const { account, onClick, konnector, trigger } = this.props

    const accountName = Account.getAccountName(account)
    const accountLogin = Account.getAccountLogin(account)
    const nameAndLoginDiffer = accountName !== accountLogin
    return (
      <Card
        className="u-flex u-flex-justify-between u-flex-items-center u-c-pointer"
        onClick={onClick}
      >
        <div>
          <div>{accountName}</div>
          {nameAndLoginDiffer && <Caption>{accountLogin}</Caption>}
        </div>
        <div>
          <Status konnector={konnector} trigger={trigger} />
        </div>
      </Card>
    )
  }
}

AccountsListItem.propTypes = {
  account: PropTypes.object.isRequired,
  konnector: PropTypes.shape({
    name: PropTypes.string,
    vendor_link: PropTypes.string
  }).isRequired,
  trigger: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default AccountsListItem
