import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Text, { SubTitle } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'

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
          <SubTitle>{t('maintenance.explanationTitle')}</SubTitle>
          <Text>
            <Markdown source={longMessage} />
          </Text>
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
