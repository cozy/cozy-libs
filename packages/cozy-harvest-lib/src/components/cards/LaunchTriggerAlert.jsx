import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import WrenchCircleIcon from 'cozy-ui/transpiled/react/Icons/WrenchCircle'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { getKonnectorSlug } from '../../helpers/triggers'
import { isRunnable, isDisconnected } from '../../helpers/konnectors'
import { useFlowState } from '../../models/withConnectionFlow'
import { SUCCESS } from '../../models/flowEvents'
import withAdaptiveRouter from '../hoc/withRouter'
import TriggerErrorDescription from '../infos/TriggerErrorDescription'
import TriggerMaintenanceDescription from '../infos/TriggerMaintenanceDescription'
import KonnectorIcon from '../KonnectorIcon'
import { makeLabel } from './helpers'
import LaunchTriggerAlertMenu from './LaunchTriggerAlertMenu'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

const useStyles = makeStyles({
  root: {
    padding: '.5rem 1rem'
  },
  message: {
    maxWidth: ({ block }) => block && 'calc(100% - 16px - .5rem)' // 16px is the size of the icon
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
  withDescription
}) => {
  const client = useClient()
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const { error, trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)
  const { launch, konnector } = flow
  const {
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)
  const styles = useStyles({ block })

  const isInError = !!error
  const block = withDescription && (isInError || isInMaintenance)
  const isKonnectorRunnable = isRunnable({ win: window, konnector })
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)

  useEffect(() => {
    if (status === SUCCESS) {
      setShowSuccessSnackbar(true)
    }
  }, [status])

  return (
    <>
      <Alert
        color={
          isInError
            ? undefined
            : isInMaintenance
            ? 'var(--grey50)'
            : 'var(--paperBackgroundColor)'
        }
        severity={isInError ? 'error' : undefined}
        block={block}
        icon={
          isInError ? undefined : isInMaintenance ? (
            <Icon
              icon={WrenchCircleIcon}
              color={isInMaintenance ? 'var(--secondaryTextColor)' : undefined}
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
              {!isInMaintenance && !isKonnectorDisconnected && (
                <Button
                  variant="text"
                  color={isInError ? 'error' : undefined}
                  size="small"
                  disabled={running}
                  label={t('card.launchTrigger.button.label')}
                  onClick={() => launch({ autoSuccessTimer: false })}
                />
              )}
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
                expectingTriggerLaunch
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
  withDescription: PropTypes.bool
}

export default withAdaptiveRouter(LaunchTriggerAlert)
