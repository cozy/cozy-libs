import withLocales from 'cozy-ui/transpiled/react/I18n/withLocales'

const locales = {
  en: require(`./locales/en.json`),
  fr: require(`./locales/fr.json`)
}

export default withLocales(locales)
