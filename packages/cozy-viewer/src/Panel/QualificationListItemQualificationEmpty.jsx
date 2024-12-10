import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import LabelOutlinedIcon from 'cozy-ui/transpiled/react/Icons/LabelOutlined'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { withViewerLocales } from '../hoc/withViewerLocales'

const QualificationListItemQualificationEmpty = ({ t, onClick }) => {
  return (
    <List>
      <ListItem button onClick={onClick}>
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
    </List>
  )
}

QualificationListItemQualificationEmpty.propTypes = {
  onClick: PropTypes.func
}

export default withViewerLocales(QualificationListItemQualificationEmpty)
