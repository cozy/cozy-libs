import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { SharingDetailsModal } from './SharingDetailsModal'
import EditableSharingModal from './components/EditableSharingModal'

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

export const ShareModal = withLocales(({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, canReshare }) =>
      !byDocId[document.id] ||
      isOwner(document.id) ||
      canReshare(document.id) ? (
        <EditableSharingModal document={document} {...rest} />
      ) : (
        <SharingModal document={document} {...rest} />
      )
    }
  </SharingContext.Consumer>
))
