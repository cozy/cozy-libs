import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radios from 'cozy-ui/transpiled/react/Radios'

import { isOnlyReadOnlyLinkAllowed } from '../../../helpers/link'
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
          <Radios checked={editingRights === 'write'} />
        </ListItemIcon>
        <ListItemText primary={label} secondary={desc} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'EditPermissionLink'

  return Component
}

/**
 * @param {boolean} isDirectory - true if the document is a directory
 * @param {function} t - translation function
 * @param {string} editingRights - current editing rights
 * @param {function} setEditingRights - function to set editing rights
 * @param {string} documentType - type of the document
 */
export const editPermissionLink = ({
  isDirectory,
  t,
  editingRights,
  setEditingRights,
  documentType
}) => {
  const label = isDirectory
    ? t('Share.permissionLink.modifyFolder')
    : t('Share.permissionLink.modifyFile')
  const desc = t('Share.permissionLink.writeDescription')

  return {
    name: 'editPermissionLink',
    label,
    icon: null,
    displayCondition: () => !isOnlyReadOnlyLinkAllowed({ documentType }),
    action: () => {
      setEditingRights('write')
    },
    Component: makeComponent({ label, desc, editingRights })
  }
}
