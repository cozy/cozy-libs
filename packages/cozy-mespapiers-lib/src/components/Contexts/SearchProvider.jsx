import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useScannerI18n } from '../Hooks/useScannerI18n'
import SearchProvider from '../Search/SearchProvider'

const SearchProviderWithT = props => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()

  return <SearchProvider t={t} scannerT={scannerT} {...props} />
}

export default SearchProviderWithT
