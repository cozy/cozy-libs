import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'

import { isDisconnected } from '../../helpers/konnectors'
import { intentsApiProptype } from '../../helpers/proptypes'
import { findKonnectorPolicy } from '../../konnector-policies'
import { useFlowState } from '../../models/withConnectionFlow'
import OpenOAuthWindowButton from '../AccountModalWithoutTabs/OpenOAuthWindowButton'
import withAdaptiveRouter from '../hoc/withRouter'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

const LaunchTriggerAlertMenu = ({
  flow,
  t,
  konnectorRoot,
  historyAction,
  account,
  intentsApi
}) => {
  const { running, trigger, error } = useFlowState(flow)
  const { launch, konnector } = flow
  const {
    data: { isInMaintenance }
  } = useMaintenanceStatus(konnector.slug)
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const isKonnectorRunnable = konnectorPolicy.isRunnable()
  const isClisk = konnectorPolicy.name === 'clisk'

  const anchorRef = useRef()
  const [showOptions, setShowOptions] = useState(false)

  const SyncButtonAction = konnectorPolicy.shouldLaunchRedirectToEdit(error)
    ? () =>
        historyAction(
          konnectorRoot
            ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
                trigger
              )}/edit`
            : '/edit',
          'push'
        )
    : () => launch({ autoSuccessTimer: false })

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={() => setShowOptions(true)}
        data-testid="alert-menu-button"
      >
        <Icon icon={DotsIcon} />
      </IconButton>
      {showOptions && (
        <ActionMenu
          anchorElRef={anchorRef}
          autoclose={true}
          onClose={() => setShowOptions(false)}
        >
          {isKonnectorRunnable &&
            !running &&
            !isInMaintenance &&
            !isKonnectorDisconnected &&
            (konnectorPolicy.shouldLaunchDisplayOAuthWindow(error) ? (
              <OpenOAuthWindowButton
                flow={flow}
                account={account}
                intentsApi={intentsApi}
                konnector={konnector}
                actionMenuItem={true}
                onClick={() => setShowOptions(false)}
              />
            ) : (
              <ActionMenuItem
                left={<Icon icon={SyncIcon} />}
                onClick={() => {
                  SyncButtonAction()
                  setShowOptions(false)
                }}
              >
                {t('card.launchTrigger.button.label')}
              </ActionMenuItem>
            ))}
          {!isKonnectorDisconnected && (
            <ActionMenuItem
              left={<Icon icon={GearIcon} />}
              onClick={() =>
                historyAction(
                  konnectorRoot
                    ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
                        trigger
                      )}/config`
                    : '/config',
                  'push'
                )
              }
            >
              {t('card.launchTrigger.configure')}
            </ActionMenuItem>
          )}
          {!isClisk && isKonnectorDisconnected && (
            <ActionMenuItem
              left={<Icon icon={GearIcon} />}
              onClick={() => historyAction(`${konnectorRoot}/new`, 'push')}
            >
              {t('card.launchTrigger.connect')}
            </ActionMenuItem>
          )}
        </ActionMenu>
      )}
    </>
  )
}

LaunchTriggerAlertMenu.defaultProps = {
  konnectorRoot: ''
}

LaunchTriggerAlertMenu.propTypes = {
  flow: PropTypes.object,
  t: PropTypes.func,
  konnectorRoot: PropTypes.string,
  historyAction: PropTypes.func,
  intentsApi: intentsApiProptype,
  account: PropTypes.object
}

export default withAdaptiveRouter(LaunchTriggerAlertMenu)
