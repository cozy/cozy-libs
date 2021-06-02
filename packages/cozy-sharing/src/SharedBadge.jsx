import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { default as DumbSharedBadge } from './components/SharedBadge'

export const SharedBadge = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <DumbSharedBadge byMe={isOwner(docId)} {...rest} />
      )
    }
  </SharingContext.Consumer>
))
