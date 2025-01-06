import PropTypes from 'prop-types'
import React, { useReducer, useRef } from 'react'

import { isDirectory as isDir } from 'cozy-client/dist/models/file'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  divider,
  makeActions
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useSharingContext } from '../../hooks/useSharingContext'
import { editPermissionLink } from '../Recipient/actions/editPermissionLink'
import { readOnlyPermissionLink } from '../Recipient/actions/readOnlyPermissionLink'
import { revokeLink } from '../Recipient/actions/revokeLink'

export const BoxEditingRights = ({ file, editingRights, setEditingRights }) => {
  const [isMenuDisplayed, toggleMenuDisplayed] = useReducer(
    state => !state,
    false
  )
  const buttonRef = useRef()
  const { t } = useI18n()
  const { documentType } = useSharingContext()

  const isDirectory = isDir(file)

  const actions = makeActions(
    [readOnlyPermissionLink, editPermissionLink, divider, revokeLink],
    {
      t,
      editingRights,
      setEditingRights,
      documentType,
      isDirectory
    }
  )

  const textSecondary =
    editingRights === 'revoke'
      ? t('Share.permissionLink.deactivateDescription')
      : editingRights === 'readOnly'
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
              <Icon icon="people" />
            </ListItemIcon>
            <ListItemText
              primary={t('BoxEditingRights.text')}
              secondary={textSecondary}
            />
            <ListItemIcon className="u-mr-half">
              <Icon icon="bottom" />
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>

      <ActionsMenu
        ref={buttonRef}
        open={isMenuDisplayed}
        docs={[file]}
        actions={actions}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoClose
        onClose={toggleMenuDisplayed}
      />
    </>
  )
}

BoxEditingRights.propTypes = {
  file: PropTypes.object.isRequired,
  editingRights: PropTypes.oneOf(['readOnly', 'write', 'revoke']).isRequired,
  setEditingRights: PropTypes.func.isRequired
}
