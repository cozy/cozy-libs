import SharingProvider from './SharingProvider'
import SharingContext from './context'
import withLocales from './withLocales'

export default SharingProvider

export { SharingContext, withLocales }

export { useSharingContext } from './hooks/useSharingContext'
export { useFetchDocumentPath } from './hooks/useFetchDocumentPath'

export { SharedDocument } from './SharedDocument'
export { SharedStatus } from './SharedStatus'
export { SharedBadge } from './SharedBadge'
export { SharingOwnerAvatar } from './SharingOwnerAvatar'
export { SharedRecipients } from './SharedRecipients'
export { SharedRecipientsList } from './SharedRecipientsList'
export { ShareButton } from './ShareButton'
export { ShareModal } from './components/ShareModal/ShareModal'
export { RefreshableSharings } from './RefreshableSharings'
export { CozyPassFingerprintDialogContent } from './components/CozyPassFingerprintDialogContent'
export { SharingBannerPlugin } from './components/SharingBanner'
export { useSharingInfos } from './components/SharingBanner/hooks/useSharingInfos'
export { ConfirmTrustedRecipientsDialog } from './ConfirmTrustedRecipientsDialog'
export { ShareButtonWithRecipients } from './ShareButtonWithRecipients'
export { DOCUMENT_TYPE } from './helpers/documentType'
