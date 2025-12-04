import { withLocales } from 'twake-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'

export const locales = {
  en,
  fr
}

export const withContactsListLocales = withLocales(locales)
