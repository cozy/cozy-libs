import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import AccountsListModal from './AccountsListModal'
import { MountPointContext } from './MountPointContext'

const HarvestModalRoot = ({ accounts, konnector }) => {
  const { pushHistory } = useContext(MountPointContext)
  if (accounts.length === 0) {
    pushHistory('/new')
    return null
  } else if (accounts.length === 1) {
    pushHistory(`/accounts/${accounts[0].account._id}`)
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
