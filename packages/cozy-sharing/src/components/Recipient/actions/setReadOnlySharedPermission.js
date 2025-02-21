import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radios from 'cozy-ui/transpiled/react/Radios'

const makeComponent = ({ label, type, onClick }) => {
  const Component = forwardRef((props, ref) => {
    return (
      <ActionsMenuItem {...props} ref={ref} button={false} onClick={onClick}>
        <ListItemIcon>
          <Radios checked={type === 'one-way'} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'SetReadOnlySharedPermission'

  return Component
}

/**
 * @param {function} t - translation function
 * @param {string} type - current editing rights
 * @param {function} setType - function to set editing rights
 */
export const setReadOnlySharedPermission = ({ t, type, setType }) => {
  const label = t('Share.type.one-way')

  const onClick = () => {
    setType('one-way')
  }

  return {
    name: 'setReadOnlySharedPermission',
    label,
    icon: null,
    action: onClick,
    Component: makeComponent({ label, type, onClick })
  }
}
