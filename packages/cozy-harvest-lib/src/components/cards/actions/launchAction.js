import React, { forwardRef } from 'react'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { findKonnectorPolicy } from '../../../konnector-policies'
import OpenOAuthWindowButton from '../../AccountModalWithoutTabs/OpenOAuthWindowButton'

const launchAction = ({
  flow,
  account,
  intentsApi,
  error,
  historyAction,
  konnectorRoot,
  trigger,
  isDisconnected
}) => ({
  name: 'launchAction',
  action: () => {},
  displayCondition: () => !isDisconnected,
  Component: forwardRef(function LaunchAction(props, ref) {
    const { t } = useI18n()

    const { konnector, launch } = flow
    const konnectorPolicy = findKonnectorPolicy(konnector)

    const onSync = () => {
      if (konnectorPolicy.shouldLaunchRedirectToEdit(error)) {
        return historyAction(
          konnectorRoot
            ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
                trigger
              )}/edit`
            : '/edit',
          'push'
        )
      } else {
        launch({ autoSuccessTimer: false })
      }
    }

    if (konnectorPolicy.shouldLaunchDisplayOAuthWindow(error)) {
      return (
        <OpenOAuthWindowButton
          flow={flow}
          account={account}
          intentsApi={intentsApi}
          konnector={konnector}
          actionMenuItem={true}
        />
      )
    }

    return (
      <ActionsMenuItem {...props} ref={ref} onClick={onSync}>
        <ListItemIcon>
          <Icon icon={SyncIcon} />
        </ListItemIcon>
        <ListItemText primary={t('card.launchTrigger.button.label')} />
      </ActionsMenuItem>
    )
  })
})

export { launchAction }
