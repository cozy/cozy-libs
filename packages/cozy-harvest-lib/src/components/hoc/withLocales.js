import withLocales from 'cozy-ui/transpiled/react/I18n/withLocales'
import I18n from 'cozy-ui/transpiled/react/I18n'

const dictRequire = lang => require(`../../locales/${lang}.json`)

export const i18nContextTypes = I18n.childContextTypes

export default withLocales(dictRequire)
