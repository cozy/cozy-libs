import React, { useState, useEffect } from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

import { getLastSuccessDate, getKonnectorSlug } from '../../helpers/triggers'
import { isRunnable } from '../../helpers/konnectors'
import { useFlowState } from '../../models/withConnectionFlow'
import { SUCCESS } from '../../models/flowEvents'
import KonnectorIcon from '../KonnectorIcon'
import { makeLabel } from './helpers'

export const LaunchTriggerAlert = ({ flow, f, t, disabled }) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const { trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)
  const { launch, konnector } = flow

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
            <Button
              variant="text"
              size="small"
              disabled={running || disabled}
              label={t('card.launchTrigger.button.label')}
              onClick={() => launch({ autoSuccessTimer: false })}
            />
          )
        }
      >
        <Typography variant="caption">
          {makeLabel({
            t,
            f,
            running,
            expectingTriggerLaunch,
            lastSuccessDate
          })}
        </Typography>
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

export default LaunchTriggerAlert
