import React from 'react'

import { default as RecipientsList } from './components/WhoHasAccessLight'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const SharedRecipientsList = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, getRecipients } = {}) =>
      !byDocId || !byDocId[docId] || !isOwner(docId) ? null : (
        <RecipientsList
          recipients={getRecipients(docId).filter(r => r.status !== 'owner')}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
))
