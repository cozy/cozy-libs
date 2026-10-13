import has from 'lodash/has'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import {
  Icon,
  Calendar,
  CarbonCopy,
  Dots,
  FileOutline,
  Folder,
  Safe,
  Server
} from '@linagora/twake-icons'
import { generateWebLink, useClient } from 'cozy-client'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  viewInDrive
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'twake-i18n'

import { makeFormat, makeSize, makeDate, makePath } from './helpers'
import { withViewerLocales } from '../hoc/withViewerLocales'

const Informations = ({ file, isPublic, t }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { f, lang } = useI18n()
  const client = useClient()
  const format = makeFormat(file)
  const path = makePath(file)
  const size = makeSize(file.size)
  const creation = f(file.created_at, makeDate(lang))
  const modification = f(file.updated_at, makeDate(lang))
  const hasCarbonCopy = has(file, 'metadata.carbonCopy')
  const hasElectronicSafe = has(file, 'metadata.electronicSafe')
  const anchorRef = useRef()

  const actions = makeActions([viewInDrive], { client, generateWebLink })

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <Icon icon={FileOutline} />
        </ListItemIcon>
        <ListItemText
          primary={t('Viewer.panel.informations.format.title', { format })}
          secondary={t('Viewer.panel.informations.format.subtitle')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={Server} />
        </ListItemIcon>
        <ListItemText
          primary={size}
          secondary={t('Viewer.panel.informations.size')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={Folder} />
        </ListItemIcon>
        <ListItemText
          primary={path}
          secondary={t('Viewer.panel.informations.location')}
        />
        {!isPublic && (
          <ListItemSecondaryAction>
            <IconButton ref={anchorRef} onClick={() => setShowMenu(v => !v)}>
              <Icon icon={Dots} />
            </IconButton>
          </ListItemSecondaryAction>
        )}
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
          <Icon icon={Calendar} />
        </ListItemIcon>
        <ListItemText
          primary={creation}
          secondary={t('Viewer.panel.informations.creation')}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon={Calendar} />
        </ListItemIcon>
        <ListItemText
          primary={modification}
          secondary={t('Viewer.panel.informations.modification')}
        />
      </ListItem>
      {hasCarbonCopy && (
        <ListItem ellipsis={false}>
          <ListItemIcon>
            <Icon icon={CarbonCopy} />
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
            <Icon icon={Safe} />
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
  isPublic: PropTypes.bool,
  t: PropTypes.func
}

export default withViewerLocales(Informations)
