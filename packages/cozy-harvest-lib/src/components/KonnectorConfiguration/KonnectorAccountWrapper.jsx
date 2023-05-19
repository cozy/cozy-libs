import PropTypes from 'prop-types'
import React from 'react'

import flag from 'cozy-flags'

import KonnectorAccountTabs from './KonnectorAccountTabs'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../helpers/proptypes'
import FlowProvider from '../FlowProvider'

export const KonnectorAccountWrapper = props => {
  const { Component, ...rest } = props

  return (
    <FlowProvider
      initialTrigger={props.initialTrigger}
      konnector={props.konnector}
    >
      {({ flow }) => {
        if (flag('harvest.inappconnectors.enabled')) {
          return (
            <Component {...rest} trigger={rest.initialTrigger} flow={flow} />
          )
        }
        return <KonnectorAccountTabs {...rest} flow={flow} />
      }}
    </FlowProvider>
  )
}

KonnectorAccountWrapper.propTypes = {
  konnector: PropTypes.object.isRequired,
  initialTrigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  /** @type {string} Can be used to force the initial tab */
  initialActiveTab: PropTypes.oneOf(['configuration', 'data']),
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype,
  Component: PropTypes.func
}

export default KonnectorAccountWrapper
