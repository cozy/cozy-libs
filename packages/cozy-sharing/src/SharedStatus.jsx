import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { RecipientsAvatars } from './components/Recipient'

export const SharedStatus = withLocales(
  ({ docId, className, noSharedClassName, onClick, showMeAsOwner }) => (
    <SharingContext.Consumer>
      {({ byDocId, getRecipients, getSharingLink, isOwner } = {}) =>
        !byDocId || !byDocId[docId] ? (
          <span className={className + ' ' + noSharedClassName}>—</span>
        ) : (
          <RecipientsAvatars
            className={className}
            recipients={getRecipients(docId)}
            link={getSharingLink(docId) !== null}
            onClick={onClick}
            isOwner={isOwner(docId)}
            size={24}
            showMeAsOwner={showMeAsOwner}
          />
        )
      }
    </SharingContext.Consumer>
  )
)
