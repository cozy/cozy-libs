import React, { useRef, useState, useEffect } from 'react'

import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'

import { getLastSuccessDate, getKonnectorSlug } from '../../helpers/triggers'
import { isRunnable } from '../../helpers/konnectors'
import { useFlowState } from '../../models/withConnectionFlow'
import { SUCCESS } from '../../models/flowEvents'
import withAdaptiveRouter from '../hoc/withRouter'
import KonnectorIcon from '../KonnectorIcon'
import { makeLabel } from './helpers'

const styles = {
  // tricks to put 48px wide button inside 32px height container
  // without enlarging the container
  iconButtonWrapper: { height: 32, width: 46 }
}

export const LaunchTriggerAlert = ({
  flow,
  f,
  t,
  disabled,
  konnectorRoot,
  historyAction
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const { trigger, running, expectingTriggerLaunch, status } =
    useFlowState(flow)
  const { launch, konnector } = flow

  const lastSuccessDate = getLastSuccessDate(trigger)
  const isKonnectorRunnable = isRunnable({ win: window, konnector })
  const anchorRef = useRef()
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    if (status === SUCCESS) {
      setShowSuccessSnackbar(true)
    }
  }, [status])

  return (
    <>
      <Alert
        className="u-pr-half"
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
            <>
              <Button
                variant="text"
                size="small"
                disabled={running || disabled}
                label={t('card.launchTrigger.button.label')}
                onClick={() => launch({ autoSuccessTimer: false })}
              />
              <div
                className="u-flex u-flex-items-center"
                style={styles.iconButtonWrapper}
              >
                <IconButton
                  ref={anchorRef}
                  onClick={() => setShowOptions(true)}
                >
                  <Icon icon={DotsIcon} />
                </IconButton>
              </div>
              {showOptions && (
                <ActionMenu
                  anchorElRef={anchorRef}
                  autoclose={true}
                  onClose={() => setShowOptions(false)}
                >
                  {!running && !disabled && (
                    <ActionMenuItem
                      left={<Icon icon={SyncIcon} />}
                      onClick={() => {
                        launch({ autoSuccessTimer: false })
                        setShowOptions(false)
                      }}
                    >
                      {t('card.launchTrigger.button.label')}
                    </ActionMenuItem>
                  )}
                  <ActionMenuItem
                    left={<Icon icon={GearIcon} />}
                    onClick={() =>
                      historyAction(`${konnectorRoot}/config`, 'push')
                    }
                  >
                    {t('card.launchTrigger.configure')}
                  </ActionMenuItem>
                </ActionMenu>
              )}
            </>
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

LaunchTriggerAlert.defaultProps = {
  konnectorRoot: ''
}

export default withAdaptiveRouter(LaunchTriggerAlert)
