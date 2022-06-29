import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Paper from 'cozy-ui/transpiled/react/Paper'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import PaperItem from '../Papers/PaperItem'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useStyles = makeStyles(theme => ({
  root: {
    // This values corresponds to the value of the property `border-radius` of the component Paper of MUI
    borderRadius: square => (square ? 0 : theme.shape.borderRadius),
    height: '100%'
  },
  container: {
    height: '100%'
  }
}))

const PaperCardItem = ({ paper, divider, className, square = false }) => {
  const classes = useStyles(square)
  const { removeMultiSelectionFile } = useMultiSelection()

  return (
    <Paper className={`u-h-3 ${className}`} square={square}>
      <PaperItem
        paper={paper}
        divider={divider}
        classes={classes}
        withoutCheckbox
      >
        <IconButton
          color="secondary"
          onClick={() => removeMultiSelectionFile(paper)}
        >
          <Icon icon="cross-circle" />
        </IconButton>
      </PaperItem>
    </Paper>
  )
}

PaperCardItem.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool,
  className: PropTypes.string,
  square: PropTypes.bool
}

export default PaperCardItem
