import PropTypes from 'prop-types'
import React from 'react'

import EmptyNoHeader from './EmptyNoHeader'
import EmptyWithHeader from './EmptyWithHeader'

const EmptyWithKonnector = ({ konnector, accountsByFiles }) => {
  const { accountsWithFiles, accountsWithoutFiles } = accountsByFiles
  if (accountsWithoutFiles?.length === 1 && accountsWithFiles?.length === 0) {
    return (
      <EmptyNoHeader konnector={konnector} accounts={accountsWithoutFiles} />
    )
  }

  return accountsWithoutFiles.map((account, index) => (
    <EmptyWithHeader key={index} konnector={konnector} account={account} />
  ))
}

EmptyWithKonnector.propTypes = {
  konnector: PropTypes.object,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default EmptyWithKonnector
