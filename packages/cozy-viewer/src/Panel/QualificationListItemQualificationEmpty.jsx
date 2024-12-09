import React, { useState } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import LabelOutlinedIcon from 'cozy-ui/transpiled/react/Icons/LabelOutlined'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import QualificationModal from './QualificationModal'
import { withViewerLocales } from '../hoc/withViewerLocales'

const QualificationListItemQualificationEmpty = ({ file, t }) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <List>
      <ListItem button onClick={() => setShowMenu(true)}>
        <ListItemIcon>
          <Icon icon={LabelOutlinedIcon} />
        </ListItemIcon>
        <ListItemText
          style={{ color: 'var(--disabledTextColor)' }}
          primaryTypographyProps={{ color: 'inherit' }}
          secondaryTypographyProps={{ color: 'inherit' }}
          primary={t('Viewer.panel.qualification.empty.primary')}
          secondary={t('Viewer.panel.qualification.empty.secondary')}
        />
        <ListItemIcon>
          <Icon icon={RightIcon} color="var(--secondaryTextColor)" />
        </ListItemIcon>
      </ListItem>
      {showMenu && (
        <QualificationModal file={file} onClose={() => setShowMenu(false)} />
      )}
    </List>
  )
}

export default withViewerLocales(QualificationListItemQualificationEmpty)
