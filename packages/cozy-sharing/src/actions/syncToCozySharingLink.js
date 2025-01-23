import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { openExternalLink } from '../helpers/sharings'
import { getActionsI18n } from '../hoc/withLocales'

const makeComponent = (label, icon) => {
  const Component = forwardRef((props, ref) => {
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'SyncToCozySharingLink'

  return Component
}

export const syncToCozySharingLink = ({
  openSharingLinkDisplayed = true,
  isShortLabel = false,
  syncSharingLink
}) => {
  const { t } = getActionsI18n()
  const label = t('Share.banner.sync_to_mine', {
    smart_count: isShortLabel ? 1 : 2
  })
  const icon = SyncIcon

  return {
    name: 'syncToCozySharingLink',
    label,
    icon,
    displayCondition: () => openSharingLinkDisplayed,
    action: () => {
      openExternalLink(syncSharingLink)
    },
    Component: makeComponent(label, icon)
  }
}
