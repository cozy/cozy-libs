import withOnlyLocales from 'cozy-ui/transpiled/react/providers/I18n/withOnlyLocales'

import en from './en.json'
import fr from './fr.json'
import ru from './ru.json'
import vi from './vi.json'

const locales = {
  en,
  fr,
  ru,
  vi
}

export default withOnlyLocales(locales)
