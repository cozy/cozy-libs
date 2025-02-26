import SharingProvider from './SharingProvider'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export default SharingProvider

export { SharingContext, withLocales }

export { useSharingContext } from './hooks/useSharingContext'
export { useFetchDocumentPath } from './hooks/useFetchDocumentPath'

export { SharedDocument } from './SharedDocument'
export { SharedStatus } from './SharedStatus'
export { SharedBadge } from './SharedBadge'
export { SharingOwnerAvatar } from './SharingOwnerAvatar'
export { SharedRecipients } from './SharedRecipients'
export { default as MemberRecipientLite } from './components/Recipient/MemberRecipientLite'
export { default as LinkRecipientLite } from './components/Recipient/LinkRecipientLite'
export { default as OwnerRecipientDefaultLite } from './components/Recipient/OwnerRecipientDefaultLite'
export { SharedRecipientsList } from './SharedRecipientsList'
export { ShareButton } from './ShareButton'
export { SharedDriveModal } from './components/SharedDrive/SharedDriveModal'
export { ShareModal } from './components/ShareModal/ShareModal'
export { RefreshableSharings } from './RefreshableSharings'
export { CozyPassFingerprintDialogContent } from './components/CozyPassFingerprintDialogContent'
export { SharingBannerPlugin } from './components/SharingBanner'
export { useSharingInfos } from './components/SharingBanner/hooks/useSharingInfos'
export { ConfirmTrustedRecipientsDialog } from './ConfirmTrustedRecipientsDialog'
export { ShareButtonWithRecipients } from './ShareButtonWithRecipients'
export { DOCUMENT_TYPE } from './helpers/documentType'
export { default as OpenSharingLinkButton } from './OpenSharingLinkButton'
export { default as OpenSharingLinkFabButton } from './OpenSharingLinkFabButton'
export {
  NativeFileSharingProvider,
  useNativeFileSharing
} from './providers/NativeFileSharingProvider'
export { createCozySharingLink } from './actions/createCozySharingLink'
export { addToCozySharingLink } from './actions/addToCozySharingLink'
export { syncToCozySharingLink } from './actions/syncToCozySharingLink'
export { shareNative } from './actions/shareNative'
