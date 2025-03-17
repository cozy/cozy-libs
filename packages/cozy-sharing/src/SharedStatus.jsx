import React from 'react'

import { AvatarList } from './components/Avatar/AvatarList'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharedStatus = withLocales(
  ({ docId, className, noSharedClassName, onClick, showMeAsOwner }) => (
    <SharingContext.Consumer>
      {({ byDocId, getRecipients, getSharingLink, isOwner } = {}) =>
        !byDocId || !byDocId[docId] ? (
          <span className={className + ' ' + noSharedClassName}>—</span>
        ) : (
          <AvatarList
            className={className}
            recipients={getRecipients(docId)}
            link={getSharingLink(docId) !== null}
            onClick={onClick}
            isOwner={isOwner(docId)}
            size="s"
            showMeAsOwner={showMeAsOwner}
          />
        )
      }
    </SharingContext.Consumer>
  )
)
