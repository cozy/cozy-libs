import React, { forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const connectAction = ({ isDisconnected, konnectorRoot, navigate }) => ({
  name: 'connectAction',
  action: () => {
    navigate(`${konnectorRoot}/new`)
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
