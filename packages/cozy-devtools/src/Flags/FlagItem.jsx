import React from 'react'
import { ObjectInspector } from 'react-inspector'

import flagUtils from 'cozy-flags'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import PenIcon from 'cozy-ui/transpiled/react/Icons/Pen'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const FlagItem = ({ flag, onEdit, onTrash }) => {
  const handleCheckboxChange = e => {
    flagUtils(flag.name, e.target.checked)
    location.reload()
  }

  return (
    <ListItem size="small">
      <ListItemIcon>
        {flag.type === 'boolean' ? (
          <Checkbox
            size="small"
            checked={flag.value}
            onChange={handleCheckboxChange}
          />
        ) : null}
      </ListItemIcon>
      <ListItemText
        primary={flag.humanName}
        secondary={
          flag.type === 'object' ? (
            <ObjectInspector data={flag.value} />
          ) : flag.type !== 'boolean' ? (
            flag.humanValue
          ) : null
        }
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => onEdit(flag)}>
          <Icon icon={PenIcon} />
        </IconButton>
        <IconButton onClick={() => onTrash(flag)}>
          <Icon icon={TrashIcon} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default FlagItem
