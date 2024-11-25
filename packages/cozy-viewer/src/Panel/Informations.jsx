import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CalendarIcon from 'cozy-ui/transpiled/react/Icons/Calendar'
import FileOutlineIcon from 'cozy-ui/transpiled/react/Icons/FileOutline'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import ServerIcon from 'cozy-ui/transpiled/react/Icons/Server'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makeFormat, makeSize, makeDate, makePath } from './helpers'
import { withViewerLocales } from '../hoc/withViewerLocales'

const Informations = ({ file, t }) => {
  const { f, lang } = useI18n()
  const format = makeFormat(file)
  const path = makePath(file)
  const size = makeSize(file.size)
  const creation = f(file.created_at, makeDate(lang))
  const modification = f(file.updated_at, makeDate(lang))

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
      </ListItem>
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
    </List>
  )
}

Informations.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withViewerLocales(Informations)
