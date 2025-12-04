import PropTypes from 'prop-types'
import React, { useReducer, useRef } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { isDirectory as isDir } from 'cozy-client/dist/models/file'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { useSharingContext } from '../../hooks/useSharingContext'
import { editPermissionLink } from '../Recipient/actions/editPermissionLink'
import { readOnlyPermissionLink } from '../Recipient/actions/readOnlyPermissionLink'

export const BoxEditingRights = ({ file, editingRights, setEditingRights }) => {
  const [isMenuDisplayed, toggleMenuDisplayed] = useReducer(
    state => !state,
    false
  )
  const buttonRef = useRef()
  const { t } = useI18n()
  const { documentType } = useSharingContext()
  const client = useClient()

  const isDirectory = isDir(file)

  const actions = makeActions([readOnlyPermissionLink, editPermissionLink], {
    client,
    t,
    editingRights,
    setEditingRights,
    documentType,
    isDirectory
  })

  const textPrimary =
    editingRights === 'readOnly'
      ? t('BoxEditingRights.readOnlyTitle')
      : t('BoxEditingRights.editTitle')

  const textSecondary =
    editingRights === 'readOnly'
      ? t('Share.permissionLink.readDescription')
      : t('Share.permissionLink.writeDescription')

  return (
    <>
      <Box
        borderRadius="0.5rem"
        border="1px solid var(--borderMainColor)"
        ref={buttonRef}
      >
        <List className="u-p-0">
          <ListItem
            button
            size="large"
            ellipsis={false}
            onClick={toggleMenuDisplayed}
          >
            <ListItemIcon>
              <Icon icon={PeopleIcon} />
            </ListItemIcon>
            <ListItemText primary={textPrimary} secondary={textSecondary} />
            <ListItemIcon className="u-mr-half">
              <Icon icon={BottomIcon} />
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>

      <ActionsMenu
        ref={buttonRef}
        open={isMenuDisplayed}
        docs={[file]}
        actions={actions}
        autoClose
        onClose={toggleMenuDisplayed}
      />
    </>
  )
}

BoxEditingRights.propTypes = {
  file: PropTypes.object.isRequired,
  editingRights: PropTypes.oneOf(['readOnly', 'write']).isRequired,
  setEditingRights: PropTypes.func.isRequired
}
