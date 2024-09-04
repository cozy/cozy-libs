import PropTypes from 'prop-types'
import React from 'react'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { LaunchButton } from './LaunchButton'
import { LaunchTriggerAlertMenu } from './LaunchTriggerAlertMenu'
import { TriggerAlertTemplate } from './TriggerAlertTemplate'
import { UnrunnableAlert } from './UnrunnableAlert'
import { launchAction, connectAction, configureAction } from './actions'
import { isDisconnected } from '../../helpers/konnectors'
import KonnectorIcon from '../KonnectorIcon'

/**
 * This component allows users to synchronise their connector. It also warns the user when the connector is running.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label of the alert.
 * @param {boolean} props.isRunning - Indicates if the alert is currently running.
 * @param {string} props.konnectorSlug - The slug of the konnector.
 * @param {string} props.konnectorRoot - The root of the konnector.
 * @param {Object} props.trigger - The trigger object.
 * @param {Object} props.error - The error object.
 * @param {Function} props.historyAction - The history action function.
 * @param {Object} props.flow - The flow object.
 * @param {Object} props.account - The account object.
 * @param {Object} props.intentsApi - The intents API object.
 * @param {boolean} props.isRunnable - Indicates if the alert is runnable.
 * @returns {JSX.Element} The RunnableAlert component.
 */
function RunnableAlert({
  label,
  isRunning,
  konnectorSlug,
  konnectorRoot,
  trigger,
  error,
  historyAction,
  flow,
  account,
  intentsApi,
  isRunnable
}) {
  const { isMobile } = useBreakpoints()
  const { konnector } = flow
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)

  const actions = [launchAction, connectAction, configureAction]
  const options = {
    flow,
    account,
    intentsApi,
    error,
    historyAction,
    konnectorRoot,
    trigger,
    isRunning,
    isDisconnected: isKonnectorDisconnected
  }

  if (!isRunnable) {
    return <UnrunnableAlert konnectorName={konnector.name} />
  }

  return (
    <TriggerAlertTemplate
      label={label}
      color={
        isMobile
          ? 'var(--paperBackgroundColor)'
          : 'var(--contrastBackgroundColor)'
      }
      icon={
        isRunning ? (
          <Spinner className="u-flex" noMargin />
        ) : (
          <KonnectorIcon
            className="u-w-1 u-h-1"
            konnector={{ slug: konnectorSlug }}
          />
        )
      }
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
          isRunning={isRunning}
          error={error}
          historyAction={historyAction}
          flow={flow}
          account={account}
          intentsApi={intentsApi}
        />
      }
    />
  )
}

RunnableAlert.propTypes = {
  label: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  konnectorSlug: PropTypes.string.isRequired,
  konnectorRoot: PropTypes.string,
  trigger: PropTypes.object.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  historyAction: PropTypes.func.isRequired,
  flow: PropTypes.object,
  account: PropTypes.object,
  intentsApi: PropTypes.object,
  isRunnable: PropTypes.bool.isRequired
}

export { RunnableAlert }
