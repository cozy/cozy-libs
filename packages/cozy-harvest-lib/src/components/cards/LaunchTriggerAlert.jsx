import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

import { RunningAlert } from './RunningAlert'
import { TriggerAlert } from './TriggerAlert'
import { intentsApiProptype } from '../../helpers/proptypes'
import { findKonnectorPolicy } from '../../konnector-policies'
import { SUCCESS } from '../../models/flowEvents'
import { useFlowState } from '../../models/withConnectionFlow'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

export const LaunchTriggerAlert = ({
  flow,
  t,
  konnectorRoot,
  intentsApi,
  account,
  withMaintenanceDescription
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const { error, trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)

  const { konnector } = flow
  const {
    data: { isInMaintenance, messages: maintenanceMessages },
    fetchStatus: maintenanceFetchStatus
  } = useMaintenanceStatus(konnector.slug)

  const isInError = !!error
  /** The connector is considered to be running if the trigger is waiting to be launched */
  const isRunning = running || expectingTriggerLaunch
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const isKonnectorRunnable = konnectorPolicy.isRunnable()

  useEffect(() => {
    if (status === SUCCESS) {
      setShowSuccessSnackbar(true)
    }
  }, [status])

  return (
    <>
      {maintenanceFetchStatus === 'loaded' ? (
        <TriggerAlert
          trigger={trigger}
          isRunning={isRunning}
          isRunnable={isKonnectorRunnable}
          isInError={isInError}
          isInMaintenance={isInMaintenance}
          error={error}
          withMaintenanceDescription={withMaintenanceDescription}
          maintenanceMessages={maintenanceMessages}
          account={account}
          konnectorRoot={konnectorRoot}
          intentsApi={intentsApi}
          flow={flow}
        />
      ) : null}

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
  withDescription: PropTypes.bool,
  intentsApi: intentsApiProptype,
  account: PropTypes.object
}

export default LaunchTriggerAlert
