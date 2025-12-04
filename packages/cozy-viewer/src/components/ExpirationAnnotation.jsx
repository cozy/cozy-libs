import React from 'react'
import { useI18n } from 'twake-i18n'

import { models } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'

const {
  computeExpirationDate,
  isExpired,
  makeExpiredMessage,
  makeExpiresInMessage
} = models.paper

import { useViewer } from '../providers/ViewerProvider'

const ExpirationAnnotation = () => {
  const { lang } = useI18n()
  const { file } = useViewer()

  if (isExpired(file)) {
    return (
      <Typography component="span" variant="inherit" color="error">
        {makeExpiredMessage({ lang })}
      </Typography>
    )
  }

  const expirationDate = computeExpirationDate(file)

  return (
    <Typography component="span" variant="inherit" className="u-warning">
      {makeExpiresInMessage(expirationDate, { lang })}
    </Typography>
  )
}

export default ExpirationAnnotation
