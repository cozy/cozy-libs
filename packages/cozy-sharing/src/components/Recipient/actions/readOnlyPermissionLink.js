import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radios from 'cozy-ui/transpiled/react/Radios'

import { useSharingContext } from '../../../hooks/useSharingContext'

const makeComponent = ({ label, desc, editingRights }) => {
  const Component = forwardRef((props, ref) => {
    const { updateDocumentPermissions } = useSharingContext()

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        button={false}
        onClick={() => props.onClick({ updateDocumentPermissions })}
      >
        <ListItemIcon>
          <Radios checked={editingRights === 'readOnly'} />
        </ListItemIcon>
        <ListItemText primary={label} secondary={desc} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'ReadOnlyPermissionLink'

  return Component
}

/**
 * @param {boolean} isDirectory - true if the document is a directory
 * @param {function} t - translation function
 * @param {string} editingRights - current editing rights
 * @param {function} setEditingRights - function to set editing rights
 */
export const readOnlyPermissionLink = ({
  isDirectory,
  t,
  editingRights,
  setEditingRights
}) => {
  const label = isDirectory
    ? t('Share.permissionLink.seeFolder')
    : t('Share.permissionLink.seeFile')
  const desc = t('Share.permissionLink.readDescription')

  return {
    name: 'readOnlyPermissionLink',
    label,
    icon: null,
    action: () => {
      setEditingRights('readOnly')
    },
    Component: makeComponent({ label, desc, editingRights })
  }
}
