import I18n from 'cozy-ui/transpiled/react/I18n'
import withLocales from 'cozy-ui/transpiled/react/I18n/withLocales'

const dictRequire = lang => require(`./${lang}.json`)

export const i18nContextTypes = I18n.childContextTypes

/**
 * TODO: We should use something else than withLocales here. Because it's an HOC
 * so it spreads t, f, lang into child props.
 * We don't use HOC anymore, so we just want to use new I18n context with new locales
 */
export default withLocales(dictRequire)
