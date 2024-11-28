import has from 'lodash/has'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  viewInDrive
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CalendarIcon from 'cozy-ui/transpiled/react/Icons/Calendar'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import FileOutlineIcon from 'cozy-ui/transpiled/react/Icons/FileOutline'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import SafeIcon from 'cozy-ui/transpiled/react/Icons/Safe'
import ServerIcon from 'cozy-ui/transpiled/react/Icons/Server'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makeFormat, makeSize, makeDate, makePath } from './helpers'
import { withViewerLocales } from '../hoc/withViewerLocales'

const Informations = ({ file, t }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { f, lang } = useI18n()
  const format = makeFormat(file)
  const path = makePath(file)
  const size = makeSize(file.size)
  const creation = f(file.created_at, makeDate(lang))
  const modification = f(file.updated_at, makeDate(lang))
  const hasCarbonCopy = has(file, 'metadata.carbonCopy')
  const hasElectronicSafe = has(file, 'metadata.electronicSafe')
  const anchorRef = useRef()

  const actions = makeActions([viewInDrive])

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <Icon icon={FileOutlineIcon} />
        </ListItemIcon>
        <ListItemText
          primary={t('Viewer.panel.informations.format.title', { format })}
          secondary={t('Viewer.panel.informations.format.subtitle')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={ServerIcon} />
        </ListItemIcon>
        <ListItemText
          primary={size}
          secondary={t('Viewer.panel.informations.size')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={FolderIcon} />
        </ListItemIcon>
        <ListItemText
          primary={path}
          secondary={t('Viewer.panel.informations.location')}
        />
        <ListItemSecondaryAction>
          <IconButton ref={anchorRef} onClick={() => setShowMenu(v => !v)}>
            <Icon icon={DotsIcon} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
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
          onClose={() => setShowMenu(false)}
        >
          <ActionsMenuMobileHeader>
            <ListItemText
              primary={t('Viewer.panel.informations.location')}
              primaryTypographyProps={{ align: 'center', variant: 'h6' }}
            />
          </ActionsMenuMobileHeader>
        </ActionsMenu>
      )}
      <ListItem>
        <ListItemIcon>
          <Icon icon={CalendarIcon} />
        </ListItemIcon>
        <ListItemText
          primary={creation}
          secondary={t('Viewer.panel.informations.creation')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={CalendarIcon} />
        </ListItemIcon>
        <ListItemText
          primary={modification}
          secondary={t('Viewer.panel.informations.modification')}
        />
      </ListItem>
      {hasCarbonCopy && (
        <ListItem ellipsis={false}>
          <ListItemIcon>
            <Icon icon={CarbonCopyIcon} />
          </ListItemIcon>
          <ListItemText
            primary={t('Viewer.panel.certifications.carbonCopy.title')}
            secondary={t('Viewer.panel.certifications.carbonCopy.caption')}
          />
        </ListItem>
      )}
      {hasElectronicSafe && (
        <ListItem ellipsis={false}>
          <ListItemIcon>
            <Icon icon={SafeIcon} />
          </ListItemIcon>
          <ListItemText
            primary={t('Viewer.panel.certifications.electronicSafe.title')}
            secondary={t('Viewer.panel.certifications.electronicSafe.caption')}
          />
        </ListItem>
      )}
    </List>
  )
}

Informations.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withViewerLocales(Informations)
