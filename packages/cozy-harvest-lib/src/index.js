import DeleteAccountButtonWithoutLocales from './components/DeleteAccountButton'
import FlowProviderWithLocales from './components/FlowProvider'
import KonnectorModalWithoutLocales from './components/KonnectorModal'
import KonnectorSuggestionModalWithoutLocales from './components/KonnectorSuggestionModal'
import RoutesWithoutLocales from './components/Routes'
import LegacyTriggerManagerWithoutLocales, {
  IntentTriggerManager as IntentTriggerManagerWithoutLocales
} from './components/TriggerManager'
import LaunchTriggerCardWithoutLocales from './components/cards/LaunchTriggerCard'
import withKonnectorModalWithoutLocales from './components/hoc/withKonnectorModal'
import withLocales from './components/hoc/withLocales'
import deprecated from './deprecated'

// All entry point files need to be exported wrapped with the translation context of harvest
export const DeleteAccountButton = withLocales(
  DeleteAccountButtonWithoutLocales
)
export const KonnectorModal = withLocales(KonnectorModalWithoutLocales)
export const TriggerManager = withLocales(LegacyTriggerManagerWithoutLocales)
export const IntentTriggerManager = withLocales(
  IntentTriggerManagerWithoutLocales
)
export const FlowProvider = withLocales(FlowProviderWithLocales)
export const LaunchTriggerCard = withLocales(LaunchTriggerCardWithoutLocales)
export const TriggerLauncher = deprecated(
  `TriggerLauncher is deprecated, please use FlowProvider now.
The API has not changed, only the name and import call.

import { FlowProvider } from "cozy-harvest-lib"
`
)(FlowProvider)
export const Routes = withLocales(RoutesWithoutLocales)
export const withKonnectorModal = withLocales(withKonnectorModalWithoutLocales)
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
