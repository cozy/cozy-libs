import React, { forwardRef } from 'react'

import { getDisplayName } from 'cozy-client/dist/models/contact'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { fetchCurrentUser } from '../../../helpers/fetchCurrentUser'
import getOrCreateAppFolderWithReference from '../../../helpers/getFolderWithReference'
import { makeZipFolder } from '../utils'

export const forwardTo = ({
  t,
  f,
  setFileToForward,
  setIsBackdropOpen,
  setZipFolder
}) => {
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

        const currentUser = await fetchCurrentUser(client)
        const defaultZipFolderName = t('Multiselect.folderZipName', {
          contactName: getDisplayName(currentUser),
          date: f(Date.now(), 'YYYY.MM.DD')
        })

        const { _id: parentFolderId } = await getOrCreateAppFolderWithReference(
          client,
          t
        )

        const zipName = await makeZipFolder({
          client,
          files: docs,
          zipFolderName: defaultZipFolderName,
          dirId: parentFolderId
        })
        setZipFolder({ name: zipName, dirId: parentFolderId })
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
