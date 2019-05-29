import withLocales from 'cozy-ui/transpiled/react/I18n/withLocales'

const dictRequire = lang => require(`../../locales/${lang}.json`)

export default withLocales(dictRequire)
