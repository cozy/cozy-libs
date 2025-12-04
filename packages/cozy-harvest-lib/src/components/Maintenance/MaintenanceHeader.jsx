import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { translate } from 'twake-i18n'

import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import MaintenanceIcon from './MaintenanceIcon'

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
      <Typography className="u-ta-center-s u-error" variant="h5">
        {t('maintenance.noService')}
      </Typography>
      <Typography className="u-error" variant="body1">
        {message}
      </Typography>
    </Stack>
  </div>
)

MaintenanceHeader.propTypes = {
  message: PropTypes.string,
  breakpoints: PropTypes.shape({ isMobile: PropTypes.bool.isRequired })
    .isRequired
}

export default withBreakpoints()(translate()(MaintenanceHeader))
