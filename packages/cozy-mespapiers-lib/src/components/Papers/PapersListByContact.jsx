import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import PapersList from '../Papers/PapersList'

const PapersListByContact = ({ paperslistByContact }) => {
  return (
    <List className="u-pv-0">
      {paperslistByContact.map(({ withHeader, contact, papers }, idx) => (
        <Fragment key={idx}>
          {withHeader && <ListSubheader>{contact}</ListSubheader>}
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
