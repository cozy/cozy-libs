import PropTypes from 'prop-types'
import React from 'react'

import EmptyNoHeader from './EmptyNoHeader'
import EmptyWithHeader from './EmptyWithHeader'

const EmptyWithKonnector = ({ konnector, accountsByFiles, hasFiles }) => {
  const { accountsWithFiles, accountsWithoutFiles } = accountsByFiles
  /**
   * If there is only one account without files and no other files
   */
  if (
    accountsWithoutFiles?.length === 1 &&
    accountsWithFiles?.length === 0 &&
    !hasFiles
  ) {
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
  hasFiles: PropTypes.bool,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default EmptyWithKonnector
