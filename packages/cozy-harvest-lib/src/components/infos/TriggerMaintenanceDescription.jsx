import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Markdown from '../Markdown'

const TriggerMaintenanceDescription = ({ maintenanceMessages }) => {
  const { lang } = useI18n()
  const longMessage = get(maintenanceMessages, [lang, 'long_message'])

  if (!longMessage) {
    return null
  }

  return (
    <Typography variant="body1" component="div">
      <Markdown source={longMessage} />
    </Typography>
  )
}

TriggerMaintenanceDescription.propTypes = {
  maintenanceMessages: PropTypes.shape({
    en: PropTypes.shape({
      long_message: PropTypes.string,
      short_message: PropTypes.string
    }),
    fr: PropTypes.shape({
      long_message: PropTypes.string,
      short_message: PropTypes.string
    })
  })
}

export default TriggerMaintenanceDescription
