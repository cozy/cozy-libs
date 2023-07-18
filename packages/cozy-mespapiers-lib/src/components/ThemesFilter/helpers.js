import enLocale from '../../locales/en.json'

export const makeLabel = ({ scannerT, t, label }) => {
  const hasLocale = enLocale?.Scan?.themes?.[label]

  return hasLocale ? t(`Scan.themes.${label}`) : scannerT(`themes.${label}`)
}
