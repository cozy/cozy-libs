import React from 'react'

import RecipientAvatar from './components/Recipient/RecipientAvatar'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharingOwnerAvatar = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getOwner } = {}) => {
      return !byDocId || !byDocId[docId] ? null : (
        <RecipientAvatar recipient={getOwner(docId)} {...rest} />
      )
    }}
  </SharingContext.Consumer>
))
