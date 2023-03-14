import PropTypes from 'prop-types'
import React, { useContext } from 'react'

import AccountsListModal from './AccountsListModal'
import { MountPointContext } from './MountPointContext'

const HarvestModalRoot = ({ accounts, konnector }) => {
  const { replaceHistory } = useContext(MountPointContext)
  if (accounts.length === 0) {
    replaceHistory('/new')
    return null
  } else if (accounts.length === 1) {
    replaceHistory(`/accounts/${accounts[0].account._id}`)
    return null
  } else {
    return <AccountsListModal konnector={konnector} accounts={accounts} />
  }
}

HarvestModalRoot.propTypes = {
  accounts: PropTypes.array,
  konnector: PropTypes.object.isRequired
}

HarvestModalRoot.defaultProps = {
  accounts: []
}

export default HarvestModalRoot
