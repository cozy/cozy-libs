import omit from 'lodash/omit'
import React from 'react'
import { useLocation } from 'react-router'

import EditableSharingModal from './EditableSharingModal'
import { SharingDetailsModal } from './SharingDetailsModal'
import withLocales from '../../hoc/withLocales'
import { useSharingContext } from '../../hooks/useSharingContext'

export const ShareModal = withLocales(props => {
  const location = useLocation?.()
  const locationProps = location?.state?.modalProps
  const document = locationProps?.document || props.document
  const rest = omit(locationProps || props, 'document')

  const {
    byDocId,
    isOwner,
    canReshare,
    documentType,
    getOwner,
    getSharingType,
    getRecipients,
    revokeSelf
  } = useSharingContext()

  const isEditable =
    !byDocId[document.id] || isOwner(document.id) || canReshare(document.id)

  if (isEditable) {
    return <EditableSharingModal document={document} {...rest} />
  }

  return (
    <SharingDetailsModal
      document={document}
      documentType={documentType}
      owner={getOwner(document.id)}
      sharingType={getSharingType(document.id)}
      recipients={getRecipients(document.id)}
      onRevoke={revokeSelf}
      {...rest}
    />
  )
})
