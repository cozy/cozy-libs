import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'

import withLocales from '../hoc/withLocales'
import * as triggersModel from '../../helpers/triggers'
import { getErrorLocale } from '../../helpers/konnectors'

const Status = ({ t, trigger, konnector }) => {
  const error = triggersModel.getError(trigger)
  const errorTitle = getErrorLocale(error, konnector, t, 'title')

  if (error) {
    return (
      <div className="u-pomegranate u-flex u-flex-justify-center u-flex-items-center">
        <span className="u-mr-half u-caption u-pomegranate">{errorTitle}</span>
        <Icon icon="warning" />
      </div>
    )
  } else {
    return <Icon icon="check-circleless" color={palette['malachite']} />
  }
}

Status.propTypes = {
  konnector: PropTypes.shape({
    name: PropTypes.string,
    vendor_link: PropTypes.string
  }).isRequired,
  trigger: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default withLocales(Status)
