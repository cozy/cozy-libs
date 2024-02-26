import React from 'react'

import { default as DumbSharedBadge } from './components/SharedBadge'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharedBadge = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <DumbSharedBadge byMe={isOwner(docId)} {...rest} />
      )
    }
  </SharingContext.Consumer>
))
