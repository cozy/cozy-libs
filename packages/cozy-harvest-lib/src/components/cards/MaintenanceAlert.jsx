import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import WrenchCircleIcon from 'cozy-ui/transpiled/react/Icons/WrenchCircle'

import { LaunchTriggerAlertMenu } from './LaunchTriggerAlertMenu'
import { TriggerAlertTemplate } from './TriggerAlertTemplate'
import { connectAction, configureAction } from './actions'
import { isDisconnected } from '../../helpers/konnectors'
import TriggerMaintenanceDescription from '../infos/TriggerMaintenanceDescription'

/**
 * This component warns the user that the connector displayed is in maintenance mode.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isRunnable - Indicates if the alert is runnable.
 * @param {boolean} props.withDescription - Indicates if the alert has a description.
 * @param {Array} props.messages - The maintenance messages to display.
 * @param {string} props.label - The label for the alert.
 * @param {string} props.konnectorRoot - The konnector root for the alert.
 * @param {string} props.trigger - The trigger for the alert.
 * @param {string} props.konnector - The konnector for the alert.
 * @returns {JSX.Element} The rendered MaintenanceAlert component.
 */
function MaintenanceAlert({
  isRunnable,
  withDescription,
  messages,
  label,
  konnectorRoot,
  trigger,
  konnector
}) {
  const navigate = useNavigate()

  const isKonnectorDisconnected = isDisconnected(konnector, trigger)

  const isBlock = !!withDescription
  const actions = [connectAction, configureAction]
  const options = {
    konnectorRoot,
    trigger,
    navigate,
    isDisconnected: isKonnectorDisconnected
  }

  return (
    <TriggerAlertTemplate
      color="var(--defaultBackgroundColor)"
      icon={<Icon icon={WrenchCircleIcon} color="var(--secondaryTextColor)" />}
      block={isBlock}
      label={label}
      labelColor="textSecondary"
      showAction={isRunnable}
      menu={<LaunchTriggerAlertMenu actions={actions} options={options} />}
    >
      {isBlock ? (
        <TriggerMaintenanceDescription maintenanceMessages={messages} />
      ) : null}
    </TriggerAlertTemplate>
  )
}

MaintenanceAlert.propTypes = {
  isRunnable: PropTypes.bool,
  withDescription: PropTypes.bool,
  messages: PropTypes.object,
  label: PropTypes.string,
  konnectorRoot: PropTypes.string,
  trigger: PropTypes.object,
  konnector: PropTypes.object
}

export { MaintenanceAlert }
