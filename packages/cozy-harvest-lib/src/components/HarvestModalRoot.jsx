import PropTypes from 'prop-types'
import React from 'react'
import { Navigate } from 'react-router-dom'

import AccountsListModal from './AccountsListModal'

const HarvestModalRoot = ({ accounts, konnector }) => {
  if (accounts.length === 0) {
    return <Navigate to="new" replace />
  } else if (accounts.length === 1) {
    return <Navigate to={`accounts/${accounts[0].account._id}`} replace />
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
