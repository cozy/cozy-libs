import FlowProviderWithLocales from './components/FlowProvider'
import KonnectorSuggestionModalWithoutLocales from './components/KonnectorSuggestionModal'
import RoutesWithoutLocales from './components/Routes'
import { IntentTriggerManager as IntentTriggerManagerWithoutLocales } from './components/TriggerManager'
import LaunchTriggerCardWithoutLocales from './components/cards/LaunchTriggerCard'
import withLocales from './components/hoc/withLocales'

// All entry point files need to be exported wrapped with the translation context of harvest
export const IntentTriggerManager = withLocales(
  IntentTriggerManagerWithoutLocales
)
export const FlowProvider = withLocales(FlowProviderWithLocales)
export const LaunchTriggerCard = withLocales(LaunchTriggerCardWithoutLocales)
export const Routes = withLocales(RoutesWithoutLocales)
export const KonnectorSuggestionModal = withLocales(
  KonnectorSuggestionModalWithoutLocales
)

export { default as withConnectionFlow } from './models/withConnectionFlow'
export {
  KonnectorJobError,
  getErrorLocale,
  getErrorLocaleBound
} from './helpers/konnectors'
export { handleOAuthResponse } from './helpers/oauth'
export { withLocales }
export { default as updateAccountsFromCipher } from './services/updateAccountsFromCipher'
export { default as deleteAccounts } from './services/deleteAccounts'
export { TrackingContext } from './components/hoc/tracking'
export { CozyConfirmDialogProvider } from './components/CozyConfirmDialogProvider'
