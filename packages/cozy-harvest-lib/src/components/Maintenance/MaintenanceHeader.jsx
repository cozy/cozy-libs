import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import MaintenanceIcon from './MaintenanceIcon'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Text, { SubTitle } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'

const MaintenanceHeader = ({ message, t, breakpoints: { isMobile } }) => (
  <div
    className={cx(
      'u-flex',
      isMobile ? 'u-flex-column' : 'u-flex-row',
      'u-flex-justify-center',
      'u-flex-items-center',
      'u-mb-1'
    )}
  >
    <MaintenanceIcon />
    <Stack spacing="xs">
      <SubTitle className="u-ta-center-s u-pomegranate">
        {t('maintenance.noService')}
      </SubTitle>
      <Text className="u-pomegranate">{message}</Text>
    </Stack>
  </div>
)

MaintenanceHeader.propTypes = {
  message: PropTypes.string,
  breakpoints: PropTypes.shape({ isMobile: PropTypes.bool.isRequired })
    .isRequired
}

export default withBreakpoints()(translate()(MaintenanceHeader))
