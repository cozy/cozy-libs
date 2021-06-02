import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { RecipientsAvatars } from './components/Recipient'

export const SharedRecipients = withLocales(({ docId, onClick, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients, getSharingLink, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <RecipientsAvatars
          recipients={getRecipients(docId)}
          link={getSharingLink(docId) !== null}
          onClick={onClick}
          isOwner={isOwner(docId)}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
))
