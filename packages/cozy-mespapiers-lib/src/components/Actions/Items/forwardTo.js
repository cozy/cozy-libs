import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { makeZipFolder } from '../utils'

export const forwardTo = ({ t, f, setFileToForward, setIsBackdropOpen }) => {
  const label = t('action.forwardTo')
  const icon = 'reply'

  return {
    name: 'forwardTo',
    label,
    icon,
    disabled: docs => docs.length === 0,
    action: async (docs, { client }) => {
      if (docs.length === 1) {
        setFileToForward(docs[0])
      } else {
        setIsBackdropOpen(true)

        const res = await makeZipFolder({ client, docs, t, f })

        setIsBackdropOpen(false)

        setFileToForward(res)
      }
    },
    Component:
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon={icon} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ActionsMenuItem>
        )
      })
  }
}
