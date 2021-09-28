import React from 'react'

import SharingContext from './context'
import withLocales from './withLocales'
import { default as DumbConfirmTrustedRecipientsDialog } from './components/ConfirmTrustedRecipientsDialog'

export const ConfirmTrustedRecipientsDialog = withLocales(
  ({ document, ...rest }) => (
    <SharingContext.Consumer>
      {() => (
        <DumbConfirmTrustedRecipientsDialog document={document} {...rest} />
      )}
    </SharingContext.Consumer>
  )
)
