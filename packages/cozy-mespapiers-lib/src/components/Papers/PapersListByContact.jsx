import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import PapersList from '../Papers/PapersList'

const useStyles = makeStyles({
  root: { textIndent: '1rem' }
})

const PapersListByContact = ({ paperslistByContact }) => {
  const classes = useStyles()
  const { isMobile } = useBreakpoints()

  return (
    <List>
      {paperslistByContact.map(({ withHeader, contact, papers }, idx) => (
        <Fragment key={idx}>
          {withHeader && (
            <ListSubheader classes={isMobile ? classes : undefined}>
              {contact}
            </ListSubheader>
          )}
          <PapersList papers={papers} />
        </Fragment>
      ))}
    </List>
  )
}

PapersListByContact.propTypes = {
  paperslistByContact: PropTypes.arrayOf(PropTypes.object)
}

export default PapersListByContact
