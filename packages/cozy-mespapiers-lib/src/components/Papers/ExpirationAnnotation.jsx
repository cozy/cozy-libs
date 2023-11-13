import PropTypes from 'prop-types'
import React from 'react'

import { models } from 'cozy-client'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { formatLocallyDistanceToNowStrict } from 'cozy-ui/transpiled/react/providers/I18n/format'

const { computeExpirationDate, isExpired } = models.paper

const ExpirationAnnotation = ({ file }) => {
  const { t } = useI18n()

  if (isExpired(file)) {
    return (
      <Typography component="span" variant="inherit" color="error">
        {t('PapersList.expired')}
      </Typography>
    )
  }

  const expirationDate = computeExpirationDate(file)

  return (
    <Typography component="span" variant="inherit" className="u-warning">
      {t('PapersList.expiresIn', {
        duration: formatLocallyDistanceToNowStrict(expirationDate)
      })}
    </Typography>
  )
}

ExpirationAnnotation.propTypes = {
  file: PropTypes.object.isRequired
}

export default ExpirationAnnotation
