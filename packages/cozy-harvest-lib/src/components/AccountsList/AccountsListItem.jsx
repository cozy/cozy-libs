import PropTypes from 'prop-types'
import React from 'react'

import { Account } from 'cozy-doctypes'
import Card from 'cozy-ui/transpiled/react/Card'
import Typography from 'cozy-ui/transpiled/react/Typography'

import Status from './Status'

export class AccountsListItem extends React.PureComponent {
  render() {
    const { account, onClick, konnector, trigger } = this.props
    const accountName = Account.getAccountName(account)
    const accountLogin = Account.getAccountLogin(account)

    // When the account is from an OAuth, we cannot have an accountLogin.
    // So we have to check if accountLogin is not undefined before doing the check
    const shouldShowAccountLogin = accountLogin && accountName !== accountLogin
    return (
      <Card
        className="u-flex u-flex-justify-between u-flex-items-center u-c-pointer u-maw-100"
        onClick={onClick}
      >
        <div className="u-flex-grow-1 u-flex-shrink-1 u-ov-hidden u-mr-1">
          <Typography
            className="u-ellipsis"
            variant="body1"
            gutterBottom={shouldShowAccountLogin}
          >
            {accountName}
          </Typography>
          {shouldShowAccountLogin && (
            <Typography
              className="u-ellipsis"
              variant="caption"
              color="textSecondary"
            >
              {accountLogin}
            </Typography>
          )}
        </div>
        <Status konnector={konnector} trigger={trigger} />
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
