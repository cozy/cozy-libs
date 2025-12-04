import I18n, { withLocales } from 'twake-i18n'
const dictRequire = lang => require(`../../locales/${lang}.json`)

export const i18nContextTypes = I18n.childContextTypes

export default withLocales(dictRequire)
