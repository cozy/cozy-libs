import { useContext } from 'react'

import ScannerI18nContext from '../Contexts/ScannerI18nProvider'

export const useScannerI18n = () => {
  const scannerT = useContext(ScannerI18nContext)
  if (!scannerT) {
    throw new Error(
      'ScannerI18nContext must be used within a ScannerI18nProvider'
    )
  }

  return scannerT
}
