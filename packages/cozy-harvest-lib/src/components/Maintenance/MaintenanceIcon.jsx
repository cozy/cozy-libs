import cx from 'classnames'
import React from 'react'

import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import IconMaintenance from '../../assets/maintenance.svg'

const MaintenanceIcon = ({ breakpoints: { isMobile } }) => (
  <IconMaintenance
    className={cx(
      isMobile ? 'u-w-3' : 'u-w-4',
      isMobile ? 'u-h-3' : 'u-h-4',
      'u-mb-1-s',
      'u-mr-1'
    )}
  />
)

export default withBreakpoints()(MaintenanceIcon)
