import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  default as DumbShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'
import SharingContext from './context'
import withLocales from './withLocales'

export const ShareButton = withLocales(({ docId, useShortLabel, ...rest }) => {
  const { t } = useI18n()
  const restProps = { ...rest, t: null, f: null, lang: null }
  return (
    <SharingContext.Consumer>
      {({ byDocId, documentType, isOwner }) => {
        return !byDocId[docId] ? (
          <DumbShareButton
            label={t(`${documentType}.share.cta`)}
            {...restProps}
          />
        ) : isOwner(docId) ? (
          <SharedByMeButton
            label={
              useShortLabel
                ? t(`${documentType}.share.shared`)
                : t(`${documentType}.share.sharedByMe`)
            }
            {...restProps}
          />
        ) : (
          <SharedWithMeButton
            label={
              useShortLabel
                ? t(`${documentType}.share.shared`)
                : t(`${documentType}.share.sharedWithMe`)
            }
            {...restProps}
          />
        )
      }}
    </SharingContext.Consumer>
  )
})
