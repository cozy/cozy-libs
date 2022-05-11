import React from 'react'
import PropTypes from 'prop-types'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Paper from 'cozy-ui/transpiled/react/Paper'

import PaperItem from '../Papers/PaperItem'

const PaperCardItem = ({ paper, divider }) => {
  return (
    <Paper className="u-mh-1">
      <PaperItem paper={paper} divider={divider}>
        <IconButton color="secondary" onClick={() => {}}>
          <Icon icon="cross-circle" />
        </IconButton>
      </PaperItem>
    </Paper>
  )
}

PaperCardItem.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool
}

export default PaperCardItem
