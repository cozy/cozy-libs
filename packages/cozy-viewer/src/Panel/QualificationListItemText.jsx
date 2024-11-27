import PropTypes from 'prop-types'
import React from 'react'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'

const QualificationListItemText = ({ primary, secondary, disabled }) => {
  return (
    <ListItemText
      disableTypography
      primary={<Typography variant="caption">{primary}</Typography>}
      secondary={
        <Typography
          component="div"
          variant="body1"
          style={disabled ? { color: 'var(--disabledTextColor)' } : undefined}
        >
          {secondary}
        </Typography>
      }
    />
  )
}

QualificationListItemText.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default QualificationListItemText
