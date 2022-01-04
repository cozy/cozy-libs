import React from 'react'

import SharingContext from './context'

export var SharedDocument = ({ docId, children }) => (
  <SharingContext.Consumer>
    {({
      hasWriteAccess,
      byDocId,
      isOwner,
      getRecipients,
      getSharingLink,
      refresh,
      revokeSelf
    } = {}) =>
      children({
        hasWriteAccess: hasWriteAccess(docId),
        isShared: byDocId !== undefined && byDocId[docId],
        isSharedByMe: byDocId !== undefined && byDocId[docId] && isOwner(docId),
        isSharedWithMe:
          byDocId !== undefined && byDocId[docId] && !isOwner(docId),
        recipients: getRecipients(docId),
        link: getSharingLink(docId) !== null,
        onFileDelete: refresh,
        onLeave: revokeSelf
      })
    }
  </SharingContext.Consumer>
)
