import PropTypes from 'prop-types'
import React from 'react'

import EmptyNoHeader from './EmptyNoHeader'
import EmptyWithHeader from './EmptyWithHeader'

const EmptyWithKonnector = ({ konnector, accounts }) => {
  if (accounts?.length > 1) {
    return accounts.map((account, index) => (
      <EmptyWithHeader key={index} konnector={konnector} account={account} />
    ))
  }

  return <EmptyNoHeader konnector={konnector} accounts={accounts} />
}

EmptyWithKonnector.propTypes = {
  konnector: PropTypes.object,
  accounts: PropTypes.array
}

export default EmptyWithKonnector
