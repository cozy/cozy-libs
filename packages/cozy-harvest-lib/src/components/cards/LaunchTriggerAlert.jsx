import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

import { getLastSuccessDate, getKonnectorSlug } from '../../helpers/triggers'
import { isRunnable } from '../../helpers/konnectors'
import { useFlowState } from '../../models/withConnectionFlow'
import { SUCCESS } from '../../models/flowEvents'
import withAdaptiveRouter from '../hoc/withRouter'
import TriggerErrorDescription from '../infos/TriggerErrorDescription'
import TriggerMaintenanceDescription from '../infos/TriggerMaintenanceDescription'
import KonnectorIcon from '../KonnectorIcon'
import { makeLabel } from './helpers'
import LaunchTriggerAlertMenu from './LaunchTriggerAlertMenu'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

export const LaunchTriggerAlert = ({
  flow,
  f,
  t,
  konnectorRoot,
  historyAction,
  withDescription
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const client = useClient()
  const { error, trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)
  const { launch, konnector } = flow
  const {
    data: { isInMaintenance, messages: maintenanceMessages }
  } = useMaintenanceStatus(client, konnector)
  const isInError = !!error
  const block = withDescription && (isInError || isInMaintenance)

  const lastSuccessDate = getLastSuccessDate(trigger)
  const isKonnectorRunnable = isRunnable({ win: window, konnector })

  useEffect(() => {
    if (status === SUCCESS) {
      setShowSuccessSnackbar(true)
    }
  }, [status])

  return (
    <>
      <Alert
        color="var(--paperBackground)"
        block={block}
        icon={
          running ? (
            <Spinner className="u-flex" noMargin />
          ) : (
            <KonnectorIcon
              className="u-w-1 u-h-1"
              konnectorSlug={getKonnectorSlug(trigger)}
            />
          )
        }
        action={
          isKonnectorRunnable && (
            <>
              {!isInMaintenance && (
                <Button
                  variant="text"
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
                    isInMaintenance={isInMaintenance}
                    konnectorRoot={konnectorRoot}
                    historyAction={historyAction}
                  />
                </div>
              )}
            </>
          )
        }
      >
        <div
          className="u-flex-auto u-flex u-flex-column"
          style={{ gap: '.5rem' }}
        >
          <div className="u-flex u-flex-items-center">
            <Typography variant="caption" className="u-flex-auto">
              {makeLabel({
                t,
                f,
                running,
                expectingTriggerLaunch,
                lastSuccessDate
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
                  isInMaintenance={isInMaintenance}
                  konnectorRoot={konnectorRoot}
                  historyAction={historyAction}
                />
              </div>
            )}
          </div>
          {block && isInError && (
            <TriggerErrorDescription error={error} konnector={konnector} />
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
  f: PropTypes.func,
  t: PropTypes.func,
  konnectorRoot: PropTypes.string,
  historyAction: PropTypes.func,
  withDescription: PropTypes.bool
}

export default withAdaptiveRouter(LaunchTriggerAlert)
