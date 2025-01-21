import React, { forwardRef } from 'react'

import { isEncryptedFileOrFolder } from 'cozy-client/dist/models/file'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getViewerI18n } from '../../locales'

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

  Component.displayName = 'share'

  return Component
}

export const share = ({
  allLoaded,
  hasWriteAccess,
  setShowShareModal,
  isPublic
}) => {
  const { t } = getViewerI18n()
  const icon = ShareIcon
  const label = t('Viewer.actions.share')

  return {
    name: 'share',
    icon,
    label,
    displayCondition: docs => {
      return (
        !isPublic &&
        allLoaded && // We need to wait for the sharing context to be completely loaded to avoid race conditions
        hasWriteAccess(docs?.[0]?.dir_id) &&
        docs?.length === 1 &&
        !isEncryptedFileOrFolder(docs[0])
      )
    },
    Component: makeComponent(label, icon),
    action: () => setShowShareModal(true)
  }
}
