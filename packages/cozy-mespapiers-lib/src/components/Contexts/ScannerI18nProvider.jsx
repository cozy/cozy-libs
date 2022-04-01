import React, { createContext } from 'react'

import { models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
const {
  locales: { getBoundT }
} = models.document

const ScannerI18nContext = createContext()

const prefix = `Scan`
const ScannerI18nProvider = ({ children }) => {
  const { lang } = useI18n()
  const scannerI18n = getBoundT(lang || 'fr')

  const scannerT = React.useCallback(
    key => scannerI18n(`${prefix}.${key}`),
    [scannerI18n]
  )

  return (
    <ScannerI18nContext.Provider value={scannerT}>
      {children}
    </ScannerI18nContext.Provider>
  )
}

export default ScannerI18nContext

export { ScannerI18nProvider }
