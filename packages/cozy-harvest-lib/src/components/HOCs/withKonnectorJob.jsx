import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

import KonnectorJob from '../../models/KonnectorJob'

export const KonnectorJobPropTypes = {
  /**
   * The trigger to launch
   */
  trigger: PropTypes.object.isRequired
}

export const withKonnectorJob = WrappedComponent => {
  class ComponentWithKonnectorJob extends PureComponent {
    constructor(props, context) {
      super(props, context)
      this.konnectorJob = new KonnectorJob(context.client, props.trigger)
    }
    render() {
      return (
        <WrappedComponent {...this.props} konnectorJob={this.konnectorJob} />
      )
    }
  }
  ComponentWithKonnectorJob.contextTypes = {
    client: PropTypes.object.isRequired
  }
  ComponentWithKonnectorJob.propTypes = {
    /**
     * KonnectorJob required and provided props
     */
    ...KonnectorJobPropTypes,
    ...(omit(WrappedComponent.propTypes, 'konnectorJob') || {})
  }
  return ComponentWithKonnectorJob
}

export default withKonnectorJob
