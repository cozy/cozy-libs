import PropTypes from 'prop-types'
import React from 'react'

import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import BottomSheet, {
  BottomSheetItem
} from 'cozy-ui/transpiled/react/BottomSheet'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Copy from 'cozy-ui/transpiled/react/Icons/Copy'
import Edit from 'cozy-ui/transpiled/react/Icons/Rename'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ActionMenuMobile = ({
  onClose,
  isEditable,
  actions,
  appLink,
  appSlug
}) => {
  const { t } = useI18n()
  const { handleCopy, handleEdit } = actions

  return (
    <BottomSheet backdrop onClose={onClose}>
      <BottomSheetItem disableGutters>
        <List>
          {isEditable && (
            <AppLinker app={{ slug: appSlug }} href={appLink}>
              {({ onClick, href }) => {
                return (
                  <ListItem
                    button
                    component="a"
                    href={href}
                    onClick={() => handleEdit(onClick)}
                  >
                    <ListItemIcon>
                      <Icon icon={Edit} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(`Viewer.panel.qualification.actions.edit`)}
                    />
                  </ListItem>
                )
              }}
            </AppLinker>
          )}
          <ListItem button onClick={handleCopy}>
            <ListItemIcon>
              <Icon icon={Copy} />
            </ListItemIcon>
            <ListItemText
              primary={t(`Viewer.panel.qualification.actions.copyClipboard`)}
            />
          </ListItem>
        </List>
      </BottomSheetItem>
    </BottomSheet>
  )
}

ActionMenuMobile.propTypes = {
  onClose: PropTypes.func,
  isEditable: PropTypes.bool,
  actions: PropTypes.shape({
    handleCopy: PropTypes.func,
    handleEdit: PropTypes.func
  }),
  appLink: PropTypes.string
}

export default ActionMenuMobile
