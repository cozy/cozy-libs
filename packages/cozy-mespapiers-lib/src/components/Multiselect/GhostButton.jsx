import PropTypes from 'prop-types'
import React from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  buttonStartIcon: {
    marginRight: '1.5rem'
  },
  buttonRoot: {
    borderRadius: '0.5rem',
    padding: '2rem 1rem 2rem 1.5rem',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 'normal'
  },
  label: {
    justifyContent: 'flex-start'
  }
})

const GhostButton = ({ label, fullWidth, onClick = undefined }) => {
  const styles = useStyles()

  return (
    <Buttons
      label={label}
      classes={{
        label: styles.label,
        root: styles.buttonRoot,
        startIcon: styles.buttonStartIcon
      }}
      fullWidth={fullWidth}
      onClick={onClick}
      variant="ghost"
      startIcon={<Icon icon="plus" />}
    />
  )
}

GhostButton.propTypes = {
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func
}

export default GhostButton
