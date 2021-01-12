import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import { getErrorLocale } from '../../helpers/konnectors'
import FlowProvider from '../FlowProvider'

import WarningIcon from 'cozy-ui/transpiled/react/Icons/Warning'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'

/**
 *
 * Display trigger's status.
 * Get error / running from FlowProvider (aka realtime)
 */
const Status = ({ t, trigger, konnector }) => {
  return (
    <FlowProvider initialTrigger={trigger}>
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
            className="u-flex-shrink-0 u-valid"
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
