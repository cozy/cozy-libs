import PropTypes from 'prop-types'
import React from 'react'

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

import IntentOpener from '../components/IntentOpener'

const ActionMenuMobile = ({ actions, isEditable, onClose }) => {
  const { t } = useI18n()

  return (
    <BottomSheet backdrop onClose={onClose}>
      <BottomSheetItem disableGutters>
        <List>
          {isEditable && (
            <IntentOpener
              action="OPEN"
              doctype="io.cozy.files.paper"
              options={{ path: actions.edit.path }}
              onComplete={onClose}
              onDismiss={onClose}
            >
              <ListItem button>
                <ListItemIcon>
                  <Icon icon={Edit} />
                </ListItemIcon>
                <ListItemText
                  primary={t(`Viewer.panel.qualification.actions.edit`)}
                />
              </ListItem>
            </IntentOpener>
          )}
          <ListItem button onClick={actions.copy.onClick}>
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
  actions: PropTypes.shape({
    copy: PropTypes.object,
    edit: PropTypes.object
  }),
  isEditable: PropTypes.bool,
  onClose: PropTypes.func
}

export default ActionMenuMobile
