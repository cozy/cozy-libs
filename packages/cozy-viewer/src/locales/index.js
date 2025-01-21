import { getI18n } from 'cozy-ui/transpiled/react/providers/I18n/helpers'

import en from './en.json'
import fr from './fr.json'

export const locales = { en, fr }

export const getViewerI18n = () => getI18n(undefined, lang => locales[lang])
