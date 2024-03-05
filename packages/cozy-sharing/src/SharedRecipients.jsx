import React from 'react'

import { AvatarList } from './components/Avatar/AvatarList'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharedRecipients = withLocales(({ docId, onClick, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients, getSharingLink, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <AvatarList
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
