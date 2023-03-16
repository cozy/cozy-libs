import omit from 'lodash/omit'
import React from 'react'
import { useLocation } from 'react-router'

import { SharingDetailsModal } from './SharingDetailsModal'
import EditableSharingModal from './components/EditableSharingModal'
import SharingContext from './context'
import withLocales from './withLocales'

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
  const location = useLocation?.()
  const locationProps = location?.state?.modalProps
  const document = locationProps?.document || props.document
  const rest = omit(locationProps || props, 'document')

  return (
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
  )
})
