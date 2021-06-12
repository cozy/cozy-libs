import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { RecipientAvatar } from './components/Recipient'

export const SharingOwnerAvatar = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getOwner } = {}) => {
      return !byDocId || !byDocId[docId] ? null : (
        <RecipientAvatar recipient={getOwner(docId)} {...rest} />
      )
    }}
  </SharingContext.Consumer>
))
