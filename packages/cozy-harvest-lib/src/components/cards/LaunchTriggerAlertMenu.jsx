import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import { useClient } from 'cozy-client'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'

import { isDisconnected } from '../../helpers/konnectors'
import { getAccountId } from '../../helpers/triggers'
import { findKonnectorPolicy } from '../../konnector-policies'
import { useFlowState } from '../../models/withConnectionFlow'
import withAdaptiveRouter from '../hoc/withRouter'
import useMaintenanceStatus from '../hooks/useMaintenanceStatus'

const LaunchTriggerAlertMenu = ({ flow, t, konnectorRoot, historyAction }) => {
  const client = useClient()
  const { running, trigger, error } = useFlowState(flow)
  const { launch, konnector } = flow
  const {
    data: { isInMaintenance }
  } = useMaintenanceStatus(client, konnector)
  const isKonnectorDisconnected = isDisconnected(konnector, trigger)
  const konnectorPolicy = findKonnectorPolicy(konnector)
  const isClick = konnectorPolicy.name === 'clisk'

  const anchorRef = useRef()
  const [showOptions, setShowOptions] = useState(false)

  const isInError = !!error
  const SyncButtonAction =
    isInError && !isClick
      ? () =>
          historyAction(
            konnectorRoot
              ? `${konnectorRoot}/accounts/${getAccountId(trigger)}/edit`
              : '/edit',
            'push'
          )
      : () => launch({ autoSuccessTimer: false })

  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setShowOptions(true)}>
        <Icon icon={DotsIcon} />
      </IconButton>
      {showOptions && (
        <ActionMenu
          anchorElRef={anchorRef}
          autoclose={true}
          onClose={() => setShowOptions(false)}
        >
          {!running && !isInMaintenance && !isKonnectorDisconnected && (
            <ActionMenuItem
              left={<Icon icon={SyncIcon} />}
              onClick={() => {
                SyncButtonAction()
                setShowOptions(false)
              }}
            >
              {t('card.launchTrigger.button.label')}
            </ActionMenuItem>
          )}
          {!isKonnectorDisconnected && (
            <ActionMenuItem
              left={<Icon icon={GearIcon} />}
              onClick={() =>
                historyAction(
                  konnectorRoot
                    ? `${konnectorRoot}/accounts/${getAccountId(
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
          {isKonnectorDisconnected && (
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
  historyAction: PropTypes.func
}

export default withAdaptiveRouter(LaunchTriggerAlertMenu)
