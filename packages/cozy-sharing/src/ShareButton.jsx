import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import SharingContext from './context'
import withLocales from './withLocales'
import {
  default as DumbShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'

export const ShareButton = withLocales(({ docId, useShortLabel, ...rest }) => {
  const { t } = useI18n()

  return (
    <SharingContext.Consumer>
      {({ byDocId, documentType, isOwner }) => {
        return !byDocId[docId] ? (
          <DumbShareButton label={t(`${documentType}.share.cta`)} {...rest} />
        ) : isOwner(docId) ? (
          <SharedByMeButton
            label={
              useShortLabel
                ? t(`${documentType}.share.shared`)
                : t(`${documentType}.share.sharedByMe`)
            }
            {...rest}
          />
        ) : (
          <SharedWithMeButton
            label={
              useShortLabel
                ? t(`${documentType}.share.shared`)
                : t(`${documentType}.share.sharedWithMe`)
            }
            {...rest}
          />
        )
      }}
    </SharingContext.Consumer>
  )
})
