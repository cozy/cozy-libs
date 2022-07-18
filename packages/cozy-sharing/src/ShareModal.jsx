import React from 'react'
import { useLocation } from 'react-router'

import EditableSharingModal from './components/EditableSharingModal'
import SharingContext from './context'
import withLocales from './withLocales'
import { SharingDetailsModal } from './SharingDetailsModal'

const SharingModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({
      documentType,
      getOwner,
      getSharingType,
      getRecipients,
      revokeSelf
    }) => (
      <SharingDetailsModal
        document={document}
        documentType={documentType}
        owner={getOwner(document.id)}
        sharingType={getSharingType(document.id)}
        recipients={getRecipients(document.id)}
        onRevoke={revokeSelf}
        {...rest}
      />
    )}
  </SharingContext.Consumer>
)

export const ShareModal = withLocales(props => {
  const location = useLocation()
  const modalProps = location.state?.modalProps
  const document = modalProps?.document || props.document

  return (
    <SharingContext.Consumer>
      {({ byDocId, isOwner, canReshare }) =>
        !byDocId[document.id] ||
        isOwner(document.id) ||
        canReshare(document.id) ? (
          <EditableSharingModal {...props} {...modalProps} />
        ) : (
          <SharingModal {...props} {...modalProps} />
        )
      }
    </SharingContext.Consumer>
  )
})
