import PropTypes from 'prop-types'
import React from 'react'
import { useMatch } from 'react-router-dom'

import { models } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AccountSelectBox from '../AccountSelectBox/AccountSelectBox'
import { AccountSelectorHeader } from '../AccountSelectBox/AccountSelectorHeader'
import KonnectorModalHeader from '../KonnectorModalHeader'
import { withMountPointProps } from '../MountPointContext'

export const AccountModalHeader = ({
  konnector,
  account,
  accountsAndTriggers,
  showAccountSelection,
  pushHistory,
  replaceHistory
}) => {
  const isConfig = useMatch(
    `/connected/${konnector.slug}/accounts/:accountId/config`
  )

  if (isConfig)
    return (
      <AccountSelectorHeader
        konnector={konnector}
        account={account}
        accountsAndTriggers={accountsAndTriggers}
        pushHistory={pushHistory}
        replaceHistory={replaceHistory}
      />
    )

  return (
    <KonnectorModalHeader konnector={konnector}>
      {showAccountSelection ? (
        <AccountSelectBox
          loading={!account}
          selectedAccount={account}
          accountsAndTriggers={accountsAndTriggers}
          onChange={option => {
            pushHistory(`/accounts/${option.account._id}`)
          }}
          onCreate={() => {
            pushHistory('/new')
          }}
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
  showAccountSelection: PropTypes.bool.isRequired,
  pushHistory: PropTypes.func.isRequired
}

export default withMountPointProps(AccountModalHeader)
