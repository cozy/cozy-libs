import PropTypes from 'prop-types'
import React from 'react'

import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import LaunchTriggerAlert from './LaunchTriggerAlert'
import { intentsApiProptype } from '../../helpers/proptypes'
import FlowProvider from '../FlowProvider'

/**
 * Shows the state of the trigger and provides the ability to
 * relaunch a trigger
 *
 * - Will follow the connection flow and re-render in case of change
 */
const LaunchTriggerCard = props => {
  if (props.flow) {
    return <LaunchTriggerAlert {...props} />
  }

  const normalizedProps = { ...props }
  if (props.initialTrigger) {
    // eslint-disable-next-line no-console
    console.warn(
      'props.initialTrigger is deprecated for LaunchTriggerCard, please use flowProps={{ initialTrigger: {...} }} instead.'
    )
    normalizedProps.flowProps = { initialTrigger: props.initialTrigger }
  }

  return (
    <FlowProvider {...normalizedProps.flowProps}>
      {({ flow }) => {
        return <LaunchTriggerAlert {...props} flow={flow} />
      }}
    </FlowProvider>
  )
}

LaunchTriggerCard.propTypes = {
  ...Card.propTypes,

  /** @type {Object} A ConnectionFlow instance */
  flow: PropTypes.object,

  /** @type {Object} ConnectionFlow options (used if props.flow is not provided) */
  flowProps: PropTypes.object,

  /**
   * Disables the "run trigger" button
   */
  disabled: PropTypes.bool,
  intentsApi: intentsApiProptype,
  account: PropTypes.object
}

export default translate()(LaunchTriggerCard)
