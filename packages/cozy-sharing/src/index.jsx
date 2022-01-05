import SharingContext from './context'
import withLocales from './withLocales'
import SharingProviderWithClient from './SharingProvider'

export default SharingProviderWithClient

export { SharingContext, withLocales }

export { SharedDocument } from './SharedDocument'
export { SharedStatus } from './SharedStatus'
export { SharedBadge } from './SharedBadge'
export { SharingOwnerAvatar } from './SharingOwnerAvatar'
export { SharedRecipients } from './SharedRecipients'
export { SharedRecipientsList } from './SharedRecipientsList'
export { ShareButton } from './ShareButton'
export { ShareModal } from './ShareModal'
export { RefreshableSharings } from './RefreshableSharings'
export { useFetchDocumentPath } from './components/useFetchDocumentPath'
export { CozyPassFingerprintDialogContent } from './components/CozyPassFingerprintDialogContent'
export { SharingBannerPlugin } from './SharingBanner'
export { useSharingInfos } from './SharingBanner/hooks/useSharingInfos'
export { ConfirmTrustedRecipientsDialog } from './ConfirmTrustedRecipientsDialog'
