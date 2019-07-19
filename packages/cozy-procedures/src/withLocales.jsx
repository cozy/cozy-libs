import React from 'react'
import { I18n, translate } from 'cozy-ui/transpiled/react/I18n'

const locales = {
  en: require(`./locales/en.json`),
  fr: require(`./locales/fr.json`)
}

const withLocales = Component =>
  translate()(props => {
    return (
      <I18n dictRequire={localeCode => locales[localeCode]} lang={props.lang}>
        <Component {...props} />
      </I18n>
    )
  })

export default withLocales
