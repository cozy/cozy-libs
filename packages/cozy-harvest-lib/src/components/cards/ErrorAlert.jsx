import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import InfoIcon from 'cozy-ui/transpiled/react/Icons/Info'

import { LaunchButton } from './LaunchButton'
import { LaunchTriggerAlertMenu } from './LaunchTriggerAlertMenu'
import { TriggerAlertTemplate } from './TriggerAlertTemplate'
import { UnrunnableAlert } from './UnrunnableAlert'
import { launchAction, connectAction, configureAction } from './actions'
import { isDisconnected } from '../../helpers/konnectors'
import TriggerErrorDescription from '../infos/TriggerErrorDescription'

/**
 * This component warns the user when the connector synchronisation is in error. It can also be used to restart synchronisation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the error alert.
 * @param {Error} props.error - The error object.
 * @param {string} props.konnectorRoot - The root URL of the konnector.
 * @param {Object} props.trigger - The trigger object.
 * @param {boolean} props.isRunning - Indicates if the konnector is running.
 * @param {Object} props.flow - The flow object.
 * @param {Object} props.account - The account object.
 * @param {Object} props.intentsApi - The intents API object.
 * @param {boolean} props.isRunnable - Indicates if the error is runnable.
 * @returns {JSX.Element} The rendered error alert component.
 */
function ErrorAlert({
  label,
  error,
  konnectorRoot,
  trigger,
  isRunning,
  flow,
  account,
  intentsApi,
  isRunnable
}) {
  const navigate = useNavigate()
  const { konnector } = flow
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)

  const actions = [launchAction, connectAction, configureAction]
  const options = {
    flow,
    account,
    intentsApi,
    error,
    navigate,
    konnectorRoot,
    trigger,
    isRunning,
    isDisconnected: isKonnectorDisconnected
  }

  return (
    <>
      <TriggerAlertTemplate
        block
        severity="error"
        icon={<Icon icon={InfoIcon} />}
        label={label}
        labelColor="error"
        showAction={isRunnable}
        menu={
          <LaunchTriggerAlertMenu
            actions={actions}
            options={options}
            disabled={isRunning}
          />
        }
        button={
          <LaunchButton
            konnectorRoot={konnectorRoot}
            trigger={trigger}
            isInError
            error={error}
            flow={flow}
            account={account}
            intentsApi={intentsApi}
            isRunning={isRunning}
          />
        }
      >
        <TriggerErrorDescription
          error={error}
          konnector={konnector}
          linkProps={{ className: 'u-error' }}
        />
      </TriggerAlertTemplate>
      {!isRunnable ? (
        <UnrunnableAlert
          konnectorName={konnector.name}
          className="u-mt-1"
          withoutIcon
        />
      ) : null}
    </>
  )
}

ErrorAlert.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  konnectorRoot: PropTypes.string,
  trigger: PropTypes.object.isRequired,
  isRunning: PropTypes.bool.isRequired,
  flow: PropTypes.object,
  account: PropTypes.object,
  intentsApi: PropTypes.object,
  isRunnable: PropTypes.bool.isRequired
}

export { ErrorAlert }
