import React from 'react'

import { MemberAvatar } from './components/Avatar/MemberAvatar'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharingOwnerAvatar = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getOwner } = {}) => {
      return !byDocId || !byDocId[docId] ? null : (
        <MemberAvatar recipient={getOwner(docId)} {...rest} />
      )
    }}
  </SharingContext.Consumer>
))
