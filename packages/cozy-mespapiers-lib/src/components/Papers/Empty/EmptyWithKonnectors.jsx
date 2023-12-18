import PropTypes from 'prop-types'
import React from 'react'

import EmptyNoHeader from './EmptyNoHeader'
import EmptyWithHeader from './EmptyWithHeader'

const getKonnectorByAccount = (konnectors, account) => {
  return konnectors.find(konnector => konnector.slug === account.account_type)
}
const EmptyWithKonnectors = ({ konnectors, accountsByFiles, hasFiles }) => {
  const { accountsWithFiles, accountsWithoutFiles } = accountsByFiles
  /**
   * If there is only one account without files and no other files
   */

  if (
    accountsWithoutFiles?.length === 1 &&
    accountsWithFiles?.length === 0 &&
    !hasFiles
  ) {
    const konnector = getKonnectorByAccount(konnectors, accountsWithoutFiles[0])
    return (
      <EmptyNoHeader konnector={konnector} accounts={accountsWithoutFiles} />
    )
  }

  return accountsWithoutFiles.map((account, index) => {
    const konnector = getKonnectorByAccount(konnectors, account)
    return (
      <EmptyWithHeader key={index} konnector={konnector} account={account} />
    )
  })
}

EmptyWithKonnectors.propTypes = {
  konnectors: PropTypes.array,
  hasFiles: PropTypes.bool,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default EmptyWithKonnectors
