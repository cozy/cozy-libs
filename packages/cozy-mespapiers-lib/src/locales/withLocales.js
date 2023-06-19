import I18n from 'cozy-ui/transpiled/react/I18n'
import withOnlyLocales from 'cozy-ui/transpiled/react/I18n/withOnlyLocales'

const dictRequire = lang => require(`./${lang}.json`)

export const i18nContextTypes = I18n.childContextTypes

export default withOnlyLocales(dictRequire)
