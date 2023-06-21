import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Info from 'cozy-ui/transpiled/react/Icons/Info'
import WrenchCircleIcon from 'cozy-ui/transpiled/react/Icons/WrenchCircle'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import LaunchTriggerAlertMenu from './LaunchTriggerAlertMenu'
import { RunningAlert } from './RunningAlert'
import { makeLabel } from './helpers'
import { isDisconnected } from '../../helpers/konnectors'
import { intentsApiProptype } from '../../helpers/proptypes'
import { getAccountId, getKonnectorSlug } from '../../helpers/triggers'
import { findKonnectorPolicy } from '../../konnector-policies'
import { SUCCESS } from '../../models/flowEvents'
import { useFlowState } from '../../models/withConnectionFlow'
import OpenOAuthWindowButton from '../AccountModalWithoutTabs/OpenOAuthWindowButton'
import KonnectorIcon from '../KonnectorIcon'
import withAdaptiveRouter from '../hoc/withRouter'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'
import TriggerErrorDescription from '../infos/TriggerErrorDescription'
import TriggerMaintenanceDescription from '../infos/TriggerMaintenanceDescription'

const useStyles = makeStyles({
  root: {
    padding: '.5rem 1rem'
  },
  message: ({ block }) =>
    block && {
      maxWidth: 'calc(100% - 16px - .5rem)' // 16px is the size of the icon
    },
  action: {
    marginRight: '-.5rem'
  },
  icon: {
    marginRight: '.5rem'
  }
})

export const LaunchTriggerAlert = ({
  flow,
  t,
  konnectorRoot,
  historyAction,
  intentsApi,
  account,
  withMaintenanceDescription
}) => {
  const client = useClient()
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const { error, trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)
  const { launch, konnector } = flow
  const {
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)

  const isInError = !!error
  const block = isInError || (!!withMaintenanceDescription && isInMaintenance)
  const styles = useStyles({ block })
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const isKonnectorRunnable = konnectorPolicy.isRunnable()
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)

  useEffect(() => {
    if (status === SUCCESS) {
      setShowSuccessSnackbar(true)
    }
  }, [status])

  const SyncButtonAction = konnectorPolicy.shouldLaunchRedirectToEdit(error)
    ? () =>
        historyAction(
          konnectorRoot
            ? `${konnectorRoot}/accounts/${getAccountId(trigger)}/edit`
            : '/edit',
          'push'
        )
    : () => launch({ autoSuccessTimer: false })
  const alertColor = () => {
    if (isInError) return undefined
    if (isInMaintenance) return 'var(--grey50)'
    if (!isKonnectorRunnable) {
      return 'var(--grey100)'
    }
    return 'var(--paperBackgroundColor)'
  }
  return (
    <>
      <Alert
        color={alertColor()}
        severity={isInError ? 'error' : undefined}
        block={block}
        icon={
          isInError ? undefined : isInMaintenance || !isKonnectorRunnable ? (
            <Icon
              icon={isInMaintenance ? WrenchCircleIcon : Info}
              color={
                isInMaintenance
                  ? 'var(--secondaryTextColor)'
                  : 'var(--iconTextColor)'
              }
            />
          ) : running ? (
            <Spinner className="u-flex" noMargin />
          ) : (
            <KonnectorIcon
              className="u-w-1 u-h-1"
              konnector={konnector}
              konnectorSlug={getKonnectorSlug(trigger)}
            />
          )
        }
        action={
          isKonnectorRunnable && (
            <>
              {!isInMaintenance &&
                !isKonnectorDisconnected &&
                (konnectorPolicy.shouldLaunchDisplayOAuthWindow(error) ? (
                  <OpenOAuthWindowButton
                    flow={flow}
                    account={account}
                    intentsApi={intentsApi}
                    konnector={konnector}
                  />
                ) : (
                  <Button
                    variant="text"
                    color={isInError ? 'error' : undefined}
                    size="small"
                    disabled={running}
                    label={t('card.launchTrigger.button.label')}
                    onClick={SyncButtonAction}
                  />
                ))}
              {!block && (
                <div
                  style={{
                    margin: '-.5rem -.5rem -.5rem 0'
                  }}
                >
                  <LaunchTriggerAlertMenu
                    flow={flow}
                    t={t}
                    konnectorRoot={konnectorRoot}
                    historyAction={historyAction}
                    account={account}
                    intentsApi={intentsApi}
                  />
                </div>
              )}
            </>
          )
        }
        classes={styles}
      >
        <div
          className="u-flex-auto u-flex u-flex-column"
          style={{ gap: '.5rem' }}
        >
          <div className="u-flex u-flex-items-center">
            <Typography
              variant="caption"
              className="u-flex-auto"
              color={
                isInError
                  ? 'error'
                  : isInMaintenance
                  ? 'textSecondary'
                  : undefined
              }
            >
              {makeLabel({
                t,
                konnector,
                trigger,
                running,
                expectingTriggerLaunch,
                isInMaintenance,
                isKonnectorRunnable
              })}
            </Typography>
            {block && (
              <div
                style={{
                  margin: '-1rem -1rem -1rem 0'
                }}
              >
                <LaunchTriggerAlertMenu
                  flow={flow}
                  t={t}
                  konnectorRoot={konnectorRoot}
                  historyAction={historyAction}
                  account={account}
                  intentsApi={intentsApi}
                />
              </div>
            )}
          </div>
          {block && isInError && (
            <TriggerErrorDescription
              error={error}
              konnector={konnector}
              linkProps={{ className: 'u-error' }}
            />
          )}
          {block && isInMaintenance && (
            <TriggerMaintenanceDescription
              maintenanceMessages={maintenanceMessages}
            />
          )}
        </div>
      </Alert>

      {konnectorPolicy.shouldDisplayRunningAlert({ running }) && (
        <RunningAlert />
      )}

      <Snackbar
        open={showSuccessSnackbar}
        onClose={() => setShowSuccessSnackbar(false)}
      >
        <Alert
          variant="filled"
          elevation={6}
          severity="success"
          onClose={() => setShowSuccessSnackbar(false)}
        >
          {t('card.launchTrigger.success')}
        </Alert>
      </Snackbar>
    </>
  )
}

LaunchTriggerAlert.defaultProps = {
  konnectorRoot: ''
}

LaunchTriggerAlert.propTypes = {
  flow: PropTypes.object,
  t: PropTypes.func,
  konnectorRoot: PropTypes.string,
  historyAction: PropTypes.func,
  withDescription: PropTypes.bool,
  intentsApi: intentsApiProptype,
  account: PropTypes.object
}

export default withAdaptiveRouter(LaunchTriggerAlert)
