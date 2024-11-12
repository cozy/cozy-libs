import PropTypes from 'prop-types'
import React from 'react'
import { useMatch, useNavigate } from 'react-router-dom'

import { models } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AccountSelectBox from '../AccountSelectBox/AccountSelectBox'
import { AccountSelectorHeader } from '../AccountSelectBox/AccountSelectorHeader'
import KonnectorModalHeader from '../KonnectorModalHeader'

export const AccountModalHeader = ({
  konnector,
  account,
  accountsAndTriggers,
  showAccountSelection
}) => {
  const isConfig = useMatch(
    `/connected/${konnector.slug}/accounts/:accountId/config`
  )
  const navigate = useNavigate()

  if (isConfig) {
    return (
      <AccountSelectorHeader
        konnector={konnector}
        account={account}
        accountsAndTriggers={accountsAndTriggers}
        showAccountSelection={showAccountSelection}
      />
    )
  }

  const handleChange = option => {
    navigate(`../accounts/${option.account._id}`)
  }

  const handleCreate = () => {
    navigate('../new')
  }

  return (
    <KonnectorModalHeader konnector={konnector}>
      {showAccountSelection ? (
        <AccountSelectBox
          loading={!account}
          selectedAccount={account}
          accountsAndTriggers={accountsAndTriggers}
          onChange={handleChange}
          onCreate={handleCreate}
        />
      ) : (
        <Typography>{models.account.getAccountName(account)}</Typography>
      )}
    </KonnectorModalHeader>
  )
}

AccountModalHeader.defaultProps = {
  showAccountSelection: true
}
AccountModalHeader.propTypes = {
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object,
  accountsAndTriggers: PropTypes.array.isRequired,
  showAccountSelection: PropTypes.bool.isRequired
}

export default AccountModalHeader
