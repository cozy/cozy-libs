import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'
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
  Component.displayName = 'CreateCozySharingLink'

  return Component
}

export const createCozySharingLink = ({
  openSharingLinkDisplayed = true,
  isShortLabel = false,
  createCozyLink
}) => {
  const { t } = getActionsI18n()
  const label = t('Share.create-cozy', { smart_count: isShortLabel ? 1 : 2 })
  const icon = ToTheCloudIcon

  return {
    name: 'createCozySharingLink',
    label,
    icon,
    displayCondition: () => openSharingLinkDisplayed,
    action: () => {
      openExternalLink(createCozyLink)
    },
    Component: makeComponent(label, icon)
  }
}
