import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import MaintenanceHeader from './MaintenanceHeader'

import Markdown from '../Markdown'

const KonnectorMaintenance = ({ maintenanceMessages, lang, t }) => {
  const longMessage = get(maintenanceMessages, [lang, 'long_message'])
  const shortMessage = get(maintenanceMessages, [lang, 'short_message'])
  return (
    <div>
      <MaintenanceHeader message={shortMessage} />
      {longMessage && (
        <Stack spacing="xs">
          <Typography variant="h5">
            {t('maintenance.explanationTitle')}
          </Typography>
          <Typography variant="body1">
            <Markdown source={longMessage} />
          </Typography>
        </Stack>
      )}
    </div>
  )
}

KonnectorMaintenance.propTypes = {
  maintenanceMessages: PropTypes.shape({
    en: PropTypes.shape({
      long_message: PropTypes.string,
      short_message: PropTypes.string
    }),
    fr: PropTypes.shape({
      long_message: PropTypes.string,
      short_message: PropTypes.string
    })
  }),
  lang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(KonnectorMaintenance)
