import React from 'react'

import { I18n, translate } from 'twake-i18n'
import { getI18n } from 'twake-i18n'

const locales = {
  de: require(`../../locales/de.json`),
  en: require(`../../locales/en.json`),
  es: require(`../../locales/es.json`),
  fr: require(`../../locales/fr.json`),
  it: require(`../../locales/it.json`),
  ru: require(`../../locales/ru.json`),
  vi: require(`../../locales/vi.json`)
}

export const getActionsI18n = () => getI18n(undefined, lang => locales[lang])

/**
 * Adds cozy-sharing translations in the React context
 *
 * @param {Function} Component - React component
 */
const withLocales = Component =>
  translate()(({ t, f, lang, ...props }) => {
    return (
      <I18n dictRequire={localeCode => locales[localeCode]} lang={lang}>
        <Component {...props} />
      </I18n>
    )
  })

export default withLocales
