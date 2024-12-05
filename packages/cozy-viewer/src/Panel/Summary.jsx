import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  editAttribute,
  copyToClipboard
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import TextIcon from 'cozy-ui/transpiled/react/Icons/Text'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import QualificationListItemText from './QualificationListItemText'
import SummaryDialog from './SummaryDialog'
import { withViewerLocales } from '../hoc/withViewerLocales'

const Summary = ({ file, t }) => {
  const [showModal, setShowModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const anchorRef = useRef()
  const { showAlert } = useAlert()

  const label = t('Viewer.panel.summary')
  const value = file.metadata?.description
  const actions = makeActions([copyToClipboard, editAttribute])

  const handleClick = async () => {
    if (value) {
      await copyToClipboard().action(undefined, { showAlert, copyValue: value })
    } else {
      setShowModal(true)
    }
  }

  return (
    <List>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <Icon icon={TextIcon} />
        </ListItemIcon>
        <QualificationListItemText
          primary={value && label}
          secondary={value || label}
          disabled={!value}
        />
        {value ? (
          <ListItemSecondaryAction>
            <IconButton ref={anchorRef} onClick={() => setShowMenu(v => !v)}>
              <Icon icon={DotsIcon} />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          <ListItemIcon>
            <Icon icon={RightIcon} />
          </ListItemIcon>
        )}
      </ListItem>
      {showModal && (
        <SummaryDialog file={file} onClose={() => setShowModal(false)} />
      )}
      {showMenu && (
        <ActionsMenu
          ref={anchorRef}
          open={true}
          docs={[file]}
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          autoClose
          componentsProps={{
            actionsItems: {
              actionOptions: {
                showAlert,
                copyValue: value,
                editAttributeCallback: () => setShowModal(true)
              }
            }
          }}
          onClose={() => setShowMenu(false)}
        >
          <ActionsMenuMobileHeader>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ align: 'center', variant: 'h6' }}
            />
          </ActionsMenuMobileHeader>
        </ActionsMenu>
      )}
    </List>
  )
}

Summary.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withViewerLocales(Summary)
