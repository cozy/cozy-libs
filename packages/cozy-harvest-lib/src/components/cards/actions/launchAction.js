import React, { forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { findKonnectorPolicy } from '../../../konnector-policies'
import OpenOAuthWindowButton from '../../AccountModalWithoutTabs/OpenOAuthWindowButton'

const launchAction = ({
  flow,
  account,
  intentsApi,
  error,
  navigate,
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
        return navigate(
          konnectorRoot
            ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
                trigger
              )}/edit`
            : './edit',
          {
            relative: 'path'
          }
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
