import React from 'react'

import { default as DumbConfirmTrustedRecipientsDialog } from './components/ConfirmTrustedRecipientsDialog'
import SharingContext from './context'
import withLocales from './hoc/withLocales'

export const ConfirmTrustedRecipientsDialog = withLocales(
  ({ document, ...rest }) => (
    <SharingContext.Consumer>
      {() => (
        <DumbConfirmTrustedRecipientsDialog document={document} {...rest} />
      )}
    </SharingContext.Consumer>
  )
)
