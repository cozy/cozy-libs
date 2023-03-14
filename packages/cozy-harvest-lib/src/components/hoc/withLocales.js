import I18n from 'cozy-ui/transpiled/react/I18n'
import withLocales from 'cozy-ui/transpiled/react/I18n/withLocales'

const dictRequire = lang => require(`../../locales/${lang}.json`)

export const i18nContextTypes = I18n.childContextTypes

export default withLocales(dictRequire)
