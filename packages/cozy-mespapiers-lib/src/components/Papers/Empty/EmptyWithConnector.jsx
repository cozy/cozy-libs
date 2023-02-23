import React from 'react'
import PropTypes from 'prop-types'

import EmptyWithHeader from './EmptyWithHeader'
import EmptyNoHeader from './EmptyNoHeader'

const EmptyWithConnector = ({ connector, accounts }) => {
  if (accounts?.length > 1) {
    return accounts.map((account, index) => (
      <EmptyWithHeader key={index} connector={connector} account={account} />
    ))
  }

  return <EmptyNoHeader connector={connector} accounts={accounts} />
}

EmptyWithConnector.propTypes = {
  connector: PropTypes.object,
  accounts: PropTypes.array
}

export default EmptyWithConnector
