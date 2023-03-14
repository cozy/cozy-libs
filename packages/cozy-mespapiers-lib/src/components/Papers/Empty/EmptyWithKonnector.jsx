import PropTypes from 'prop-types'
import React from 'react'

import EmptyNoHeader from './EmptyNoHeader'
import EmptyWithHeader from './EmptyWithHeader'

const EmptyWithKonnector = ({ connector, accounts }) => {
  if (accounts?.length > 1) {
    return accounts.map((account, index) => (
      <EmptyWithHeader key={index} connector={connector} account={account} />
    ))
  }

  return <EmptyNoHeader connector={connector} accounts={accounts} />
}

EmptyWithKonnector.propTypes = {
  connector: PropTypes.object,
  accounts: PropTypes.array
}

export default EmptyWithKonnector
