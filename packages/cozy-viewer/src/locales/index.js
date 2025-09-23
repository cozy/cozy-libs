import { getI18n } from 'cozy-ui/transpiled/react/providers/I18n/helpers'

import en from './en.json'
import fr from './fr.json'
import ru from './ru.json'
import vi from './vi.json'

export const locales = { en, fr, ru, vi }

export const getViewerI18n = () => getI18n(undefined, lang => locales[lang])
