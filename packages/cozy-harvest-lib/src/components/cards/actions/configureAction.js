import React, { forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const configureAction = ({
  isDisconnected,
  navigate,
  konnectorRoot,
  trigger
}) => ({
  name: 'configureAction',
  action: () => {
    navigate(
      konnectorRoot
        ? `${konnectorRoot}/accounts/${triggersModel.getAccountId(
            trigger
          )}/config`
        : './config',
      {
        relative: 'path'
      }
    )
  },
  displayCondition: () => !isDisconnected,
  Component: forwardRef(function ConfigureAction(props, ref) {
    const { t } = useI18n()
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={GearIcon} />
        </ListItemIcon>
        <ListItemText primary={t('card.launchTrigger.configure')} />
      </ActionsMenuItem>
    )
  })
})

export { configureAction }
