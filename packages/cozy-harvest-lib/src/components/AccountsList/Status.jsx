import PropTypes from 'prop-types'
import React from 'react'
import { translate } from 'twake-i18n'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import WarningIcon from 'cozy-ui/transpiled/react/Icons/Warning'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { getErrorLocale } from '../../helpers/konnectors'
import FlowProvider from '../FlowProvider'

/**
 *
 * Display trigger's status.
 * Get error / running from FlowProvider (aka realtime)
 */
const Status = ({ t, trigger, konnector }) => {
  return (
    <FlowProvider initialTrigger={trigger} konnector={konnector}>
      {({ flow }) => {
        const { error, running } = flow.getState()
        const errorTitle = getErrorLocale(error, konnector, t, 'title')
        if (running) {
          return (
            <div className="u-flex u-flex-justify-center u-flex-items-center">
              <Spinner className="u-flex-shrink-0" />
            </div>
          )
        }
        if (error) {
          return (
            <div className="u-flex u-flex-justify-center u-flex-items-center">
              <Typography variant="caption" className="u-mr-half u-error">
                {errorTitle}
              </Typography>
              <Icon
                icon={WarningIcon}
                size={16}
                className="u-error u-flex-shrink-0"
              />
            </div>
          )
        }
        return (
          <Icon
            icon={CheckIcon}
            size={16}
            className="u-flex-shrink-0 u-valid u-success"
          />
        )
      }}
    </FlowProvider>
  )
}

Status.propTypes = {
  konnector: PropTypes.shape({
    name: PropTypes.string,
    vendor_link: PropTypes.string
  }).isRequired,
  trigger: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(Status)
