import React from 'react'

import { I18n, translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { getI18n } from 'cozy-ui/transpiled/react/providers/I18n/helpers'

const locales = {
  en: require(`../../locales/en.json`),
  fr: require(`../../locales/fr.json`)
}

export const getActionsI18n = () => getI18n(undefined, lang => locales[lang])

/**
 * Adds cozy-sharing translations in the React context
 *
 * @param {Function} Component - React component
 */
const withLocales = Component =>
  translate()(props => {
    return (
      <I18n dictRequire={localeCode => locales[localeCode]} lang={props.lang}>
        <Component {...props} />
      </I18n>
    )
  })

export default withLocales
