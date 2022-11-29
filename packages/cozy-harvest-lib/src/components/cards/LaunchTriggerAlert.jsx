import React from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import KonnectorIcon from '../KonnectorIcon'
import { getLastSuccessDate, getKonnectorSlug } from '../../helpers/triggers'
import { isRunnable } from '../../helpers/konnectors'
import { useFlowState } from '../../models/withConnectionFlow'
import { makeLabel } from './helpers'

export const LaunchTriggerAlert = ({ flow, f, t, disabled }) => {
  const { trigger, running, expectingTriggerLaunch } = useFlowState(flow)
  const { launch, konnector } = flow
  const lastSuccessDate = getLastSuccessDate(trigger)
  const isKonnectorRunnable = isRunnable({ win: window, konnector })

  return (
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
  )
}

export default LaunchTriggerAlert
