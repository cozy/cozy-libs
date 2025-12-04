import PropTypes from 'prop-types'
import React from 'react'
import { useI18n } from 'twake-i18n'

import {
  computeExpirationDate,
  isExpired,
  makeExpiredMessage,
  makeExpiresInMessage
} from 'cozy-client/dist/models/paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

import withListItemLocales from '../hoc/withListItemLocales'

const ExpirationAnnotation = ({ file }) => {
  const { lang } = useI18n()

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

ExpirationAnnotation.propTypes = {
  file: PropTypes.object.isRequired
}

export default withListItemLocales(ExpirationAnnotation)
