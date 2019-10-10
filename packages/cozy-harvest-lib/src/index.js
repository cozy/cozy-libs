import withLocales from './components/hoc/withLocales'

import DeleteAccountButtonWithoutLocales from './components/DeleteAccountButton'
import KonnectorModalWithoutLocales from './components/KonnectorModal'
import TriggerManagerWithoutLocales from './components/TriggerManager'
import TriggerLauncherWithoutLocales from './components/TriggerLauncher'
import RoutesWithoutLocales from './components/Routes'
import withKonnectorModalWithoutLocales from './components/hoc/withKonnectorModal'

// All entry point files need to be exported wrapped with the translation context of harvest
export const DeleteAccountButton = withLocales(
  DeleteAccountButtonWithoutLocales
)
export const KonnectorModal = withLocales(KonnectorModalWithoutLocales)
export const TriggerManager = withLocales(TriggerManagerWithoutLocales)
export const TriggerLauncher = withLocales(TriggerLauncherWithoutLocales)
export const Routes = withLocales(RoutesWithoutLocales)
export const withKonnectorModal = withLocales(withKonnectorModalWithoutLocales)

export {
  KonnectorJobError,
  getErrorLocale,
  getErrorLocaleBound
} from './helpers/konnectors'
export { handleOAuthResponse } from './helpers/oauth'
export { withLocales }
