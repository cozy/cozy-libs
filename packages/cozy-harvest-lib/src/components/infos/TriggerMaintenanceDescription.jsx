import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

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
