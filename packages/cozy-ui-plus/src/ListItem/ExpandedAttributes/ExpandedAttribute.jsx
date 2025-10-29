import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { copyToClipboard } from './helpers'

const ExpandedAttribute = ({ label, value, setAlertProps }) => {
  const { t } = useI18n()

  return (
    <ListItem
      className="u-pl-2"
      button
      onClick={copyToClipboard({ value, setAlertProps, t })}
    >
      <ListItemIcon>
        <Icon icon={CopyIcon} />
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="caption">{label}</Typography>}
        secondary={<Typography variant="body2">{value}</Typography>}
      />
    </ListItem>
  )
}

ExpandedAttribute.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setAlertProps: PropTypes.func
}

export default ExpandedAttribute
