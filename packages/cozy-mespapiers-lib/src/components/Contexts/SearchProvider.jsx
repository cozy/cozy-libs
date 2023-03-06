import React from 'react'

import { useScannerI18n } from '../Hooks/useScannerI18n'
import SearchProvider from '../Search/SearchProvider'

const SearchProviderWithT = props => {
  const scannerT = useScannerI18n()

  return <SearchProvider t={scannerT} {...props} />
}

export default SearchProviderWithT
