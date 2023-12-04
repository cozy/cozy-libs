import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const connectAction = ({ isDisconnected, konnectorRoot, historyAction }) => ({
  name: 'connectAction',
  action: () => {
    historyAction(`${konnectorRoot}/new`, 'push')
  },
  displayCondition: () => isDisconnected,
  Component: forwardRef(function ConnectAction(props, ref) {
    const { t } = useI18n()
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={GearIcon} />
        </ListItemIcon>
        <ListItemText primary={t('card.launchTrigger.connect')} />
      </ActionsMenuItem>
    )
  })
})

export { connectAction }
