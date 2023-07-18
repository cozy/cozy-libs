import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import enLocale from '../../locales/en.json'
import { useScannerI18n } from '../Hooks/useScannerI18n'

export const useThemeLabel = label => {
  const scannerT = useScannerI18n()
  const { t } = useI18n()

  const hasLocale = enLocale?.Scan?.themes?.[label]

  return hasLocale ? t(`Scan.themes.${label}`) : scannerT(`themes.${label}`)
}
