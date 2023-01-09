import React from 'react'
import PropTypes from 'prop-types'

import AccountSelectBox from '../AccountSelectBox/AccountSelectBox'
import KonnectorModalHeader from '../KonnectorModalHeader'
import { withMountPointProps } from '../MountPointContext'

export const AccountModalHeader = ({
  konnector,
  account,
  accountsAndTriggers,
  showAccountSelection,
  pushHistory
}) => {
  return (
    <KonnectorModalHeader konnector={konnector}>
      {showAccountSelection && (
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
  showAccountSelection: PropTypes.bool,
  pushHistory: PropTypes.func.isRequired
}

export default withMountPointProps(AccountModalHeader)
