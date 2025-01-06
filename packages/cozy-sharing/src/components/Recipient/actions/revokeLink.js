import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radios from 'cozy-ui/transpiled/react/Radios'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { useSharingContext } from '../../../hooks/useSharingContext'

const makeComponent = ({ label, desc, editingRights }) => {
  const Component = forwardRef((props, ref) => {
    const { revokeSharingLink } = useSharingContext()

    return (
      <ActionsMenuItem
        {...props}
        ref={ref}
        button={false}
        onClick={() => props.onClick({ revokeSharingLink })}
      >
        <ListItemIcon>
          <Radios checked={editingRights === 'revoke'} />
        </ListItemIcon>
        <ListItemText
          primary={<Typography color="error">{label}</Typography>}
          secondary={desc}
        />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'RevokeLink'

  return Component
}

/**
 * @param {function} t - translation function
 * @param {function} setEditingRights - function to set editing rights
 * @param {string} editingRights - current editing rights
 * @return {object} - revokeLink action
 */
export const revokeLink = ({ t, setEditingRights, editingRights }) => {
  const label = t('Share.permissionLink.deactivate')
  const desc = t('Share.permissionLink.deactivateDescription')

  return {
    name: 'revokeLink',
    label,
    icon: null,
    action: () => {
      setEditingRights('revoke')
    },
    Component: makeComponent({ label, desc, editingRights })
  }
}
